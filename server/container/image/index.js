let format = require('../../utils/format')
//pull镜像
function pullImage(ws, req) {
    const { image,hostname } = req.query
    let docker=userList[hostname].docker
    if (!image) {
        ws.send("缺少image参数")
        ws.close()
        return
    }
    this.stream = ""
    docker.pull(image, (err, stream) => {
        let resp = {
            code: 0,
            data: "",
            message: "success",
        }
        if (err) {
            ws.send("pull出错")
            ws.close()

        }
        docker.modem.followProgress(stream, onFinished, onProgress);
        this.stream = stream
        function onFinished(err, output) {
            ws.send(JSON.stringify({
                id: "",
                status: "success",
                bar: ``,
                progress: ""
            }))
            ws.close()
        }
        function onProgress(event) {
            if (event.progressDetail && event.progressDetail.current && event.progressDetail.total) {
                const progress = event.progressDetail.current / event.progressDetail.total;
                const barLength = 20;
                const bar = new Array(Math.floor(progress * barLength)).fill('=').join('') +
                    new Array(barLength - Math.floor(progress * barLength)).fill('-').join('');
                console.log(`${event.status} ${event.id} [${bar}] ${(progress * 100).toFixed(2)}%`);
                ws.send(JSON.stringify({
                    id: event.id,
                    status: event.status,
                    bar: `[${bar}]`,
                    progress: (progress * 100).toFixed(2) + "%"
                }))
            } else {
                ws.send(JSON.stringify({
                    id: event.id,
                    status: event.status,
                    bar: ``,
                    progress: ""
                }))
            }
        }
    })
    ws.on('message', (msg) => {
        if (msg === 'close' && this.stream) {
            this.stream.destroy()
            ws.send("停止成功!!!")
        }
    });
}
//
//获取镜像列表
function getImageList(req, res) {
    let docker = req.docker;
    docker.listImages(async (err, images) => {
        let resp = {
            code: 0,
            data: [],
            message: "success",
        }
        if (err) {
            let resp = {
                code: 401,
                message: "docker已断开连接",
            }
            return res.json(resp)
        }
        let data = []
        for (const image of images) {
            for (const tag of image.RepoTags) {
                let info = await getImageInfo(tag, docker)
                let name = tag.split(":")[0]
                let version = tag.split(":")[1]
                let imageID = image.Id.slice(7, 19)
                let size = format.formatBytes(image.Size)
                let createTime = format.formatDate(info.Created)
                let fullName = tag
                let exposedPorts
                if (info.Config.ExposedPorts) {
                    exposedPorts = Object.keys(info.Config.ExposedPorts)
                }
                data.push({ name, version, imageID, size, createTime, fullName, exposedPorts })
            }
        }
        resp.data = data
        res.json(resp)
    });
}
//删除镜像
async function deleteImage(req, res) {
    let docker = req.docker;
    const { images = [] } = req.body
    if (images.length == 0) {
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
    for (const img of images) {
        let err = await removeImage(img,docker)
        if (err) {
            resp.data.push({ message: err.json.message, image: img })
        }
    }
    return res.json(resp)
}
//搜索镜像
function searchImage(req, res) {
    let docker = req.docker;
    const { image } = req.query
    docker.searchImages({ term: image }, (err, data) => {
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
        resp.data = data
        return res.json(resp)
    });
}
function getImageDetail(req, res) {
    let docker = req.docker;
    let { imageName } = req.query
    if (!imageName) {
        let resp = {
            code: 40001,
            message: "缺少imageName参数",
        }
        return res.json(resp)
    }
    docker.getImage(imageName).inspect(function (err, data) {
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
        let info = {
            id: data.Id,
            parent: data.Parent,
            comment: data.Comment,
            created: format.formatDate(data.Created),
            container: data.Container,
            image: data.Image,
            docker_version: data.DockerVersion,
            author: data.Author,
            architecture: data.Architecture,
            os: data.Os,
            size: format.formatBytes(data.Size),
            virtual_size: format.formatBytes(data.VirtualSize),
        }
        let container_config = {
            hostname: data.ContainerConfig.Hostname,
            user: data.ContainerConfig.User,
            domain: data.ContainerConfig.Domainname,
            Working_dir: data.ContainerConfig.WorkingDir,
            exposed_ports: Object.keys(data.ContainerConfig.ExposedPorts),
            env: data.ContainerConfig.Env,
            cmd: data.ContainerConfig.Cmd,
            volumes: Object.keys(data.ContainerConfig.Volumes),
        }
        let config = {
            hostname: data.Config.Hostname,
            user: data.Config.User,
            domain: data.Config.Domainname,
            Working_dir: data.Config.WorkingDir,
            exposed_ports: Object.keys(data.Config.ExposedPorts),
            env: data.Config.Env,
            cmd: data.Config.Cmd,
            volumes: Object.keys(data.Config.Volumes),
        }
        resp.data = {
            info, container_config, config
        }
        return res.json(resp)
    });
}
//移除镜像
async function removeImage(imageName, docker) {
    return new Promise((resolve, reject) => {
        docker.getImage(imageName).remove(function (err, data) {
            if (err) {
                resolve(err);
            }
            resolve(err)
        });
    });
}

//获取镜像详情
async function getImageInfo(imageName, docker) {
    return new Promise((resolve, reject) => {
        docker.getImage(imageName).inspect(function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {
    getImageList,
    pullImage,
    deleteImage,
    searchImage,
    getImageDetail
};