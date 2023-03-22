let format = require('../../utils/format')
const Docker = require('dockerode');


async function getDockerInfo(req, res) {
    let docker = req.docker
    let resp = {
        code: 0,
        data: [],
        message: "success",
    }
    var info = await getInfo(docker)
    let data = {
        containers: info.Containers,
        containers_running: info.ContainersRunning,
        containers_paused: info.ContainersPaused,
        containers_stopped: info.ContainersStopped,
        images: info.Images,
        detail: {
            ID: info.ID,
            name: info.Name,
            version: info.ServerVersion,

            memory_limit: info.MemoryLimit ? '启用' : '关闭',
            swap_limit: info.SwapLimit ? '启用' : '关闭',
            kernel_memory: info.KernelMemory ? '启用' : '关闭',

            CPU: info.CPUSet ? '启用' : '关闭',
            pids_limit: info.PidsLimit ? '启用' : '关闭',
            debug: info.Debug ? '启用' : '关闭',

            system: info.OperatingSystem,
            os: info.OSType + " " + info.OSVersion,
            kernel_version: info.KernelVersion,

            architecture: info.Architecture,
            docker_root_dir: info.DockerRootDir,
            driver: info.Driver,

            NCPU: info.NCPU,
            mem_total: format.formatBytes(info.MemTotal),
            system_time: format.formatDate(info.SystemTime),

            HttpProxy: info.HttpProxy,
            HttpsProxy: info.HttpsProxy,
            NGoroutines: info.NGoroutines,
        }

    }
    resp.data = data
    res.json(resp)
}

//获取镜像详情
function getInfo(docker) {
    return new Promise((resolve, reject) => {
        docker.info((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}
//获取用户列表
function getUserList(req, res) {
    let resp = {
        code: 0,
        data: "",
        message: "success",
    }
    let users = []
    for (const key in userList) {
        let user = userList[key]
        users.push({ host: user.host, port: user.port })
    }
    resp.data = users
    res.json(resp)
}
//添加用户
function addUser(req, res) {
    const { host, port } = req.body
    let resp = {
        code: 0,
        data: "",
        message: "success",
    }
    if (!(host && port)) {
        resp.code = 40001
        resp.message = "请填完整信息!!!"
        return res.json(resp)
    }
    if (userList[host]) {
        resp.code = 40001
        resp.message = host + "已存在!!!"
        return res.json(resp)
    }
    userList[host] = { host: host, port: port, docker: "" }
    return res.json(resp)
}
//修改用户
function updateUser(req, res) {
    const { host, port } = req.body
    let resp = {
        code: 0,
        data: "",
        message: "success",
    }
    if (!(host && port)) {
        resp.code = 40001
        resp.message = "请填完整信息!!!"
        return res.json(resp)
    }
    if (!userList[host]) {
        resp.code = 40001
        resp.message = host + "不存在!!!"
        return res.json(resp)
    }
    userList[host] = { host: host, port: port, docker: "" }
    return res.json(resp)
}
//删除用户
function delUser(req, res) {
    const { host } = req.body
    let resp = {
        code: 0,
        data: "",
        message: "success",
    }
    delete userList[host]
    return res.json(resp)
}
function Auth(req, res) {
    let { host = "localhost", port = 2375 } = req.body;

    let docker
    if (host == "localhost" || host == "127.0.0.1") {
        docker = new Docker();
    } else {
        docker = new Docker({
            host: host,
            port: port // Docker API 端口
        });
    }
    docker.ping((err, data) => {
        let resp = {
            code: 0,
            data: "",
            message: "success",
        }
        if (err) {
            resp.code = 40001
            resp.message = err
            return res.json(resp)
        }
        if (userList[host]) {
            userList[host].docker = docker
        } else {
            userList[host] = { host: host, port: port, docker: docker }
        }
        res.json(resp)
    });
}

module.exports = {
    getDockerInfo,
    Auth,
    getUserList,
    updateUser,
    addUser,
    delUser
};