<template>
  <el-drawer v-model='state.show' size='50%'>
    <template #title>
      <h4>任务编辑</h4>
      <OrgModal ref='orgModal' @close='closeOrgModal'/>
    </template>
    <template #default>
      <div style='padding: 20px;border-top: 1px solid #ccc'>
        <el-form ref='formRef' :model='form' :inline='true' class='yform'  label-width='160px'>
          <el-tabs type='card' v-model='activeName'>
            <el-tab-pane label='基本信息' name='tab1'>
              <div class='yform-div'>
                <el-form-item label='任务名称：' prop='name' style='width:100%' :rules="[{ required: true, message: '名称不能为空'}]">
                  <el-input v-model='form.name'/>
                </el-form-item>
                <el-form-item label='负责人：' style='width: 50%'>
                  <el-input v-model='prmanName' @click='openPrmanModal' readonly></el-input>
                </el-form-item>
                <el-form-item label='截止时间：' style='width: 50%'>
                  <el-date-picker v-model="form.eetim" type="date" placeholder="请选择" style='width: 100%'/>
                </el-form-item>
                <el-form-item label='任务内容：' style='width: 100%'>
                  <el-input type='textarea' :rows='8' v-model='form.cont'/>
                </el-form-item>
                <el-form-item label='相关附件：' style='width: 100%'>
                  <GenAtt :atts='form.atts' @update='attUpdate'  v-if='state.attShow' />
                </el-form-item>
              </div>
            </el-tab-pane>
            <el-tab-pane label='其他信息' name='tab9'>
              <div class='yform-div'>
                <el-form-item label='备注：' style='width: 100%'>
                  <el-input type='textarea' :rows='4' v-model='form.notes'/>
                </el-form-item>
                <el-form-item label='发起人：' style='width: 50%'>
                  {{ form.crman ? form.crman.name : '' }}
                </el-form-item>
                <el-form-item label='发起时间：' style='width: 50%'>
                  <div class='zinput'> {{ form.crtim }}</div>
                </el-form-item>
                <el-form-item label='修改人：' style='width: 50%'>
                  {{ form.upman ? form.upman.name : '' }}
                </el-form-item>
                <el-form-item label='修改时间：' style='width: 50%'>
                  <div class='zinput'> {{ form.uptim }}</div>
                </el-form-item>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style='flex: auto;margin: 20px'>
        <el-button type='primary' @click='confirm'>确认</el-button>
        <el-button @click='state.show = false'>取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang='ts' setup>
import {computed, onMounted, reactive, ref, toRaw, toRefs} from 'vue';
import {drawerOpen, drawerSave} from '/@/comps/page/edit';
import {FormInstance} from "element-plus";
import OrgModal from '/@/comps/sys/OrgModal.vue';
import GenAtt from '/@/comps/gen/GenAtt.vue';

const formRef = ref<FormInstance>();
const activeName = ref('tab1');

const state = reactive({
  url: '/oa/proj/task', show: false, apis: [] as any,
  form: {
    avtag: true,
    catag: true,
    shtag: true,
  } as any,
});

const {form} = toRefs(state);

//暴露open方法给父组件调用
const open = async (data: any) => {
  if (!data.id) {
    if (data.pid) {
      state.form = {
        avtag: true,
        parna: data.pname,
        pid: data.pid,
        porid: data.porid,
      };
      state.show = true;
    } else {
      state.form = {
        avtag: true,
        porid: data.porid,
        tliid:data.tliid,
      };
      state.show = true;
    }
  } else if (data.id) {
    await drawerOpen({state, id:data.id});
  }
};
defineExpose({open});

//取得父组件listQuery方法的调用权
const emits = defineEmits(['afterEdit']);
const confirm = async () => {
  await drawerSave({formRef:formRef.value, state});
  emits('afterEdit');
};


//region -----组织架构逻辑-----
const orgModal = ref();

const openPrmanModal = () => {
  orgModal.value.openModal({
    opener: 'prman',
    orgType: 8,
  });
};

const closeOrgModal = (data: any) => {
   if (data.opener == 'prman') {
    if (data.orgs && data.orgs.length > 0) {
      form.value.prman = {};
      form.value.prman = {id: data.orgs[0].id, name: data.orgs[0].name};
      form.value.prmid = data.orgs[0].id;
    } else {
      form.value.prman = null;
      form.value.prmid = null;
    }
  }
};

const prmanName = computed(() => {
  return form.value.prman ? form.value.prman.name : '';
});

//endregion

//页面初始化

onMounted(() => {

});


//region -----上级菜单选择逻辑-----
const parentModal = ref();

const openParentModal = () => {
  parentModal.value.openModal({reload:true,params:{porid:state.form.porid}});
};

const closeParentModal = (node: any) => {
  form.value.pid = node.id;
  form.value.parna = node.name;
};
//endregion


</script>

<style scoped>
</style>
