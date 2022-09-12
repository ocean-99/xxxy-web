<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>群组信息</div>
				</div>
				<div>
					<el-button type='success' @click='tabSave({formRef,state,proxy,route,flush:state.url})' plain>保 存</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
    </template>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref="formRef" :inline="true" class='zform' :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1'>
            <div class="zform-div">
              <el-form-item label='群组名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]" style="width: 100%">
                <el-input v-model='form.name'></el-input>
              </el-form-item>
              <el-form-item label='排序号：'>
                <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
              </el-form-item>
              <el-form-item label='是否可用：'>
                <el-switch v-model='form.avtag'/>
              </el-form-item>
              <el-form-item label='成员列表：' style="width: 100%;">
                <el-input type='textarea' :rows='4' v-model='membersName' readonly @click='openOrgsModal'/>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label='其他信息' name='tab9'>
            <div class="zform-div">
              <el-form-item label='备注：' style="width: 100%">
                <el-input type='textarea' :rows='4' v-model='form.notes'/>
              </el-form-item>
              <el-form-item label='创建时间：'>
                {{ form.crtim }}
              </el-form-item>
              <el-form-item label='更新时间：'>
                {{ form.uptim }}
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <OrgModal ref='orgModal' @close='closeOrgModal'/>
  </el-card>
</template>
<script lang='ts'>
export default {name: 'SysOrgGroupEdit'};
</script>
<script lang='ts' setup>
import {computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs} from 'vue';
import {editInit, tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import {FormInstance} from "element-plus";

const route = useRoute();
const formRef = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
  url: '/sys/org/group',
  params: {path: '', query: ''},
  form: {avtag: true} as any,
});

const {form} = toRefs(state);

onMounted(async () => {
  await editInit({state, route});
});


//region a 所属部门与员工成员逻辑
const orgModal = ref();

const openOrgsModal = () => {
  orgModal.value.openModal({
    orgType: 14,
    selectMode: 2,
    orgs: toRaw(form.value.members),
  });
};

const closeOrgModal = (data: any) => {
  form.value.members = data.orgs;
};

const membersName = computed(() => {
  let names = '';
  if (form.value.members && form.value.members.length > 0) {
    for (const user of form.value.members) {
      names += user.name + '；';
    }
  }
  return names;
});
//endregion


</script>

<style scoped>

</style>
