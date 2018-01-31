var mysql = require('mysql');

function connectServer() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'chat'
    })
    return connection;
}

function select(connection, name, callback) {
    var sql = "select password,time from login where name = '" + name + "'";
    console.log(sql);
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        callback(results);
    });
}

function insert(connection, name, password, timeByFormat, callback) {
    var sql = "insert into login (name,password,time) values ('" + name + "','" + password + "','" + timeByFormat + "')";
    console.log(sql);
    connection.query(sql, function (err, rs) {
        if (err) {
            console.log("error:" + err.message);
            callback(err.message);
        } else {
            callback("ok");
        }
    });
}

exports.connectServer = connectServer;
exports.insert = insert;
exports.select = select;


