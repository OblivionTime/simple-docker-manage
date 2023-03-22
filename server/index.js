var app = require('./app/app');
let displayRoutes = require('express-routemap');
let userList = {
    "127.0.0.1": { host: "127.0.0.1", port: 2375, docker: "" }
}
global.userList = userList
//启动服务
app.listen("7888", "0.0.0.0", function () {
    displayRoutes(app);
    console.log(`http running at http://127.0.0.1:7888`);
});