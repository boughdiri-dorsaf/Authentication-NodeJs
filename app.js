require("dotenv").config();
const User = require('./models/user');
const app = require('express')();
let bodyParser = require('body-parser')
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const versionApi = '/api';
const { sign } = require("jsonwebtoken");
const { checkToken } = require("./auth/token_validation")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get(`${versionApi}/users`, checkToken,(req, res) => {
        User.getUsers((results, err) => {
            if (err) {
              console.log(err);
              return;
            }
            return res.json({
              success: 1,
              data: results
            });
        });
})

app.post(`${versionApi}/users`, (req, res) => {
    if(req.body === undefined || req.body === ''){
        res.json("Vous n'avez pas entré de informations :( ")
    }else{
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        User.create(body, (err, results) => {
            if(err){
                console.log(err);
            }
            if (!results) {
              return res.json({
                success: 0,
                message: "Failed to add user"
              });
            }
            return res.status(200).json({
                success : 1,
                data : results
            });
        })
    }
})

app.get(`${versionApi}/users/:id`,checkToken, (req, res) => {
    const id = req.params.id;
    User.getUserByUserId(id, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found"
            });
          }
          results.password = undefined;
          return res.json({
            success: 1,
            data: results
          });
        });
})

 
app.patch(`${versionApi}/users`,checkToken, (req, res) => {
    if(req.body === undefined || req.body === ''){
        res.json("Vous n'avez pas entré de message :( ")
    }else{
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        User.updateUser(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
              return res.json({
                success: 0,
                message: "Failed to update user"
              });
            }
            return res.status(200).json({
                success : 1,
                data : req.body
            });
        });
    }
});

app.delete(`${versionApi}/users/:id`,checkToken, (req, res) => {    
    const id = req.params.id;
    User.deleteUser(id, (err,results) => {
        if (err) {
          console.log(err);
          return;
        }
        if (!results) {
          return res.json({
            success: 0,
            message: "Failed to delete user"
          });
        }
        return res.json({
          success: 1,
          message: "user deleted successfully"
        });
    });
})

app.post(`${versionApi}/users/login`, (req, res) => {
    const body = req.body;
    User.getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password"
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, process.env.JWT_KEY, {
          expiresIn: "1h"
        });
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password"
        });
      }
    });
}); 
app.listen(process.env.APP_PORT, ()=>{
    console.log("Server up and running on port: ", process.env.APP_PORT);
})