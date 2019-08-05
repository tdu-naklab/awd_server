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

router.get('/ranking', async (req, res, next) => {
  const connection = await mysql.createConnection(mysqlConfig);
  try {
    const sql = `
    select
      race_user.id,
      race_user.lane,
      race_user.user_id,
      race_user.race_id,
      race_user.raptime,
      users.name,
      users.machine_name,
      users.barcode
    from race_user
    left join users on race_user.user_id = users.id
    order by raptime is null ASC
    limit 9`;
  const response = await connection.query(sql);
  res.json(response);
  } catch (e) {
    console.error(e);
  } finally {
    connection.end();
  }
})

// POST /races レース新規作成
router.post('/', function (req, res, next) {
  let connection;
  let players_id = [];
  let race_id;
  mysql.createConnection(mysqlConfig).then((conn) => {
    connection = conn;
    return conn;
  }).then(() => {  // ユーザのIDを取得
    return Promise.all(req.body.players.map(async (barcode) => {  // 1人ずつ
      const sql = 'SELECT * FROM users WHERE barcode = ?';
      const data = [barcode];
      await connection.query(sql, data).then((response) => {
        players_id.push(response[0].id);
      });
      return Promise.resolve();
    }));
  }).then(() => {  // レーステーブル作成
    const sql = 'INSERT INTO races (course) VALUES (?)';
    const data = [req.body.course];
    return connection.query(sql, data);
  }).then((response) => {  // レースユーザテーブル作成
    race_id = response.insertId;
    return Promise.all(players_id.map(async (id, index) => {  // 1人ずつ
      const sql = 'INSERT INTO race_user (race_id, user_id, lane) VALUES (?, ?, ?)';
      const data = [response.insertId, id, index+1];
      await connection.query(sql, data)
    }));
  }).then(() => {
    res.send(race_id.toString());
    return Promise.resolve();
  }).catch(error => {
    console.log(error);
  }).finally( () => {
    connection.end();
  })
});

// GET /races レース一覧取得
router.get('/', function (req, res, next) {
  let connection;
  mysql.createConnection(mysqlConfig).then((conn) => {
    connection = conn;
    return conn;
  }).then(() => {
    const sql = 'SELECT * FROM races';
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
        "id": item.user_id,
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
