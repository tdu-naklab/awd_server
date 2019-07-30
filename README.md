# AWD System API Reference


## POST /users
### Description
ユーザ新規作成

### Parameters
|Name|Required|Description|Example|
|----|--------|-----------|-------|
|barcode|required|バーコード番号(整数8桁)|01234565|
|name|required|ユーザ名(<64文字)|"sample_name"|
|machine_name|optional|機体名(<64文字)|"sample_machine"|

### Example Request
```
$ curl http://localhost:3000/users \
-X POST \
"Content-Type: application/json" \
-d '{"barcode":"01234565", "name":"sample_name", "machine_name":"sample_machine"}'
```

### Example Response
```
{
    "id": 1,
    "barcode": "01234565",
    "name": "sample_name",
    "machine_name": "sample_machine",
    "created": "2019-07-30T13:31:11.000Z",
    "updated": "2019-07-30T13:31:11.000Z"
}
```


## GET /users
### Description
ユーザ一覧取得

### Parameters
None
### Example Request
```
GET http://localhost:3000/users
```
### Example Response
```
[
{
    "id": 1,
    "barcode": "01234565",
    "name": "sample_name",
    "machine_name": "sample_machine",
    "created": "2019-07-30T13:31:11.000Z",
    "updated": "2019-07-30T13:31:11.000Z"
},
{
    "id": 2,
    "barcode": "09876547",
    "name": "sample_name2",
    "machine_name": "sample_machine2",
    "created": "2019-07-30T13:35:45.000Z",
    "updated": "2019-07-30T13:35:45.000Z"
}
],
```


## GET /users/:id
### Description
ユーザ情報取得

### Parameters
|Name|Required|Description|Example|
|----|--------|-----------|-------|
|id|required|ユーザID|1|
### Example Request
```
GET http://localhost:3000/users/1
```

### Example Response
```
{
    "id": 1,
    "barcode": "01234565",
    "name": "sample_name",
    "machine_name": "sample_machine",
    "created": "2019-07-30T13:31:11.000Z",
    "updated": "2019-07-30T13:31:11.000Z"
}
```


## PUT /users/:id
### Description
ユーザ情報更新

### Parameters
|Name|Required|Description|Example|
|----|--------|-----------|-------|
|barcode|required|バーコード番号(整数8桁)|01234565|
|name|required|ユーザ名(<64文字)|"updated_name"|
|machine_name|optional|機体名(<64文字)|"updated_machine"|

### Example Request
```
$ curl http://localhost:3000/users/1 \
-X PUT \
"Content-Type: application/json" \
-d '{"barcode":"01234565", "name":"updated_name", "machine_name":"updated_machine"}'
```

### Example Response
```
{
    "id": 1,
    "barcode": "01234565",
    "name": "updated_name",
    "machine_name": "updated_machine",
    "created": "2019-07-30T13:49:32.000Z",
    "updated": "2019-07-30T13:54:43.000Z"
}
```


## DELETE /users/:id
### Description
ユーザ情報削除

### Parameters
|Name|Required|Description|Example|
|----|--------|-----------|-------|
|id|required|ユーザID|1|

### Example Request
```
DELETE http://localhost:3000/users/1
```

### Example Response
```
{
    "Result": {
        "message": "deleted"
    }
}
```
