var express = require('express');
const router = express.Router();
const image = require("../../container/image/index")
const jwt = require('jsonwebtoken');
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
    router.get('/list', verifyHostname, image.getImageList)
    router.get('/detail', verifyHostname, image.getImageDetail)
    router.ws('/pull', image.pullImage)
    router.post('/delete', verifyHostname, image.deleteImage)
    router.get('/search', verifyHostname, image.searchImage)

    return router
}