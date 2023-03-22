<template>
    <div class="container">
        <div class="header">
            <el-button icon="el-icon-plus" class="header-btn"
                @click="startContainerSumbmit(multipleSelection)">开启</el-button>
            <el-button icon="el-icon-search" class="header-btn"
                @click="stopContainerSumbmit(multipleSelection)">暂停</el-button>
            <el-button type="danger" icon="el-icon-delete" class="header-btn"
                @click="removeContainerSumbmit(multipleSelection)">删除</el-button>
        </div>
        <div class="content">
            <div class="table">
                <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%"
                    @selection-change="handleSelectionChange" v-loading="loading">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="ID" label="ID" align="center" />
                    <el-table-column prop="name" label="名称" align="center" />
                    <el-table-column prop="Image" label="镜像" align="center" />
                    <el-table-column prop="port" label="端口映射" align="center" />
                    <el-table-column prop="Command" label="命令执行" align="center" show-overflow-tooltip />
                    <el-table-column prop="status" label="状况" align="center" width="240" />
                    <el-table-column prop="state" label="运行情况" align="center">
                        <template slot-scope="scope">
                            <div class="tag" :style="StateOptions[scope.row.state].sty">
                                {{ StateOptions[scope.row.state].value }}
                            </div>

                        </template>
                    </el-table-column>
                    <el-table-column prop="size" label="镜像大小" align="center" />
                    <el-table-column prop="createTime" label="创建时间" align="center" width="180" show-overflow-tooltip />
                    <el-table-column label="实时日志" align="center" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" @click="openLogDialog(scope.row.name)">
                                查看日志
                            </el-button>

                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-video-play"
                                style="font-size: 25px;color:#67c23a ;margin-right: 10px;"
                                @click="startContainerSumbmit([scope.row.name])">
                            </el-button>
                            <el-button type="text" icon="el-icon-video-pause"
                                style="font-size: 25px;color:#e6a23c;margin-right: 10px;"
                                @click="stopContainerSumbmit([scope.row.name])">
                            </el-button>
                            <el-button type="text" icon="el-icon-error"
                                style="font-size: 25px;color: red;margin-right: 10px;"
                                @click="removeContainerSumbmit([scope.row.name])">
                            </el-button>
                            <el-dropdown trigger="click" style="cursor: pointer;">
                                <span class="el-dropdown-link">
                                    <i class="el-icon-more"
                                        style="font-size: 25px;color: #ced4da;transform: rotate(90deg);"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>
                                        <div @click="openDetailDialog(scope.row.name)">
                                            <el-button type="text" icon="el-icon-setting">
                                                查看配置
                                            </el-button>
                                        </div>

                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <div
                                            @click="shellDialog = true, currentshellName = scope.row.name, IsAdmin = false">
                                            <el-button type="text" icon="el-icon-s-platform">
                                                命令行
                                            </el-button>
                                        </div>

                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <div @click="shellDialog = true, currentshellName = scope.row.name, IsAdmin = true">
                                            <el-button type="text" icon="el-icon-s-custom">
                                                管理员运行
                                            </el-button>
                                        </div>

                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <!-- <el-button type="text" icon="el-icon-more"
                                style="font-size: 25px;color: #ced4da;transform: rotate(90deg);"
                                @click="removeContainerSumbmit([scope.row.name])">
                            </el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog title="容器日志" :visible.sync="logDialog" top="10px" width="80vw">
            <div style="height: 80vh; overflow: auto;" class="code">
                <pre> <code class="language-js line-numbers" v-if="logDialog">{{ currentLog.content }}</code></pre>
            </div>
        </el-dialog>
        <el-dialog title="容器配置" :visible.sync="DetailDialog" top="20px" width="1200px" style="height: 93vh;overflow: auto;">
            <INFO :name="currentDetailName" v-if="DetailDialog"></INFO>
        </el-dialog>
        <el-dialog title="shell" :visible.sync="shellDialog" top="20px" width="1200px" style="height: 93vh;overflow: auto;">
            <Shell :name="currentshellName" v-if="shellDialog" :IsAdmin="IsAdmin"></Shell>
        </el-dialog>
    </div>
</template>

<script>
import { GetList, StartContainer, StopContainer, RemoveContainer } from '@/api/container'
import INFO from './info.vue';
import Shell from './shell.vue';

