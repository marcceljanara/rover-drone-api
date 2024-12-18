import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import pkg from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';
import AuthenticationError from '../../exceptions/AuthenticationError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

const { Pool } = pkg;

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async registerUser({
    username, password, fullname, email,
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `user-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO users (id, username, password, fullname, email, is_verified) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, username, hashedPassword, fullname, email, false],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan user');
    }
    return result.rows[0].id;
  }

  async checkExistingUser({ email, username }) {
    const query = {
      text: 'SELECT username, email FROM users WHERE username = $1 OR email = $2',
      values: [username, email],
    };

    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError('Email atau username sudah terdaftar. Silakan gunakan email atau username lain.');
    }
  }

  async generateOtp(email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const query = {
      text: 'UPDATE users SET otp_code = $1, otp_expiry = NOW() + INTERVAL \'15 minutes\' WHERE email = $2 RETURNING otp_code',
      values: [otp, email],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Email tidak ditemukan');
    }
    return otp;
  }

  async verifyOtp(email, otp) {
    const query = {
      text: 'SELECT otp_code, otp_expiry FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Email tidak ditemukan');
    }

    const { otp_code: storedOtp, otp_expiry: otpExpiresAt } = result.rows[0];

    if (otp !== storedOtp) {
      throw new AuthenticationError('Kode OTP salah');
    }

    if (new Date() > new Date(otpExpiresAt)) {
      throw new AuthenticationError('Kode OTP telah kadaluarsa');
    }

    const updateQuery = {
      text: 'UPDATE users SET is_verified = $1, otp_code = NULL, otp_expiry = NULL WHERE email = $2',
      values: [true, email],
    };

    await this._pool.query(updateQuery);
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, password, role FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword, role } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return { id, role };
  }

  async checkStatusAccount(email) {
    const query = {
      text: 'SELECT is_verified FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      // Jika email tidak ditemukan
      throw new NotFoundError('Email tidak ditemukan');
    }
    const { is_verified } = result.rows[0];

    // Jika is_verified adalah false, maka lemparkan error
    if (!is_verified) {
      throw new AuthenticationError('Anda belum melakukan verifikasi email, silahkan lakukan verifikasi terlebih dahulu');
    }
  }
}

export default UserService;
