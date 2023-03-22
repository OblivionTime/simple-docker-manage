<template>
    <div class="container">
        <div class="header">
            <el-button icon="el-icon-plus" class="header-btn" @click="pullDialog = true, imageName = ''">拉取</el-button>
            <el-button icon="el-icon-search" class="header-btn" @click="searchDialog = true, searchName = ''">搜索</el-button>
            <el-button type="danger" icon="el-icon-delete" class="header-btn"
                @click="removeImage(multipleSelection)">删除</el-button>
        </div>
        <div class="content">
            <div class="table">
                <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%"
                    @selection-change="handleSelectionChange" v-loading="loading">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="name" label="名称" align="center">
                    </el-table-column>
                    <el-table-column prop="version" label="版本" align="center" />
                    <el-table-column prop="imageID" label="镜像ID" align="center" />
                    <el-table-column prop="size" label="镜像大小" align="center" />
                    <el-table-column prop="createTime" label="创建时间" align="center" />
                    <el-table-column fixed="right" label="镜像详情" align="center" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" @click="showDetailDialog(scope.row.fullName)">
                                查看
                            </el-button>

                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" align="center" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" @click="showCreateDialog(scope.row.fullName, scope.row.exposedPorts)">
                                新建容器
                            </el-button>
                            <el-button type="text" @click="removeImage([scope.row.fullName])" style="color: red;">
                                移除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>


        </div>
        <el-dialog title="创建容器" :visible.sync="createDialog" top="20px" width="680px" :close-on-click-modal="false">
            <div style="width: 650px;max-height: 600px;overflow: auto;">
                <div style="display: flex;padding-bottom: 20px;">
                    <img src="../../assets/images/container.png" alt="" srcset="" width="50" height="50">
                    <div style="margin-left: 15px;padding-top: 10px;">
                        <span style="font-size: 18px;font-weight: bold;">创建一个新容器</span>
                        <div style="color: rgba(0,0,0,0.6);margin-top: 10px;">{{ formData.image }}</div>
                    </div>
                </div>
                <hr>

                <div class="dialog-item" style="width: 540px">
                    <h3>容器名</h3>
                    <el-input v-model="formData.name" placeholder="请输入容器名"></el-input>
                </div>

                <div class="dialog-item" style="width: 80%;" v-if="formData.portBindings.length != 0">
                    <h3>端口</h3>
                    <div style="display: flex; align-items: center;margin: 10px 0;"
                        v-for="(_, index) in formData.portBindings" :key="index">
                        <el-input v-model="formData.portBindings[index].value" placeholder="暴露端口"
                            style="margin-right: 20px;width: 260px;"></el-input>
                        <div style="font-size: 18px;">
                            {{ formData.portBindings[index].key }}
                        </div>
                    </div>
                </div>
                <div class="dialog-item" style="width: 80%;">
                    <h3>目录映射</h3>
                    <div style="display: flex; align-items: center;margin: 10px 0;width:620px"
                        v-for="(_, index) in formData.binds" :key="index">
                        <div style="margin-right: 20px;width: 260px;">
                            <el-input v-model="formData.binds[index].value" placeholder="主机目录"
                                style="width: 100%;"></el-input>
                        </div>
                        <div style="margin-right: 20px;width: 260px;">
                            <el-input v-model="formData.binds[index].key" placeholder="容器目录"
                                style="width: 100%;"></el-input>
                        </div>
                        <el-button type="text" icon="el-icon-plus" circle style="font-size: 27px;color: rgba(0,0,0,0.8);"
                            @click="formData.binds.push({ label: '', value: '' })"></el-button>
                    </div>
                </div>
                <div class="dialog-item" style="width: 80%;">
                    <h3>环境变量</h3>
                    <div style="display: flex; align-items: center;margin: 10px 0;width:620px"
                        v-for="(_, index) in formData.env" :key="index">
                        <div style="margin-right: 20px;width: 260px;">
                            <el-input v-model="formData.env[index].key" placeholder="环境名称" style="width: 100%;"></el-input>
                        </div>
                        <div style="margin-right: 20px;width: 260px;">
                            <el-input v-model="formData.env[index].value" placeholder="值" style="width: 100%;"></el-input>
                        </div>
                        <el-button type="text" icon="el-icon-plus" circle style="font-size: 27px;color: rgba(0,0,0,0.8);"
                            @click="formData.env.push({ label: '', value: '' })"></el-button>
                    </div>
                </div>
                <div class="dialog-item" style="width: 80%;">
                    <h3>重启策略</h3>
                    <div style="display: flex; align-items: center;margin: 10px 0;width:620px">
                        <div style="margin-right: 20px;width: 260px;">
                            <p>重启策略</p>
                            <el-select v-model="formData.restartPolicy.Name" placeholder="请选择重启策略" style="width: 100%;">
                                <el-option label="容器退出时总是重启" value="always" />
                                <el-option label="容器以非零状态退出时重启" value="on-failure" />
                                <el-option label="除非显式停止，否则容器总是重启" value="unless-stopped" />
                                <el-option label="不重启容器" value="no" />
                            </el-select>

                        </div>
                        <div style="margin-right: 20px;width: 260px;" v-if="formData.restartPolicy.Name == 'on-failure'">
                            <p>最大尝试次数</p>
                            <el-input v-model="formData.restartPolicy.MaximumRetryCount" placeholder="最大尝试次数"
                                style="width: 100%;"></el-input>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createDialog = false">取 消</el-button>
                <el-button type="primary" @click="createContainerSumbit">创 建</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新建镜像" :visible.sync="pullDialog" width="800px" top="5%" style="height: 80vh;overflow: auto;">
            <el-input v-model="imageName" autocomplete="off" @keydown.enter.native="pullImage"> <el-button slot="append"
                    icon="el-icon-plus" style="background-color: #409eff;color: white;border-radius: 0;"
                    @click="pullImage">新建</el-button></el-input>
            <div style="margin-top: 20px;">
                <el-collapse v-if="createProgressList.length != 0">
                    <el-collapse-item v-for="(item, index) in createProgressList" :key="index">
                        <template slot="title">
                            <div style="display: flex;justify-content: space-between;align-items: center;width: 100%;">
                                <div>
                                    {{ item.title }} <span
                                        :style="item.status == 1 ? 'color: #099268;' : item.status == 2 ? 'color: red;' : ''"
                                        class="pull-desc">(
                                        {{
                                            item.statusDesc
                                        }})</span>
                                </div>
                                <el-button type="text" style="margin-right: 20px;color: red;" @click="stopPull(index)"
                                    v-if="item.status == 0">停止</el-button>
                            </div>
                        </template>
                        <div v-for="item of item.content" :key="item">
                            {{ item }}
                        </div>
                    </el-collapse-item>

                </el-collapse>
            </div>


        </el-dialog>
        <el-dialog title="搜索镜像" :visible.sync="searchDialog" width="900px">
            <el-input v-model="searchName" autocomplete="off" @keydown.enter.native="loadSearchData"> <el-button
                    slot="append" icon="el-icon-search" style="background-color: #409eff;color: white;border-radius: 0;"
                    @click="loadSearchData">搜索</el-button></el-input>
            <div style="margin-top: 20px;">
                <el-table :data="searchData.slice((searchPage - 1) * 10, searchPage * 10)" height="560px" stripe
                    style="width: 100%;">
                    <el-table-column prop="name" label="名称" align="center" width="120px" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="star_count" label="获赞数" align="center" width="120px" />
                    <el-table-column prop="description" label="描述" align="center" show-overflow-tooltip />
                    <el-table-column prop="size" label="类型" align="center" width="150px">
                        <template slot-scope="scope">
                            <div class="official-mirror" v-if="scope.row.is_official">
                                官方镜像
                            </div>
                            <div class="unofficial-mirror" v-else>
                                非官方镜像
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination background align="center" layout="total, prev, pager, next, jumper"
                    :current-page="searchPage" :total="searchTotal" @current-change="handleSearchChange"
                    style="margin-top: 20px" />
            </div>
        </el-dialog>
        <el-dialog title="镜像详情" :visible.sync="DetailDialog" top="20px" width="1200px" style="height: 93vh;overflow: auto;">
            <INFO :name="currentDetailName" v-if="DetailDialog"></INFO>
        </el-dialog>
    </div>
