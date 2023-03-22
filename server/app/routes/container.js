var express = require('express');
//设置路由
const router = express.Router();
const container = require("../../container/container/index")
// 中间件
function verifyHostname(req, res, next) {
    const hostname = req.headers['hostname'];
    if (!hostname) {
        return res.json({
            code: 401,
            data: "",
            message: "hostname is required",
        });
    }
    if (userList[hostname] && userList[hostname].docker) {
        req.docker=userList[hostname].docker
        next();
    } else {
        return res.json({
            code: 401,
            data: "",
            message: hostname + "未创建或未初始化!!!!",
        });
    }
}
module.exports = function () {
    router.get('/list', verifyHostname, container.getContainerList)
    router.get('/detail', verifyHostname, container.detailContainer)
    router.post('/create', verifyHostname, container.createContainer)
    router.post('/start', verifyHostname, container.startContainer)
    router.post('/stop', verifyHostname, container.stopContainer)
    router.post('/remove', verifyHostname, container.removeContainer)
    router.ws('/logs', container.getContainerLogs)
    router.ws('/shell', container.getContainerShell)
    return router
}