<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-28 20:35:05
 * @LastEditors: solid
 * @LastEditTime: 2022-10-28 20:49:48
-->
<template>
  <div class="container">
    <div class="info">
      <div class="item">
        <div style="margin-bottom: 20px;">镜像</div>
        <div class="nav" style="color:#000">{{images}}</div>
      </div>
      <div class="item">
        <div style="margin-bottom: 20px;">容器</div>
        <div class="nav" style="color:#000">{{containers}}</div>
      </div>
    </div>
    <div class="info2">
      <div class="item">
        <div style="margin-bottom: 20px;">运行中</div>
        <div class="nav" style="color:#67c23a">{{ containers_running }}</div>
      </div>
      <div class="item">
        <div style="margin-bottom: 20px;">已暂停</div>
        <div class="nav" style="color:#909399">{{ containers_paused }}</div>
      </div>
      <div class="item">
        <div style="margin-bottom: 20px;">停止</div>
        <div class="nav" style="color:#f56c6c">{{containers_stopped}}</div>
      </div>
    </div>
    <div class="desc">
      <el-descriptions class="margin-top" title="基本信息" :column="3" border>
        <el-descriptions-item v-for="(item, index) in detail" :key="item.key">
          <template slot="label">
            {{ mapp[item.key] }}
          </template>
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import { GetDetail } from '@/api/auth';
export default {
  name: "Index",
  data() {
    return {
      detail: [],
      mapp: {
        "ID": "ID",
        "name": "Docker名称",
        "version": "Docker版本",

        memory_limit: "是否启用内存限制",
        swap_limit: "是否启用交换限制",
        kernel_memory: "是否启用内核内存限制",

        CPU: "是否启用CPU集",
        pids_limit: "是否启用进程ID限制",
        debug: "debug模式",

        system: "操作系统",
        os: "操作系统版本",
        kernel_version: "Linux内核版本",

        architecture: "操作系统的体系结构",
        docker_root_dir: "Docker根目录",
        "driver": "Docker存储驱动程序的名称",

        NCPU: "CPU数量",
        mem_total: "总内存量",
        system_time: "系统时间",

        HttpProxy: "HTTP代理",
        HttpsProxy: "HTTPS代理",
        NGoroutines: "Goroutine数量",
      },
      /**
       * 数量
       */
      containers: 0,
      containers_running: 0,
      containers_paused: 0,
      containers_stopped: 0,
      images: 0,
    };
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      GetDetail()
        .then((res) => {
          let detail = []
          for (const key in res.data.detail) {
            detail.push({ key: key, value: res.data.detail[key] })
          }
          this.detail = detail
          this.containers=res.data.containers
          this.containers_running=res.data.containers_running
          this.containers_paused=res.data.containers_paused
          this.containers_stopped=res.data.containers_stopped
          this.images=res.data.images
        })
    }
  },
}
</script>
<style lang="scss" scoped>
.container {
  .info {
    margin-top: 60px;
    margin-left: 60px;
    margin-right: 60px;
    /* 声明一个容器 */
    display: grid;
    height: 140px;
    /*  声明列的宽度  */
    grid-template-rows: auto auto;
    grid-template-columns: repeat(2, auto);
    /*  声明行间距和列间距  */
    grid-gap: 20px;
  }

  .info2 {
    margin-bottom: 60px;
    margin-left: 60px;
    margin-right: 60px;
    /* 声明一个容器 */
    display: grid;
    height: 140px;
    /*  声明列的宽度  */
    grid-template-rows: auto auto;
    grid-template-columns: repeat(3, auto);
    /*  声明行间距和列间距  */
    grid-gap: 20px;
  }

  .item {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    flex-direction: column;
    color: rgba($color: #000000, $alpha: 0.6);

    .nav {
      font-size: 30px;
    }
  }

  .desc {
    margin-bottom: 60px;
    margin-left: 60px;
    margin-right: 60px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background-color: white;
  }

}
::v-deep .el-descriptions :not(.is-bordered) .el-descriptions-item__cell {
    padding-bottom: 12px;
    width: 200px;
    text-align: center;
}

::v-deep .el-descriptions-item__label {
    background-color: #fff;
    border-color: #000;
    color: rgba($color: #000000, $alpha: 0.5);
}
::v-deep .el-descriptions__header{
  padding: 20px;
  margin-bottom: 0;
  .el-descriptions__title{
    font-size: 20px;
  }
}
::v-deep .is-bordered-label{
  background-color: rgba(0, 0, 0, 0.1);
  
}
</style>