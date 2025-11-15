<script lang="ts" setup>
import { requestClient } from '#/api/request';
import OrgModal from '#/components/sys/OrgModal.vue';
import { modalSave, reset } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const state = reactive({
  url: '/wf/org/node',
  show: false,
  form: {} as any,
});
const rdata = reactive({} as any);
const { form } = toRefs(state);
const formRef = ref();

const open = async (data: any) => {
  state.form = data && data.id ? await requestClient.get(`${state.url}/info/${data.id}`) : { treid: data.treid, pid: data.pid };
  rdata.notes = await requestClient.get(`${state.url}/tree?id=${data.id}`);
  await reset({ formRef: formRef.value, state });
};
defineExpose({ open });

const save = async () => {
  await modalSave({ formRef: formRef.value, state });
  emits('close');
};

// region a 包含成员逻辑
const orgModal = ref();

const openOrgModal = () => {
  orgModal.value.open({
    orgType: 15,
    selectMode: 1,
    orgs: form.value.memid ? toRaw([{ id: form.value.memid, name: form.value.memna }]) : [],
  });
};

const closeOrgModal = (data: any) => {
  if (data.orgs && data.orgs.length > 0) {
    form.value.memid = data.orgs[0].id;
    form.value.memna = data.orgs[0].name;
  } else {
    form.value.memid = '';
    form.value.memna = '';
  }
};

// endregion
</script>

<template>
  <el-drawer v-model="state.show" size="46%">
    <template #header>
      <h4>组织节点</h4>
      <OrgModal ref="orgModal" @close="closeOrgModal" />
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="140px" class="zform">
        <el-form-item label="上级节点">
          <el-tree-select clearable v-model="form.pid" :data="rdata.notes" :props="{ value: 'id', label: 'name' } as any" value-key="id" placeholder="选择上级分类" check-strictly />
        </el-form-item>
        <el-form-item label="节点名称" prop="name" :rules="[{ required: true, message: '节点名称不能为空' }]">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="排序号" prop="ornum" :rules="[{ required: true, message: '排序号不能为空' }]" style="width: 50%">
          <el-input-number v-model="form.ornum" controls-position="right" />
        </el-form-item>
        <el-form-item label="对应成员">
          <el-input v-model="form.memna" readonly @click="openOrgModal" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" :rows="2" type="textarea" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto; margin: 20px">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="state.show = false">关 闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>
