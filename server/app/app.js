/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-19 11:46:56
 * @LastEditors: solid
 * @LastEditTime: 2022-11-01 15:47:52
 */
/**
 * 服务器
 */
var express = require('express');
var expressWs = require('express-ws');
const jwt = require('jsonwebtoken');
var app = express();
expressWs(app)

/**
 * 解决跨域
 */
// app.all("*", function );
app.use(express.static('ui'));
app.get('/', function (req, res) {
    console.log("xxxx");
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
})
const cors = (req, res, next) => {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", true);
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8")
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else
        next();
}
const bodyParser = require("body-parser");
app.use(bodyParser.json()); //parse application/json

let imageRouter = require('./routes/image')();
let containerRouter = require('./routes/container')();
let indexRouter = require('./routes/index')();

app.use('/api/docker/v1/image', cors, imageRouter);
app.use('/api/docker/v1/container', cors, containerRouter);
app.use('/api/docker/v1/auth', cors, indexRouter);

module.exports = app