export default {
    name: "container",
    components: {
        INFO,
        Shell
    },
    data() {
        return {
            tableData: [],
            loading: true,
            StateOptions: {
                "created": { value: "已创建", sty: "background-color: #ecf5ff;border-color: #d9ecff;color: #409eff;" },
                "running": { value: "运行中", sty: "background-color: #f0f9eb;border-color: #e1f3d8;color: #67c23a;" },
                "paused": { value: "已暂停", sty: "background-color: #f4f4f5;border-color: #e9e9eb;color: #909399;" },
                "restarting": { value: "重启中", sty: "background-color: #fdf6ec;border-color: #faecd8;color: #e6a23c;" },
                "removing": { value: "移除中", sty: "background-color: #fdf6ec;border-color: #faecd8;color: #e6a23c;" },
                "exited": { value: "已退出", sty: "background-color: #fef0f0;border-color: #fde2e2;color: #f56c6c;" },
                "dead": { value: "已停止", sty: "background-color: #fef0f0;border-color: #fde2e2;color: #f56c6c;" },
            },
            //删除
            multipleSelection: [],
            //实时日志相关信息
            LogList: [],
            logDialog: false,
            currentLog: {},
            /**
             * 容器详情相关信息
             */
            DetailDialog: false,
            currentDetailName: '',
            /**
            * 容器shell相关信息
            */
            shellDialog: false,
            currentshellName: '',
            IsAdmin: false
        }
    },
    mounted() {
        this.loadData()
        Prism.highlightAll()
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
        handleSelectionChange(images) {
            let multipleSelection = []
            for (const item of images) {
                multipleSelection.push(item.name)
            }
            this.multipleSelection = multipleSelection
        },
        //开启容器
        startContainerSumbmit(containers) {
            const h = this.$createElement;
            this.$msgbox({
                title: '消息',
                message: h('p', null, [
                    h('span', null, '此操作将启动 '),
                    h('span', { style: 'color: red' }, containers.join(",")),
                    h('span', null, '容器,是否继续?'),
                ]),
                showCancelButton: true,
                confirmButtonText: '启动',
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
                    StartContainer({ containers })
                        .then((res) => {
                            let errStr = ""
                            for (const item of res.data) {
                                errStr += `${item.containerId}发送错误,错误原因:${item.message}<br/>`
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
        //暂停容器
        stopContainerSumbmit(containers) {
            const h = this.$createElement;
            this.$msgbox({
                title: '消息',
                message: h('p', null, [
                    h('span', null, '此操作将暂停'),
                    h('span', { style: 'color: red' }, containers.join(",")),
                    h('span', null, '容器,是否继续?'),
                ]),
                showCancelButton: true,
                confirmButtonText: '暂停',
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
                    StopContainer({ containers })
                        .then((res) => {
                            let errStr = ""
                            for (const item of res.data) {
                                errStr += `${item.containerId}发送错误,错误原因:${item.message}<br/>`
                            }
                            if (errStr) {
                                this.$notify.error({
                                    title: '错误',
                                    dangerouslyUseHTMLString: true,
                                    message: errStr
                                });
                            } else {
                                this.$message.success('暂停容器成功')
                            }
                            this.loadData()
                        })
                        .finally(() => {
                            loading.close();
                        })
                })
        },
        //移除容器
        removeContainerSumbmit(containers) {
            const h = this.$createElement;
            this.$msgbox({
                title: '消息',
                message: h('p', null, [
                    h('span', null, '此操作将删除 '),
                    h('span', { style: 'color: red' }, containers.join(",")),
                    h('span', null, '容器,是否继续?'),
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
                    RemoveContainer({ containers })
                        .then((res) => {
                            let errStr = ""
                            for (const item of res.data) {
                                errStr += `${item.containerId}发送错误,错误原因:${item.message}<br/>`
                            }
                            if (errStr) {
                                this.$notify.error({
                                    title: '错误',
                                    dangerouslyUseHTMLString: true,
                                    message: errStr
                                });
                            } else {
                                this.$message.success('删除容器成功')
                            }
                            this.loadData()
                        })
                        .finally(() => {

                            loading.close();
                        })
                })

        },
        /**
         * 日志相关信息
         */
        //打开日志弹窗
        openLogDialog(name) {

            if (!this.LogList[name]) {
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
                let logWs = new WebSocket("ws://" + prefix + process.env.VUE_APP_BASE_WS_API + "container/logs?name=" + name + "&hostname=" + this.$store.getters.hostname)
                logWs.onopen = () => {
                    this.LogList[name] = {
                        LogWebsocket: logWs,
                        content: "",
                        name: name
                    }
                    this.currentLog = this.LogList[name]
                    this.logDialog = true

                    loading.close()
                };
                logWs.onmessage = (message) => {
                    let content = message.data
                    let item = this.LogList[name]
                    item.content += content
                    this.$set(this.LogList, name, item);
                    if (this.currentLog.name == item.name) {
                        this.$set(this.currentLog, "content", item.content)
                        setTimeout(() => {
                            Prism.highlightAll()
                        }, 50)
                    }
                }
            } else {
                this.currentLog = this.LogList[name]
                this.logDialog = true
            }
        },
        /**
         * 打开配置详情
         */
        openDetailDialog(name) {
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

.tag {
    display: inline-block;
    height: 32px;
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: nowrap;
}
</style>