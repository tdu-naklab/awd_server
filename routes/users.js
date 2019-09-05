const express = require('express');
const mysql = require('promise-mysql');
const router = express.Router();

const mysql_config = {
  host: 'localhost',
  user: 'awd_user',
  password: 'awd_password',
  database: 'awd_database',
};

// POST /users ユーザ新規登録
router.post('/', function (req, res, next) {
  let connection;
  mysql.createConnection(mysql_config).then((conn) => {
    connection = conn;
    return conn;
  }).then(() => {
    const sql = 'INSERT INTO users (barcode, name, machine_name) VALUES (?, ?, ?)';
    const data = [req.body.barcode, req.body.name, req.body.machine_name];
    return connection.query(sql, data);
  }).then((response) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const data = [response.insertId];
    return connection.query(sql, data);
  }).then((response) => {
    res.send(response[0]);
    return Promise.resolve();
  }).catch(error => {
    console.log(error);
  }).finally( () => {
    connection.end();
  })
});

// GET /users ユーザ一覧取得
router.get('/', function (req, res, next) {
  let connection;
  mysql.createConnection(mysql_config).then((conn) => {
    connection = conn;
    return conn;
  }).then(() => {
    const sql = 'SELECT * FROM users';
    return connection.query(sql);
  }).then((response) => {
    res.send(response);
    return Promise.resolve();
  }).catch(error => {
    console.log(error);
  }).finally( () => {
    connection.end();
  })
});

// GET /users/:id ユーザ情報取得
router.get('/:id', function (req, res, next) {
  let connection;
  mysql.createConnection(mysql_config).then((conn) => {
    connection = conn;
    return conn;
  }).then(() => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const data = [req.params.id];
    return connection.query(sql, data);
  }).then((response) => {
    res.send(response);
    return Promise.resolve();
  }).catch(error => {
    console.log(error);
  }).finally( () => {
    connection.end();
  })
});

// PUT /users/:id ユーザ情報更新
router.put('/:id', function (req, res, next) {
  let connection;
  mysql.createConnection(mysql_config).then((conn) => {
    connection = conn;
    return conn;
  }).then(() => {
    const sql = 'UPDATE users SET barcode=?, name=?, machine_name=? WHERE id=?';
    const data = [req.body.barcode, req.body.name, req.body.machine_name, req.params.id];
    return connection.query(sql, data);
  }).then((response) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const data = [req.params.id];
    return connection.query(sql, data);
  }).then((response) => {
    res.send(response[0]);
    return Promise.resolve();
  }).catch(error => {
    console.log(error);
  }).finally( () => {
    connection.end();
  })
});

module.exports = router;
