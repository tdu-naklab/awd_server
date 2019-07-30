const express = require("express");
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const mysql_config = {
    host: 'localhost',
    user: 'awd_user',
    password: 'awd_password',
    database: 'awd_database',
};

const error_msg = {
    "Error": {
        "Message" : "error message",
    },
};

const connection = mysql.createConnection(mysql_config);

// /users
app.route('/users')
    // POST ユーザ登録
    // - [integer] barcode(required): barcode (8 digits)
    // - [string]  name(required): username (under 64 chars)
    // - [string]  machine_name(optional): machine name (under 64 chars)
    .post((request, response) => {
        connection.query('INSERT INTO users (barcode, name, machine_name) VALUES (?, ?, ?)', [request.body.barcode, request.body.name, request.body.machine_name], (err, res) => {
            if(err) {
                // throw err;
                response.send(error_msg);
            }
            else {
                connection.query('SELECT * FROM users WHERE id = ?', [res.insertId], (e, r) => {
                    if (e) {
                        throw e;
                    }
                    response.send(r[0]);
                });
            }
        });
    })
    // GET ユーザ一覧取得
    .get((request, response) => {
        connection.query('SELECT * FROM users', (err, res) => {
            if(err) {
                throw err;
            }
            response.send(res);
        });
    });

// /users/:id
app.route('/users/:id')
    // GET ユーザ情報取得
    .get((request, response) => {
        connection.query('SELECT * FROM users WHERE id = ?', [request.params.id], (err, res) => {
            if(err) {
                throw err;
            }
            response.send(res[0]);
        });
    })
    // PUT ユーザ情報更新
    .put((request, response) => {
        connection.query('UPDATE users SET barcode=?, name=?, machine_name=? WHERE id=?', [request.body.barcode, request.body.name, request.body.machine_name, request.params.id], (err, res) => {
            if(err) {
                throw err;
            }
            else {
                connection.query('SELECT * FROM users WHERE id = ?', [request.params.id], (e, r) => {
                    if (e) {
                        throw e;
                    }
                    response.send(r[0]);
                });
            }
        });
    })
    // DELETE ユーザ削除
    .delete((request, response) => {
        connection.query('DELETE FROM users WHERE id = ?', [request.params.id], (err, res) => {
            if(err) {
                throw err;
            }
            const res_msg = {
                "Result": {
                    "message" : "deleted",
                },
            };
            response.send(res_msg);
        });
    });

// /race
app.route('/race')
    .post((request, response) => {

    });


app.listen(3000, () => {
    console.log('server is launched at port 3000.');
});
