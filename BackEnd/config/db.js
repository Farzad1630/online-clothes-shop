const sql = require("mssql");
require("dotenv").config();

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_NAME:", process.env.DB_NAME);

// تنظیمات اتصال به SQL Server
const config = {
  user: process.env.DB_USER,       // یوزر SQL Server
  password: process.env.DB_PASS,   // پسورد SQL Server
  server: process.env.DB_SERVER,   // مثلا: localhost
  database: process.env.DB_NAME,   // اسم دیتابیس
  options: {
    encrypt: false,                // روی ویندوز معمولا false
    trustServerCertificate: true   // برای dev روی true بذار
  }
};

// ساخت pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Connected to MSSQL");
    return pool;
  })
  .catch(err => {
    console.error("❌ Database Connection Failed! Bad Config:", err);
    throw err;
  });

module.exports = {
  sql, poolPromise
};