</template>

<script>
import { GetList, SearchList, RemoveMirror, CreateContainer } from '@/api/mirror'
import INFO from './info.vue';
export default {
    name: "container",
    components: {
        INFO
    },
    data() {
        return {
            tableData: [],
            loading: true,
            //容器相关参数
            createDialog: false,
            formData: {
                "image": "mysql:5.6",
                "name": "mysql2",
                "env": [
                    {
                        key: "MYSQL_ROOT_PASSWORD",
                        value: "123456",
                    }
                ],
                "portBindings": [{ key: "3306/tcp", value: "3308" }],
                "binds": [{ key: "D:/test/mysql", value: "/tmp/mysql" }],
                "restartPolicy": {
                    "Name": "always",
                    "MaximumRetryCount": ""
                }
            },
            //拉取镜像相关参数
            pullDialog: false,
            createProgressList: [],
            imageName: "",
            //搜索镜像相关参数
            searchDialog: false,
            searchName: "",
            searchData: [],
            searchPage: 1,
            searchTotal: 0,
            //删除
            multipleSelection: [],
            //详情相关参数
            DetailDialog: false,
            currentDetailName: ""

        }
    },
    mounted() {
        this.loadData()
    },
    methods: {
        loadData() {
            this.loading = true
            GetList({ page: 1 })
                .then((res) => {
                    let tableData = []
                    if (res.code === 0) {
                        tableData = res.data
                    }
                    this.tableData = tableData
                })
                .finally(() => {
                    this.loading = false;
                })
        },
        /**
         * 创建容器
         */
        //数据处理
        handlerData() {

            let formData = {
                image: this.formData.image,
                name: this.formData.name,
                env: [],
                portBindings: {},
                binds: [],
                restartPolicy: this.formData.restartPolicy
            };
            if (formData.restartPolicy.Name != 'on-failure') {
                delete formData.restartPolicy.MaximumRetryCount
            } else {
                formData.restartPolicy.MaximumRetryCount = parseInt(this.formData.restartPolicy.MaximumRetryCount)
            }
            for (const item of this.formData.env) {
                if (!item.key) {
                    continue
                }
                if (!item.value) {
                    return this.$message.warning("请填写完整信息!!!!")
                }
                formData.env.push(item.key + "=" + item.value)
            }
            for (const item of this.formData.portBindings) {
                if (item.value) {
                    formData.portBindings[item.key] = [{ "HostPort": item.value }]
                }
            }
            for (const item of this.formData.binds) {
                if (!(item.key && item.value)) {
                    continue
                } else if (!item.key || !item.value) {
                    return this.$message.warning("请填写完整信息!!!!")
                }
                formData.binds.push(item.key + ":" + item.value)
            }

            return formData
        },
        createContainerSumbit() {
            if (!this.formData.name) {
                return this.$message.warning("请填写容器名称!!!!")
            }
            let formData = this.handlerData();
            const loading = this.$loading({
                lock: true,
                text: 'Loading.....',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            CreateContainer(formData)
                .then(res => {
                    if (res.code === 0) {
                        this.$message.success("创建成功")
                        this.createDialog = false
                    } else {
                        this.$message.error(res.message)
                    }
                })
                .finally(() => {
                    loading.close();
                })

        },
        //打开容器弹窗
        showCreateDialog(fullName, exposedPorts) {
            this.createDialog = true

            this.formData = {
                "image": fullName,
                "name": "",
                "env": [
                    {
                        key: "",
                        value: "",
                    }
                ],
                "portBindings": [],
                "binds": [{ key: "", value: "" }],
                "restartPolicy": {
                    "Name": "always",
                    "MaximumRetryCount": ""
                }
            }
            if (exposedPorts) {
                for (const port of exposedPorts) {
                    this.formData.portBindings.push({ key: port, value: "" })
                }
            }

        },
        /**
         * 拉取镜像
         */
        pullImage() {
            if (!this.imageName) {
                return this.$message.error("请输入镜像名称")
            }
            const loading = this.$loading({
                lock: true,
                text: 'Loading.....',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let prefix = ""
            if (process.env.NODE_ENV != 'development') {
                prefix = window.location.host
            }
            let imageWs = new WebSocket("ws://" + prefix + process.env.VUE_APP_BASE_WS_API + "image/pull?image=" + this.imageName + "&hostname=" + this.$store.getters.hostname)
            let index = this.createProgressList.length
            imageWs.onopen = () => {
                this.createProgressList.push({
                    pullWebsocket: imageWs,
                    title: this.imageName,
                    status: 0,
                    statusDesc: "正在拉取....",
                    content: {}
                })
                this.imageName = ""
                loading.close()
            };
            imageWs.onmessage = (message) => {
                let item = this.createProgressList[index]
                let content = JSON.parse(message.data)
                if (content.status == 'success') {
                    item.status = 1
                    item.pullWebsocket = null
                    item.statusDesc = "拉取成功"
                    item.content[item.title] = `${content.id} ${content.status} ${content.bar} ${content.progress}`
                    this.loadData()
                } else {
                    if (content.id) {
                        item.content[content.id] = `${content.id} ${content.status} ${content.bar} ${content.progress}`
                    }
                }
                this.$set(this.createProgressList, index, item);
            }
        },
        stopPull(index) {
            this.createProgressList[index].pullWebsocket.send("close")
            this.createProgressList[index].status = 2
            this.createProgressList[index].pullWebsocket = null
            this.createProgressList[index].statusDesc = "拉取停止"
            this.$set(this.createProgressList, index, this.createProgressList[index]);
        },
        //搜索相关
        handleSearchChange(page) {
            this.searchPage = page
        },
        loadSearchData() {
            if (!this.searchName) {
                return this.$message.error("请输入镜像名称")
            }
            const loading = this.$loading({
                lock: true,
                text: 'Loading.....',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            SearchList({ image: this.searchName })
                .then((res) => {
                    let searchData = []
                    if (res.code === 0) {
                        searchData = res.data
                    }
                    this.searchData = searchData
                    this.searchTotal = searchData.length
                    this.searchPage = 1
                })
                .finally(() => {
                    loading.close()
                })
        },
        //移除相关
        handleSelectionChange(images) {
            let multipleSelection = []
            for (const item of images) {
                multipleSelection.push(item.fullName)
            }
            this.multipleSelection = multipleSelection
        },
        //移除镜像
        removeImage(images) {
            const h = this.$createElement;
            this.$msgbox({
                title: '消息',
                message: h('p', null, [
                    h('span', null, '此操作将删除 '),
                    h('span', { style: 'color: red' }, images.join(",")),
                    h('span', null, '镜像,是否继续?'),
                ]),
                showCancelButton: true,
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading.....',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    RemoveMirror({ images })
                        .then((res) => {
                            let errStr = ""
                            for (const item of res.data) {
                                errStr += `${item.image}发送错误,错误原因:${item.message}<br/>`
                            }
                            if (errStr) {
                                this.$notify.error({
                                    title: '错误',
                                    dangerouslyUseHTMLString: true,
                                    message: errStr
                                });
                            } else {
                                this.$message.success('启动容器成功')
                            }
                            this.loadData()
                        })
                        .finally(() => {
                            loading.close();
                        })

                })

        },
        /**
         * 镜像详情
         */
        showDetailDialog(name) {
            this.currentDetailName = name
            this.DetailDialog = true
        }
    },

}
</script>

<style lang="scss" scoped>
.container {
    width: 95%;
    margin: 0 auto;
}

.header {
    width: 100%;
    margin-top: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    text-align: right;
    border-bottom: 1px solid #ccc;

    .header-btn {
        width: 120px;
        height: 40px;
    }
}

.content {
    margin-top: 20px;
    width: 100%;

}

::v-deep .el-table th,
.el-table tr {
    background-color: #fafafa;
    color: black;
}

.pull-desc {
    margin-left: 10px;
}

.official-mirror {
    // background-color: #51cf66;
    border: 1px solid #51cf66;
    background: #c3fae8;
    color: #51cf66;
    width: 120px;
}

.unofficial-mirror {
    // background-color: #51cf66;
    border: 1px solid #adb5bd;
    background: #f1f3f5;
    color: #adb5bd;
    width: 120px;
}

.dialog-item {
    margin: 20px 0;
}
</style>