<template>
    <div>
        <el-descriptions class="margin-top" title="环境变量" :column="1" border>
            <el-descriptions-item v-for="(item, index) in detail.env" :key="item.key">
                <template slot="label">
                    {{ item.key }}
                </template>
                {{ item.value }}
            </el-descriptions-item>
        </el-descriptions>
        <div style="margin: 20px 0;"></div>
        <el-descriptions class="margin-top" title="端口暴露" :column="1" border>
            <el-descriptions-item v-for="(item, index) in detail.exposed_ports" :key="item.key">
                <template slot="label">
                    {{ item.key }}
                </template>
                {{ item.value }}
            </el-descriptions-item>
        </el-descriptions>
        <div style="margin: 20px 0;"></div>
        <el-descriptions class="margin-top" title="目录挂载" :column="1" border>
            <el-descriptions-item v-for="(item, index) in detail.mounts" :key="item.key">
                <template slot="label">
                    {{ item.key }}
                </template>
                {{ item.value }}
            </el-descriptions-item>
        </el-descriptions>
        <div style="margin: 20px 0;"></div>
        <el-descriptions class="margin-top" title="网络" :column="1" border>
            <el-descriptions-item v-for="(item, index) in detail.networkConfig" :key="item.key">
                <template slot="label">
                    {{ item.key }}
                </template>
                <div v-for="tag in  item.value">
                    <el-tag>{{ tag }}</el-tag>
                </div>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script>
import { GetDetail } from '@/api/container';
export default {
    name: "info",
    props: {
        name: {
            type: String,
        }
    },
    data() {
        return {
            detail: {},
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        loadData() {
            GetDetail({ containerId: this.name })
                .then((res) => {
                    if (res.code == 0) {
                        this.detail = res.data
                    }
                })
        }
    },
}
</script>

<style lang="scss" scoped>
::v-deep .el-descriptions :not(.is-bordered) .el-descriptions-item__cell {
    padding-bottom: 12px;
    width: 50%;
    text-align: center;
}

::v-deep .el-descriptions-item__label {
    background-color: #fff;
    border-color: #000;
    color: rgba($color: #000000, $alpha: 0.5);
}
</style>