exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create enum for rental_status
  pgm.createType('rental_status', ['pending', 'active', 'completed', 'cancelled']);

  // Create rentals table
  pgm.createTable('rentals', {
    id: {
      type: 'VARCHAR(23)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(22)',
      notNull: true,
      references: '"users"', // Foreign key ke tabel users
      onDelete: 'CASCADE', // Jika user dihapus, rental terkait ikut dihapus
    },
    start_date: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    end_date: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    rental_status: {
      type: 'rental_status',
      notNull: true,
      default: 'pending', // Status awal "pending"
    },
    cost: {
      type: 'INTEGER',
      notNull: true,
      check: 'cost > 0', // Biaya sewa harus lebih besar dari 0
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
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMP',
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('rentals');
  pgm.dropType('rental_status');
};
