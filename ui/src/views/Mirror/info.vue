<template>
    <div>
        <el-descriptions class="margin-top" title="基本信息" :column="3" border>
            <el-descriptions-item v-for="(key, index) in descriptionsItems" :key="key">
                <template slot="label">
                    {{ descriptionsItemsCH[index] }}
                </template>
                {{ Detail[descriptionsItems[index]] }}
            </el-descriptions-item>


        </el-descriptions>
        <div style="margin-top: 20px;">
            <el-descriptions class="margin-top" title="容器配置" :column="2" border>
                <el-descriptions-item>
                    <template slot="label">
                        主机
                    </template>
                    {{ ContainerConfig.hostname }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        用户
                    </template>
                    {{ ContainerConfig.user }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        域
                    </template>
                    {{ ContainerConfig.domain }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        工作目录
                    </template>
                    {{ ContainerConfig.Working_dir }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        暴露端口
                    </template>
                    <div v-for="tag in ContainerConfig.exposed_ports">
                        <el-tag>{{ tag }}</el-tag>
                    </div>

                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        环境变量
                    </template>
                    <div v-for="tag in ContainerConfig.env">
                        <el-tag>{{ tag }}</el-tag>
                    </div>

                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        命令行
                    </template>
                    <div v-for="tag in ContainerConfig.cmd">
                        <el-tag>{{ tag }}</el-tag>
                    </div>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        可映射目录
                    </template>
                    <div v-for="tag in ContainerConfig.volumes">
                        <el-tag>{{ tag }}</el-tag>
                    </div>
                </el-descriptions-item>

            </el-descriptions>
        </div>
        <div style="margin-top: 20px;">
            <el-descriptions class="margin-top" title="镜像配置" :column="2" border>
                <el-descriptions-item>
                    <template slot="label">
                        主机
                    </template>
                    {{ Config.hostname }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        用户
                    </template>
                    {{ Config.user }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        域
                    </template>
                    {{ Config.domain }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        工作目录
                    </template>
                    {{ Config.Working_dir }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        暴露端口
                    </template>
                    <div v-for="tag in Config.exposed_ports">
                        <el-tag>{{ tag }}</el-tag>
                    </div>

                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        环境变量
                    </template>
                    <div v-for="tag in Config.env">
                        <el-tag>{{ tag }}</el-tag>
                    </div>

                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        命令行
                    </template>
                    <div v-for="tag in Config.cmd">
                        <el-tag>{{ tag }}</el-tag>
                    </div>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        可映射目录
                    </template>
                    <div v-for="tag in Config.volumes">
                        <el-tag>{{ tag }}</el-tag>
                    </div>
                </el-descriptions-item>

            </el-descriptions>
        </div>
    </div>
</template>

<script>
import { GetDetail } from '@/api/mirror';
export default {
    name: "info",
    props: {
        name: {
            type: String,
        }
    },
    data() {
        return {
            imageName: "mysql:5.6",
            Detail: {},
            ContainerConfig: {},
            Config: {},
            descriptionsItems: ["architecture", "os", "id", "parent", "size", "container", "comment", "virtual_size", "created"],
            descriptionsItemsCH: ["CPU架构", "操作系统", "镜像ID", "父镜像", "镜像大小", "容器ID", "注释", "镜像虚拟大小", "创建时间"],
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        loadData() {
            GetDetail({ imageName: this.name })
                .then((res) => {
                    if (res.code == 0) {
                        this.Detail = res.data.info
                        this.ContainerConfig = res.data.container_config
                        this.Config = res.data.config
                        console.log(this.Detail);
                    }
                })
        }
    },
}
</script>

<style lang="scss" scoped>
::v-deep .el-descriptions :not(.is-bordered) .el-descriptions-item__cell {
    padding-bottom: 12px;
    min-width: 120px;
    text-align: center;
}
</style>