/* istanbul ignore file */
import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool();

const ReportsTableTestHelper = {
  async findReportById(id) {
    const query = {
      text: 'SELECT * FROM reports WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM reports WHERE 1=1');
  },
};

export default ReportsTableTestHelper;
