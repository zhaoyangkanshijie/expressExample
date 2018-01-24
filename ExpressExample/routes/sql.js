var mysql = require('mysql');

function connectServer() {
    var client = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'chat'
    })
    return client;
}

function insert(connection, name, password,callback) {
    var sql = "insert into login (name,password,isRemember,time) values ('" + name + "','" + password + "',0,now())";
    console.log(sql);
    connection.query(sql, function (err, rs) {
        if (err) {
            console.log("error:" + err.message);
            return err;
        }
        callback(err);
    });
}

function select(connection, name, password, callback) {
    var sql = "select * from login";
    console.log(sql);
    client.query(sql, function (err, results, fields) {
        if (err) throw err;

        callback(results);
    });
}



exports.connectServer = connectServer;
exports.insert = insert;
exports.select = select;


