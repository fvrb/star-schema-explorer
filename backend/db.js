const sql = require('mssql/msnodesqlv8');

const config = {
    driver: 'msnodesqlv8',
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=localhost\\SQL2019,1433;Database=AdventureWorksDW2019;Trusted_Connection=yes;',
};

const pool = new sql.ConnectionPool(config);

const getPool = async () => {
    if (!pool.connected) {
        await pool.connect();
    }
    return pool;
};

module.exports = {
    sql,
    getPool
};