/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Tianshi
 * @Date: 2020-05-03 04:13:29
 * @LastEditors: Tianshi
 * @LastEditTime: 2020-05-05 03:05:29
 */

var config = require('../db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);
const commonJS = require('../utils/common.js');

exports.login = login;
exports.signup = signup;
exports.collect = collect;
exports.getStarStatus = getStarStatus;
exports.unlike = unlike;
exports.history = history;
/**
 * 
 * Login
 * 
 * @param {_} req 
 * @param {_} res 
 * @param {_} next 
 * 
 * @return 
 */
function login(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    var query = `SELECT user.password AS password, user.id AS id FROM user WHERE email = '${email}';`;

    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            if (rows[0] == null) {
                res.send(commonJS.createJsonString(false, null, "No such user"));
                return
            } else if (rows[0].password == password) {
                // console.log("success login\n");
                res.send(commonJS.createJsonString(true, rows[0].id, "Login Successfully"));
                return
            } else {
                res.send(commonJS.createJsonString(false, null, "Incorrect password"));
            }

        }
    });
}

/**
 * 
 * Login
 * 
 * @param {_} req 
 * @param {_} res 
 * @param {_} next 
 * 
 * @return 
 */
function signup(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    var query = `SELECT * FROM user WHERE email = '${email}';`;

    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {


            if (typeof rows[0] != 'undefined') {

                console.log('Already exists email ', email)

                res.send(commonJS.createJsonString(false, null, "User has already registered using the email"))
                return
            } else {

                if (err) throw err;

                var sql = "INSERT INTO user (id, email, password) VALUES ?";
                var values = [
                    [null, email, password],
                ];
                connection.query(sql, [values], function (err, result) {
                    if (err) throw err;

                    res.send(commonJS.createJsonString(true, result.insertId, "Registered Successfully"))
                });
            }


        }
    });
}
/**
 * 
 * collect photo with user id
 * 
 * @param {_} req 
 * @param {_} res 
 * @param {_} next 
 * 
 * @return 
 */
function collect(req, res, next) {
    var userID = req.body.userID;
    var imageID = req.body.imageID;

    var sql = "INSERT INTO user_collections (id, artwork_id) VALUES ?";
    var values = [
        [userID, imageID],
    ];
    console.log(userID)
    console.log(imageID)
    connection.query(sql, [values], function (err, result) {
        if (err) {
            res.send(commonJS.createJsonString(false, null, "Insert failure"))
            throw err;

        } else {
            res.send(commonJS.createJsonString(true, result, "Insert success"))
        }
    });
}

/**
 * 
 * get star status with user id
 * 
 * @param {_} req 
 * @param {_} res 
 * @param {_} next 
 * 
 * @return 
 */
function getStarStatus(req, res, next) {
    var userID = req.body.userID;
    var imageID = req.body.imageID;

    var query = `SELECT * FROM user_collections WHERE id = '${userID}' AND artwork_id = '${imageID}' ;`;

    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        }
        else {
            if (rows[0] == null) {
                res.send(commonJS.createJsonString(false, null, "Haven't starred yet"))
            } else {
                res.send(commonJS.createJsonString(true, rows, "Already starred"))
            }


        }
    });
}

/**
 * 
 * get star status with user id
 * 
 * @param {_} req 
 * @param {_} res 
 * @param {_} next 
 * 
 * @return 
 */
function unlike(req, res, next) {
    var userID = req.body.userID;
    var imageID = req.body.imageID;

    var query = `DELETE FROM user_collections WHERE id = '${userID}' AND artwork_id = '${imageID}';`;

    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        }
        else {

            res.send(commonJS.createJsonString(true, null, "Deleted star"))



        }
    });
}

/**
 * 
 * history
 * 
 * @param {_} req 
 * @param {_} res 
 * @param {_} next 
 * 
 * @return 
 */
function history(req, res, next) {
    var artwork_ids = req.body.historyImageIDs;
    // console.log(userIDs)


    artwork_ids.forEach(function (value) {
     
        var query = `SELECT * FROM history WHERE artwork_id = '${value}';`;
        connection.query(query, function (err, rows, fields) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (rows[0] != undefined) {
   
                var i = new Number(rows[0].count)
                var count =  i + 1
    
                var sql = `UPDATE history SET count ='${count}' WHERE artwork_id = '${value}'`;
                connection.query(sql, function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                });

            } else {
                var sql = "INSERT INTO history (artwork_id, count) VALUES ?";
                var values = [
                    [value, 1],
                ];
                console.log(rows)
                connection.query(sql, [values], function (err, result) {
                    if (err) throw err;
                    console.log(result)
                });
            }
        });     
    });

}