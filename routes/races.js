const express = require('express');
const mysql = require('promise-mysql');
const router = express.Router();

const mysqlConfig = {
  host: 'localhost',
  user: 'awd_user',
  password: 'awd_password',
  database: 'awd_database',
};

function deleteTimeStamp(json) {
  delete json.created;
  delete json.updated;
  return json;
}

// GET /races/:id レース情報取得
router.get('/:id', function (req, res, next) {
  let res_msg;
  let connection;
  mysql.createConnection(mysqlConfig).then((conn) => {
    connection = conn;
    return conn;
  }).then(() => {  // レース取得
    const sql = 'SELECT * FROM races WHERE id = ?';
    const data = [req.params.id];
    return connection.query(sql, data);
  }).then((response) => {  // レースユーザ取得
    res_msg = deleteTimeStamp(response[0]);
    res_msg.users = [];
    const sql = 'SELECT * FROM race_user WHERE race_id = ?';
    const data = [req.params.id];
    return connection.query(sql, data);
  }).then((response) => {  // ユーザ情報取得
    return Promise.all(response.map(async (item) => {
      let additional = {
        "user_id": item.user_id,
        "name": null,
        "machine_name": null,
        "lane_id": item.lane_id,
        "raptime": item.raptime,
      };
      const sql = 'SELECT * FROM users WHERE id = ?';
      const data = [item.user_id];
      await connection.query(sql, data).then((response) => {
        additional.name = response[0].name;
        additional.machine_name = response[0].machine_name;
      });
      return additional;
    }));
  }).then((add) => {
    res_msg.users = add;
    res.send(res_msg);
    return Promise.resolve();
  }).catch(error => {
    console.log(error);
  }).finally( () => {
    connection.end();
  })
});

module.exports = router;
