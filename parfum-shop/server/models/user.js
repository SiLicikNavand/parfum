const db = require("../config/database");

const User = {
  findByUsername: (username, callback) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], callback);
  }
};

module.exports = User;
