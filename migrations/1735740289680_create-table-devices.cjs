exports.shorthands = undefined;

exports.up = (pgm) => {
  // Membuat tipe ENUM untuk kolom status
  pgm.createType('device_status', ['active', 'inactive', 'maintenance', 'error']);

  // Membuat tabel devices
  pgm.createTable('devices', {
    id: {
      type: 'VARCHAR(23)',
      notNull: true,
      primaryKey: true, // Menetapkan id sebagai primary key
    },
    rental_id: {
      type: 'VARCHAR(23)',
      references: '"rentals"', // Menunjukkan kolom rental_id adalah foreign key ke tabel rental
      onDelete: 'SET NULL', // Jika rental dihapus, rental_id di perangkat diset ke NULL
      default: null, // rental_id bisa bernilai NULL saat perangkat belum dialokasikan
    },
    status: {
      type: 'device_status', // Menggunakan tipe ENUM yang baru dibuat
      notNull: true,
    },
    last_reported_issue: {
      type: 'TIMESTAMP',
      default: null, // Tidak wajib diisi
    },
    last_active: {
      type: 'INTEGER',
      default: 0,
      notNull: false,
    },
    sensor_topic: {
      type: 'VARCHAR(255)',
      notNull: true, // Menyimpan topik untuk menerima data sensor
    },
    control_topic: {
      type: 'VARCHAR(255)',
      notNull: true, // Menyimpan topik untuk mengirimkan perintah kontrol
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    reserved_until: {
      type: 'TIMESTAMP', // Kolom reserved_until untuk menyimpan waktu kedaluwarsa reservasi perangkat
      default: null, // Nilai default adalah NULL, perangkat tidak terreservasi
    },
    created_at: {
      type: 'TIMESTAMP',
      default: pgm.func('current_timestamp'), // Menyimpan waktu pembuatan perangkat
    },
  });
};

exports.down = (pgm) => {
  // Menghapus tabel devices
  pgm.dropTable('devices');

  // Menghapus tipe ENUM
  pgm.dropType('device_status');
};
