require('dotenv').config(); // this is important!
module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": "datenow_db",
    "host": "localhost",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    // "username": "root",
    // "password": null,
    // "database": "database_production",
    // "host": "127.0.0.1",
    "use_env_vairable":"JAWSDB_URL",
    "dialect": "mysql"
  }
}
