<template>
    <div class="container">
        <div class="content">
            <h1>容器列表</h1>
            <el-button type="primary" style="margin: 20px 0;" @click="openCreateDialog">添加容器</el-button>
            <el-table :data="tableData" border style="width: 100%;">
                <el-table-column prop="host" label="Host" align="center">
                </el-table-column>
                <el-table-column prop="port" label="端口" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit-outline" style="font-size: 20px;"
                            @click="openUpdateDialog(scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-delete-solid" style="font-size: 20px;color: red;"
                            @click="DeleteContainer(scope.row.host)"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="进入容器" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" 
                            @click="openContainer(scope.row)">进入容器</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="title" :visible.sync="showDialog" width="750px" height="60%" center top="20px">
            <el-form :model="formData" label-position="left" style="padding: 20px 10px" ref="ruleForm">
                <el-form-item label="主机号:" label-width="140px" style="font-size: 18px" prop="host" :rules="[
                    {
                        required: true,
                        message: '主机号不能为空',
                        trigger: 'blur',
                    },
                ]">
                    <el-input v-model="formData.host" auto-complete="off" style="width: 400px" placeholder="请输入主机号"
                        :disabled="title == '编辑容器'" />
                </el-form-item>
                <el-form-item label="端口:" label-width="140px" style="font-size: 18px" prop="port" :rules="[
                    {
                        required: true,
                        message: '端口不能为空',
                        trigger: 'blur',
                    },
                ]">
                    <el-input v-model="formData.port" auto-complete="off" style="width: 400px" placeholder="请输入端口"
                        oninput="value=value.replace(/^\.+|[^\d]/g,'')" />
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click.native="showDialog = false" style="width: 140px">取消</el-button>
                <el-button type="primary" style="width: 140px" @click="submitForm">{{
                    title
                }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { UserLogin, getUserList, AddUser, UpdateUser, DelUser } from '@/api/auth';
export default {
    data() {
        return {
            tableData: [],
            showDialog: false,
            title: "添加容器",
            formData: {
                host: "",
                port: 2375
            }
        };
    },
    created() {
        this.loadData()
    },
    methods: {
        loadData() {
            getUserList()
                .then((res) => {
                    this.tableData = res.data
                })
        },
        openCreateDialog() {
            this.title = "添加容器"
            this.showDialog = true
            this.formData = {
                host: "",
                port: 2375
            }
        },
        openUpdateDialog(row) {
            this.title = "编辑容器"
            this.showDialog = true
            this.formData = JSON.parse(JSON.stringify(row))
        },
        openContainer(row) {
            let formData = { host: row.host, port: row.port }
            const loading = this.$loading({
                lock: true,
                text: '尝试连接中....',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            UserLogin(formData)
                .then((res) => {
                    if (res.code == 0) {
                        let routeUrl = this.$router.resolve({
                            path: '/home/index',
                            query: {
                                hostname: row.host
                            }
                        })
                        window.open(routeUrl.href, '_blank')
                    } else {
                        this.$message.error("连接失败");
                    }
                })
                .finally(() => {
                    loading.close()
                });
        },
        submitForm() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    if (this.title == "编辑容器") {
                        //编辑
                        UpdateUser(this.formData).then((res) => {
                            if (res.code == 0) {
                                this.$message.success("修改成功!!!");
                                this.loadData();
                                this.showDialog = false;
                            } else {
                                this.$message.error(res.message);
                            }
                        });
                    } else {
                        AddUser(this.formData).then((res) => {
                            if (res.code == 0) {
                                this.$message.success("创建成功!!!");
                                this.loadData();
                                this.showDialog = false;
                            } else {
                                this.$message.error(res.message);
                            }
                        });
                    }
                } else {
                    this.$message.warning("某些参数不能为空");
                    return false;
                }
            });
        },
        DeleteContainer(host) {
            this.$confirm("此操作将删除当前容器, 是否继续?", "提示", {
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                DelUser({ host: host }).then((result) => {
                    if (result.code == 0) {
                        this.$message.success("删除成功");
                        this.loadData();
                    } else {
                        this.$message.error(result.message);
                    }
                });
            });
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .content {
        width: 60vw;
        height: 85vh;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
        padding: 20px;
        overflow: auto;
    }
}
</style>