let format = require('../../utils/format')
const WebSocket = require('ws');
//创建容器
function createContainer(req, res) {
    let docker=req.docker;
    let containerInfo = req.body;
    try {
        const options = {
            Image: containerInfo.image,
            name: containerInfo.name,
            Env: containerInfo.env,
            HostConfig: {
                PortBindings: containerInfo.portBindings,
                RestartPolicy: containerInfo.restartPolicy,
                Binds: containerInfo.binds
            },
        }
        docker.createContainer(options, (err, container) => {
            let resp = {
                code: 0,
                data: "",
                message: "success",
            }
            if (err) {
                resp.code = 40001
                resp.message = err.json.message
                return res.json(resp)
            }
            container.start(function (err, data) {
                if (err) {
                    resp.code = 40001
                    resp.message = err.json.message
                }
                return res.json(resp)
            });
        });
    } catch (error) {
        let resp = {
            code: 40001,
            data: "",
            message: error
        }
        return res.json(resp)
    }


}
//获取容器详情
function detailContainer(req, res) {
    let docker=req.docker;
    let { containerId } = req.query
    if (!containerId) {
        let resp = {
            code: 40001,
            message: "缺少containerId参数",
        }
        return res.json(resp)
    }
    const container = docker.getContainer(containerId);
    container.inspect(function (err, data) {
        let resp = {
            code: 0,
            data: [],
            message: "success",
        }
        if (err) {
            let resp = {
                code: 40001,
                message: err.json.message,
            }
            return res.json(resp)
        }
        //获取映射的端口
        let exposed_ports = []
        for (const key in data.HostConfig.PortBindings) {
            let item = data.HostConfig.PortBindings[key][0]
            if (!item.HostIp) {
                item.HostIp = "0.0.0.0"
            }
            let ipAddrss = `${item.HostIp}:${item.HostPort}`
            exposed_ports.push({ key: key, value: ipAddrss })
        }
        // 环境变量
        let env = []
        for (const item of data.Config.Env) {
            env.push({ key: item.split("=")[0], value: item.split("=")[1] })
        }
        //获取挂载的目录
        let mounts = []
        for (const item of data.Mounts) {
            mounts.push({ key: item.Destination, value: item.Source })
        }
        //获取网络
        let networkConfig = []
        for (const key in data.NetworkSettings.Networks) {
            let res = data.NetworkSettings.Networks[key]
            let netlist = [`IPAddress:${res['IPAddress']}`, `Gateway:${res['Gateway']}`, `MacAddress:${res['MacAddress']}`]
            networkConfig.push({ key: key, value: netlist })
        }
        resp.data = {
            exposed_ports, env, mounts, networkConfig
        }
        return res.json(resp)
    });
}
//启动容器
async function startContainer(req, res) {
    let docker=req.docker;
    const { containers = [] } = req.body
    if (containers.length == 0) {
        let resp = {
            code: 40001,
            message: "缺少containers参数",
        }
        return res.json(resp)
    }
    let resp = {
        code: 200,
        data: [],
        message: "success",
    }
    for (const containerId of containers) {
        const container = docker.getContainer(containerId);
        let err = await start(container)
        if (err) {
            resp.data.push({ message: err.reason, containerId: containerId })
        }
    }
    return res.json(resp)
}
//停止容器
async function stopContainer(req, res) {
    let docker=req.docker;
    const { containers = [] } = req.body
    if (containers.length == 0) {
        let resp = {
            code: 40001,
            message: "缺少containers参数",
        }
        return res.json(resp)
    }
    let resp = {
        code: 200,
        data: [],
        message: "success",
    }
    for (const containerId of containers) {
        const container = docker.getContainer(containerId);
        let err = await stop(container)
        if (err) {
            resp.data.push({ message: err.reason, containerId: containerId })
        }
    }
    return res.json(resp)
}
//移除容器
async function removeContainer(req, res) {
    let docker=req.docker;
    const { containers = [] } = req.body
    if (containers.length == 0) {
        let resp = {
            code: 40001,
            message: "缺少containers参数",
        }
        return res.json(resp)
    }
    let resp = {
        code: 200,
        data: [],
        message: "success",
    }
    for (const containerId of containers) {
        const container = docker.getContainer(containerId);
        let err = await remove(container)
        if (err) {
            resp.data.push({ message: err.json.message, containerId: containerId })
        }
    }
    return res.json(resp)
}
//获取容器列表
function getContainerList(req, res) {
    let docker=req.docker;
    docker.listContainers({ all: true, size: true }, (err, containers) => {
        let resp = {
            code: 0,
            data: "",
            message: "success",
        }
        if (err) {
            resp = {
                code: 401,
                message: "docker已断开连接",
            }
            return res.json(resp)
        }
        let data = []
        for (const container of containers) {
            let ID = container.Id.slice(7, 19)
            let name = container.Names.join("|").replace(/\//g, '')
            let Image = container.Image
            let Command = container.Command
            let state = container.State
            let status = container.Status
            let size = format.formatBytes(container.SizeRootFs)
            let createTime = format.formatDate(container.Created * 1000)
            //端口拼接
            let port = ""
            for (const item of container.Ports) {
                if (item.PublicPort) {
                    port += `${item.IP}:${item.PrivatePort}->${item.PublicPort}/${item.Type},`
                }else{
                    port += `${item.PrivatePort}/${item.Type},`
                }
            }
            data.push({ ID, name, Image, Command, state, status, size, createTime, port })
        }
        resp.data = data
        return res.json(resp)
    });
}
//获取容器实时日志
function getContainerLogs(ws, req) {
    

    //获取name
    let url = req.url.split("?")[1];
    let params = new URLSearchParams(url)
    let name = params.get("name")
    let hostname = params.get("hostname")
    let docker=userList[hostname].docker;
    const container = docker.getContainer(name);
    container.logs({ follow: true, stdout: true, stderr: true }, function (err, stream) {
        if (err) {
            console.log(err.reason);
            ws.send(err.reason)
            ws.close()
            return
        }
        stream.on('data', function (chunk) {
            ws.send(chunk.toString());
        });
    });
    //退出
    ws.on('close', () => {
        console.log('close');
    });

}
//执行shell
function getContainerShell(ws, req) {
    //获取name
    let url = req.url.split("?")[1];
    let params = new URLSearchParams(url)
    let name = params.get("name")
    let user = params.get("user")
    let hostname = params.get("hostname")
    let docker=userList[hostname].docker;
    const container = docker.getContainer(name);
    let cmd = {
        'AttachStdout': true,
        'AttachStderr': true,
        'AttachStdin': true,
        'Tty': true,
        Cmd: ['/bin/bash'],
    };
    if (user) {
        cmd.User = user
    }
    container.exec(cmd, function (err, exec) {
        if (err) {
            console.log(err.reason);
            ws.send(err.reason)
            ws.close()
            return
        }
        let options = {
            'Tty': true,
            stream: true,
            stdin: true,
            stdout: true,
            stderr: true,
            // fix vim
            hijack: true,
        };

        exec.start(options, function (err, stream) {
            stream.on('data', function (chunk) {
                ws.send(chunk.toString('utf8'))
            });
            ws.on('message', function (data) {
                stream.write(data);
            });
        });
    });
    //退出
    ws.on('close', () => {
        console.log('close');
    });
}
//开启容器
async function start(container) {
    return new Promise((resolve, reject) => {
        container.start(function (err, data) {
            if (err) {
                resolve(err);
            }
            resolve(err)
        });
    });
}
//停止容器
async function stop(container) {
    return new Promise((resolve, reject) => {
        container.stop(function (err, data) {
            if (err) {
                resolve(err);
            }
            resolve(err)
        });
    });
}
//移除容器
async function remove(container) {
    return new Promise((resolve, reject) => {
        container.remove({ force: true }, function (err, data) {
            if (err) {
                resolve(err);
            }
            resolve(err)
        });
    });
}
module.exports = {
    getContainerList,
    detailContainer,
    createContainer,
    startContainer,
    stopContainer,
    removeContainer,
    getContainerLogs,
    getContainerShell

};