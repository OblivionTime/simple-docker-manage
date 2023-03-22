var express = require('express');
const router = express.Router();
const image = require("../../container/index/index")
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
        req.docker = userList[hostname].docker
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
    router.get('/info', verifyHostname, image.getDockerInfo)
    router.get('/list', image.getUserList)
    router.post('/create', image.addUser)
    router.post('/update', image.updateUser)
    router.post('/del', image.delUser)
    router.post('/auth', image.Auth)

    return router
}