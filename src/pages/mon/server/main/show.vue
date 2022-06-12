<template>
  <div class="app-container" style="overflow: hidden">
    <el-row :gutter="10">
      <el-col :lg="24" class="card-box" v-if="server.cpu" >
        <el-card class="box-card">
          <template #header>
            <span>系统状态</span>
          </template>

          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="mr30">
            <div class="title">CPU使用率</div>
            <el-tooltip placement="top-end">
              <template #content>
                <div style="font-size: 12px">
                  <div style="padding: 3px">当前空闲率：{{ server.cpu.free }}</div>
                  <div style="padding: 3px">系统使用率：{{ server.cpu.sys }}</div>
                  <div style="padding: 3px">用户使用率：{{ server.cpu.used }}</div>
                </div>
              </template>
              <div class="content">
                <el-progress type="dashboard" :percentage="parseFloat(server.cpu.sys)"/>
              </div>
            </el-tooltip>
            <div class="footer" v-if="server.sys">{{ server.cpu.cpuNum }} 核心</div>
          </el-col>

          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8"  class="mr30">
            <div class="title">内存使用率</div>
            <el-tooltip placement="top-end">
              <template #content>
                <div style="font-size: 12px">
                  <div style="padding: 3px">总量：{{ server.mem.total }}</div>
                  <div style="padding: 3px">已使用：{{ server.mem.used }}</div>
                  <div style="padding: 3px">空闲：{{ server.mem.free }}</div>
                </div>
              </template>

              <div class="content">
                <el-progress type="dashboard" :percentage="server.mem.usage"/>
              </div>
            </el-tooltip>
            <div class="footer">{{ server.mem.used }}GB / {{ server.mem.total }}GB </div>
          </el-col>


          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8"  class="mr30">
            <div class="title">JVM使用率</div>
            <el-tooltip placement="top-end">
              <template #content>
                <div style="font-size: 12px">
                  <div style="padding: 3px">总量：{{ server.jvm.total }}</div>
                  <div style="padding: 3px">已使用：{{ server.jvm.used }}</div>
                  <div style="padding: 3px">空闲：{{ server.jvm.free }}</div>
                </div>
              </template>

              <div class="content">
                <el-progress type="dashboard" :percentage="server.jvm.usage"/>
              </div>
            </el-tooltip>
            <div class="footer">{{ server.jvm.used }}GB / {{ server.jvm.total }}GB </div>
          </el-col>
        </el-card>
      </el-col>

      <el-col :lg="24" class="card-box" style="margin-top: 6px">
        <el-card>
          <template #header>
            <span>磁盘状态</span>
          </template>
          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="mr30" v-for="sysFile in server.sysFiles" :key="sysFile.dirName">
            <div class="title">{{ sysFile.dirName }}盘使用率</div>
            <div class="content">
              <el-tooltip placement="top-end">
                <template #content>
                  <div style="font-size: 12px">
                    <div style="padding: 3px">总量：{{ sysFile.total }}</div>
                    <div style="padding: 3px">空闲：{{ sysFile.free }}</div>
                    <div style="padding: 3px">已用：{{ sysFile.used }}</div>
                  </div>
                </template>
                <div class="content">
                  <el-progress type="dashboard" :percentage="parseFloat(sysFile.usage)"/>
                </div>
              </el-tooltip>
            </div>
            <div class="footer">{{ sysFile.used }}/{{ sysFile.total }}</div>
          </el-col>
        </el-card>
      </el-col>


      <el-col :lg="24" class="card-box" style="margin-top: 6px">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>服务器信息</span>
            </div>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%" v-if="server.sys">
              <tbody>
              <tr>
                <td>
                  <div class="cell">服务器名称</div>
                </td>
                <td>
                  <div class="cell">{{ server.sys.computerName }}</div>
                </td>
                <td>
                  <div class="cell">操作系统</div>
                </td>
                <td>
                  <div class="cell">{{ server.sys.osName }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell">服务器IP</div>
                </td>
                <td>
                  <div class="cell">{{ server.sys.computerIp }}</div>
                </td>
                <td>
                  <div class="cell">系统架构</div>
                </td>
                <td>
                  <div class="cell">{{ server.sys.osArch }}</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box" style="margin-top: 6px">
        <el-card>
          <div slot="header">
            <span>Java虚拟机信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;table-layout:fixed;">
              <tbody>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">Java名称</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ server.jvm.name }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">Java版本</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ server.jvm.version }}</div></td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">启动时间</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ server.jvm.startTime }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">运行时长</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ server.jvm.runTime }}</div></td>
              </tr>
              <tr>
                <td colspan="1" class="el-table__cell is-leaf"><div class="cell">安装路径</div></td>
                <td colspan="3" class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ server.jvm.home }}</div></td>
              </tr>
              <tr>
                <td colspan="1" class="el-table__cell is-leaf"><div class="cell">项目路径</div></td>
                <td colspan="3" class="el-table__cell is-leaf"><div class="cell" v-if="server.sys">{{ server.sys.userDir }}</div></td>
              </tr>
              <tr>
                <td colspan="1" class="el-table__cell is-leaf"><div class="cell">运行参数</div></td>
                <td colspan="3" class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ server.jvm.inputArgs }}</div></td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script lang='ts' setup>
import {onMounted, reactive, ref} from "vue";
import request from "/@/utils/request";
import {ElLoading} from "element-plus";


const state = reactive({
  url: '/mon/server/main', loading: true, ids: [], cates: [] as any,
  single: true, multiple: true, list: [], total: 0,
});


// 服务器信息
const server = ref([]) as any;
// const intervalId = ref(null)
// const { proxy } = getCurrentInstance()

onMounted(async () => {
  const loading = ElLoading.service({
    lock: true,
    fullscreen: true,
    text:'正在获取服务器监控数据，请稍等',
    background: 'rgba(0, 0, 0, 0.5)',
  });
  server.value = await request({
    url: state.url,
    method: 'get',
  }).catch(() => {
    loading.close();
  });
  loading.close();
  // const canSubmit = await checkSubmit(data.formRef);
  // if (!canSubmit) {
  //
  //   return false;
  // }
});


</script>
<style scoped>
table tr {
  height: 30px;
}

.is-leaf {
  text-align: center;
  padding: 0 10px;
}

.title {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #999;
  margin-bottom: 16px;
}

.footer {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #999;
  margin-top: -5px;
  margin-bottom: 10px;
}

.content {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
