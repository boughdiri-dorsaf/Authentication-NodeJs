let connexion = require("../config/db")

class User{

    constructor(row){
      this.row = row;
    }

    static getUsers(callBack){
      connexion.query('Select * from users', (err, rows) => {
        if(err) throw err
        callBack(rows.map((row) => new User(row)))
      })
    };

    static create(data, callback){
        connexion.query(
            'INSERT INTO `users`(`email`, `password`, `username`) VALUES (?, ?, ?)',[data.email, data.password, data.username], (err, res) => {
                if(err){
                    return callback(err);
                } 
                return callback(null, res)
              }
        );
    };

  static getUserByUserId(id, callBack){
    connexion.query(
      `select id,email,username from users where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  };

  static updateUser(data, callBack){
    connexion.query(
      `update users set email=?, password=?, username=? where id = ?`,
      [
        data.email,
        data.password,
        data.username,
        data.id
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  };

  static deleteUser(id, callBack){
    connexion.query(
      `delete from users where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  };

  static getUserByUserEmail(email, callBack){
    connexion.query(
      `select * from users where email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  };
  

    
}

module.exports = User
