<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>岗位信息</div>
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
              <el-form-item label='岗位名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]" style="width: 100%;">
                  <el-input v-model='form.name'/>
              </el-form-item>
              <el-form-item label='所属部门：' prop='depna' :rules="[{ required: true, message: '所属部门不能为空'}]">
                  <el-input v-model='form.depna' @click='openDeptModal' readonly :suffix-icon='Search'/>
              </el-form-item>
              <el-form-item label='排序号：' style="width: 25%">
                  <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
              </el-form-item>
              <el-form-item label='是否可用：' style="width: 25%">
                  <el-switch v-model='form.avtag'/>
              </el-form-item>
              <el-form-item label='员工成员：' style="width: 100%;">
                  <el-input type='textarea' :rows='4' v-model='usersName' readonly @click='openUsersModal'/>
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
export default {name: 'SysOrgPostEdit'};
</script>
<script lang='ts' setup>
import {Search} from '@element-plus/icons-vue';
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
  url: '/sys/org/post',
  params: {path: '', query: ''},
  form: {avtag: true} as any,
});

const {form} = toRefs(state);

onMounted(async () => {
	state.params = <any>route;
	const depid = state.params.query?.depid;
	const depna = state.params.query?.depna;
	if (depid) {
		form.value.dept = { id: depid, name: depna };
		form.value.depid = depid;
		form.value.depna = depna;
	}
  await editInit({state, route});
  if (form.value.dept) {
    form.value.depna = form.value.dept.name;
  }
});


//region a 所属部门与员工成员逻辑
const orgModal = ref();

const openDeptModal = () => {
  orgModal.value.openModal({
    opener: 'dept',
    orgType: 3,
    selectMode: 1,
  });
};

const openUsersModal = () => {
  orgModal.value.openModal({
    opener: 'users',
    orgType: 8,
    selectMode: 2,
    orgs: toRaw(form.value.users),
  });
};

const closeOrgModal = (data: any) => {
  if (data.opener == 'dept') {
    if (data.orgs && data.orgs.length > 0) {
      form.value.dept = {id: data.orgs[0].id, name: data.orgs[0].name};
      form.value.depna = data.orgs[0].name;
      form.value.depid = data.orgs[0].id;
    }
  } else if (data.opener == 'users') {
    form.value.users = data.orgs;
  }
};

const usersName = computed(() => {
  let names = '';
  if (form.value.users && form.value.users.length > 0) {
    for (const user of form.value.users) {
      names += user.name + '；';
    }
  }
  return names;
});
//endregion


</script>

<style scoped>

</style>
