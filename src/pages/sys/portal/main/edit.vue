<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>门户维护</div>
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
              <el-form-item label='门户名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]" style="width: 100%">
                  <el-input v-model='form.name'/>
              </el-form-item>

              <el-form-item label='排序号：'>
                  <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
              </el-form-item>
							<el-form-item label='是否可用：'>
								<el-switch v-model='form.avtag'/>
							</el-form-item>
<!--              <el-form-item label='可使用者：' style="width: 100%">-->
<!--                  <el-input type='textarea' :rows='4' v-model='viewersName' readonly @click='openOrgsModal'/>-->
<!--              </el-form-item>-->
            </div>
          </el-tab-pane>
          <el-tab-pane label='其他信息' name='tab9'>
<!--            <div class="zform-div">-->
<!--              <el-form-item label='备注：' style="width: 100%">-->
<!--                <el-input type='textarea' :rows='4' v-model='form.notes'/>-->
<!--              </el-form-item>-->
<!--              <el-form-item label='创建人：' style="width: 25%">-->
<!--								<div class='zinput'>{{ form.crman ? form.crman.name : '' }}</div>-->
<!--              </el-form-item>-->
<!--              <el-form-item label='创建时间：' style="width: 25%">-->
<!--                <div class='zinput'> {{ form.crtim }}</div>-->
<!--              </el-form-item>-->
<!--              <el-form-item label='更新人：' style="width: 25%">-->
<!--								<div class='zinput'> {{ form.upman ? form.upman.name : '' }}</div>-->
<!--              </el-form-item>-->
<!--              <el-form-item label='更新时间：' style="width: 25%">-->
<!--                <div class='zinput'> {{ form.uptim }}</div>-->
<!--              </el-form-item>-->
<!--            </div>-->
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <OrgModal ref='orgModal' @close='closeOrgModal'/>
  </el-card>
</template>
<script lang='ts'>
export default {name: 'SysPortalMainEditEdit'};
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
  url: '/sys/portal/main',
  params: {path: '', query: ''}, checks: [] as any,
  form: {avtag: true, items: [] as any} as any,
});

const {form} = toRefs(state);


onMounted(async () => {
  await editInit({state, route});
});


//region 经办人与可查看者选择逻辑
const orgModal = ref();

const openOrgModal = () => {
  orgModal.value.openModal({
    opener: 'opman',
    orgType: 8,
  });
};

const openOrgsModal = () => {
  orgModal.value.openModal({
    opener: 'viewers',
    orgType: 11,
    selectMode: 2,
    orgs: toRaw(form.value.viewers),
  });
};

const closeOrgModal = (data: any) => {
  if (data.opener == "opman") {
    if (data.orgs && data.orgs.length > 0) {
      form.value.opman = {id: data.orgs[0].id, name: data.orgs[0].name};
      form.value.opmid = data.orgs[0].id;
    } else {
      form.value.opman = null;
      form.value.opmid = null;
    }
  } else if (data.opener == "viewers") {
    if (data.orgs && data.orgs.length > 0) {
      form.value.viewers = data.orgs;
    } else {
      form.value.viewers = null;
    }
  }
};

const opmna = computed(() => {
  let name = '';
  if (form.value.opman) {
    name = form.value.opman.name;
  }
  return name;
});

const viewersName = computed(() => {
  let names = '';
  if (form.value.viewers && form.value.viewers.length > 0) {
    for (const user of form.value.viewers) {
      names += user.name + '；';
    }
  }
  return names;
});
//endregion

</script>

<style scoped>

</style>
