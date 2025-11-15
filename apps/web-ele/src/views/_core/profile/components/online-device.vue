<script setup lang="ts">
import { requestClient } from '#/api/request';
import { parseTime } from '#/utils/ruoyi';

async function handleForceOffline(row: any) {
  ElMessageBox.confirm(`确认强制下线${row.userName}?`, '提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
    .then(async () => {
      await requestClient.deleteWithMsg<void>(`/mon/online/user/kick/${row.tokenId}`);
      await listQuery();
    })
    .catch(() => {});
}

const state = reactive({
  list: [] as any,
});

onMounted(async () => {
  await listQuery();
});

const listQuery = async () => {
  // const res = await onlineDeviceList();
  state.list = await requestClient.get('/mon/online/user/list');
  // state.list = res.rows;
};
</script>

<template>
  <div>
    <el-table :data="state.list" style="width: 100%; height: 100%; font-size: 14px">
      <el-table-column label="设备类型" align="center">
        <!--        <template #default="scope">-->
        <!--          <dict-tag :options="sys_device_type" :value="scope.row.deviceType" />-->
        <!--        </template>-->
      </el-table-column>
      <el-table-column label="主机" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
      <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
      <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
      <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
      <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleForceOffline(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
