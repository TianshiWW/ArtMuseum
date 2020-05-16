/*
// 'use strict';
const oracledb = require('oracledb');
const dbConfig = require('./db-config.js');

async function get10RandomPaintings() {


  let connection;
  try {
    // Get a non-pooled connection
    connection = await oracledb.getConnection(dbConfig);

    console.log('Connection was successful!');

    var query = `
    SELECT Page_Link, Image_Source, Title
    FROM Artwork
    WHERE ROWNUM <= 10
    ORDER BY DBMS_RANDOM.RANDOM;
    `;

    connection.execute(query, function(err, rows) {
      if (err) console.log(err);
      else {
        console.log(rows);
        res.json(rows);
      }
    });

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

get10RandomPaintings();



let run = async function(callback) {

  let connection;

  try {
    // Get a non-pooled connection
    connection = await oracledb.getConnection(dbConfig);

    console.log('Connection was successful!');

    var query = `SELECT Page_Link, Image_Source, Title
                FROM Artwork
                WHERE ROWNUM <= 10
                ORDER BY DBMS_RANDOM.RANDOM;`;

    connection.execute(query, function(e, r){
      callback(r);
      return;
    });


  } catch (err) {
    console.error(err);
    return;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
        return;
      }
    }
  }
}

run(function (res) {console.log(res)});


module.exports = function()  {
    var oracledb = require('oracledb');
    var dbConfig = require('./dbconfig.js');

    this.queryDB = function (query) {
        var X;
        oracledb.getConnection({
            user            : dbConfig.user,
            password        : dbConfig.password,
            connectString   : dbConfig.connectString
        }, function(err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            connection.execute(query, function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                console.log(result.metaData);
                console.log(result.rows);
                doRelease(connection);
                X = result.rows
            });
        });

        function doRelease(connection) {
            connection.release(function(err) {
                if (err) {
                    console.error(err.message);
                }
            });
        }
        return X;
    }
}

*/

var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Q1a (Dashboard) ---- */
function get10RandomPaintings() {

  var query = `SELECT Page_Link, IMAGE_SOURCE, Title
              FROM ARTWORK
              ORDER BY RAND()
              LIMIT 10;`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
    }
  });

};

get10RandomPaintings();
