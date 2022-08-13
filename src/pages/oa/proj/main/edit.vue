<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
      <el-row>
        <el-col :span='10'>
          <div style='line-height: 32px'>项目编辑</div>
        </el-col>
        <el-col :span='14' style='text-align: right'>
          <el-button type='success' @click='tabSave({formRef,state,proxy,route,iouField:"crtim"})' plain>保 存</el-button>
          <el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
        </el-col>
      </el-row>
    </template>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref='formRef' :inline='true' class='yform' :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1'>
            <div class='yform-div'>
              <el-form-item label='项目名称：' prop='name' style='width:50%' :rules="[{ required: true, message: '名称不能为空'}]">
                <el-input v-model='form.name'/>
              </el-form-item>
              <el-form-item label='项目ID：' style='width: 25%'>
                <span class='zinput' v-if="form.crtim">{{form.id}}</span>
                <el-input v-model='form.id' v-else/>
              </el-form-item>
              <el-form-item label='项目编号：' style='width: 25%'>
                <span class='zinput' v-show='form.crtim' style='margin-left: 5px;color: green'>{{ form.senum }}</span>
                <span class='zinput' v-show='!form.crtim' style='margin-left: 5px;color: #b9abab'>提交后自动生成</span>
              </el-form-item>
              <el-form-item label='备注：' style='width: 100%'>
                <el-input type='textarea' :rows='4' v-model='form.notes'/>
              </el-form-item>
              <el-form-item label='负责人：' style='width: 100%'>
                <el-input v-model='prmanName' @click='openPrmanModal' readonly></el-input>
              </el-form-item>
              <el-form-item label='项目成员：' style='width: 100%'>
                <el-table size='small' border :data='form.members' :row-style="{height: '36px'}" style='width: 100%'>
                  <el-table-column label='排序号' width='90'>
                    <template #default='scope'>
                      <el-input-number v-model='scope.row.ornum' controls-position='right' style='width: 100%'/>
                    </template>
                  </el-table-column>
                  <el-table-column label='姓名' width='100'>
                    <template #default='scope'>
                      <el-input v-model='scope.row.name' required></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label='手机号' width='150'>
                    <template #default='scope'>
                      <el-input v-model='scope.row.monum' required></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label='邮箱' width='150'>
                    <template #default='scope'>
                      <el-input v-model='scope.row.email' required></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label='性别' width='80'>
                    <template #default='scope'>
                      <el-select v-model='scope.row.gender' placeholder=' ' style='width: 100%'>
                        <el-option value='m' label='男'/>
                        <el-option value='f' label='女'/>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label='职务' width='180'>
                    <template #default='scope'>
                      <el-input v-model='scope.row.post'></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label='备注'>
                    <template #default='scope'>
                      <el-input v-model='scope.row.notes'></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column fixed='right' label='操作' width='50' align='center'>
                    <template #header>
                      <el-icon :size='22' style='top: 5px;cursor: pointer' color='#666'>
                        <ele-CirclePlus @click='addItem'/>
                      </el-icon>
                    </template>
                    <template #default='scope'>
                      <el-icon :size='22' style='top: 3px;cursor: pointer'>
                        <ele-CircleClose @click='form.members.splice(scope.$index, 1)'/>
                      </el-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label='相关附件：' style='width: 100%'>
                <GenAtt :atts='form.atts' @update='attUpdate'  v-if='state.attShow' />
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label='权限信息' name='tab9'>
            <div class='yform-div'>
              <el-form-item label='可查看者：' style='width: 50%'>
                <el-input type='textarea' :rows='4' v-model='viewersName' readonly @click='openViewersModal'>
                </el-input>
              </el-form-item>
              <el-form-item label='可编辑者：' style='width: 50%'>
                <el-input type='textarea' :rows='4' v-model='editorsName' readonly @click='openEditorsModal'>
                </el-input>
              </el-form-item>
              <el-form-item label='创建人：' style='width: 25%'>
                {{ form.crman ? form.crman.name : '' }}
              </el-form-item>
              <el-form-item label='创建时间：' style='width: 25%'>
                <div class='zinput'> {{ form.crtim }}</div>
              </el-form-item>
              <el-form-item label='更新人：' style='width: 25%'>
                {{ form.upman ? form.upman.name : '' }}
              </el-form-item>
              <el-form-item label='更新时间：' style='width: 25%'>
                <div class='zinput'> {{ form.uptim }}</div>
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
export default {name: 'OaProjMainEdit}'};
</script>
<script lang='ts' setup>
import {computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs} from 'vue';
import {editInit, tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import {FormInstance} from 'element-plus';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import GenAtt from '/@/comps/gen/GenAtt.vue';
import {uuid} from '/@/utils/xutil';

const route = useRoute();
const formRef = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
  url: '/oa/proj/main', cates: [] as any,attShow:false,
  params: {path: '', query: ''},
  form: {avtag: true, members: [] as any, atts: [] as any} as any,
});

const {form} = toRefs(state);

onMounted(async () => {
  // console.log(_isMounted);
  await editInit({state, route});
  state.attShow=true;
});

//region -----组织架构逻辑-----
const orgModal = ref();

const openPrmanModal = () => {
  orgModal.value.openModal({
    opener: 'prman',
    orgType: 8,
  });
};

const openViewersModal = () => {
  orgModal.value.openModal({
    opener: 'viewers',
    orgType: 11,
    selectMode: 2,
    orgs: toRaw(form.value.viewers),
  });
};

const openEditorsModal = () => {
  orgModal.value.openModal({
    opener: 'editors',
    orgType: 11,
    selectMode: 2,
    orgs: toRaw(form.value.editors),
  });
};

const closeOrgModal = (data: any) => {
  if (data.opener == 'viewers') {
    if (data.orgs && data.orgs.length > 0) {
      form.value.viewers = data.orgs;
    } else {
      form.value.viewers = null;
    }
  } else if (data.opener == 'editors') {
    if (data.orgs && data.orgs.length > 0) {
      form.value.editors = data.orgs;
    } else {
      form.value.editors = null;
    }
  } else if (data.opener == 'prman') {
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

const viewersName = computed(() => {
  let names = '';
  if (form.value.viewers && form.value.viewers.length > 0) {
    for (const user of form.value.viewers) {
      names += user.name + '；';
    }
  }
  return names;
});

const editorsName = computed(() => {
  let names = '';
  if (form.value.editors && form.value.editors.length > 0) {
    for (const user of form.value.editors) {
      names += user.name + '；';
    }
  }
  return names;
});
//endregion

// region -----附件相关-----
const attUpdate = (atts: any) => {
    form.value.atts = atts;
};
// endregion

//region -----项目成员逻辑-----
const addItem = () => {
  let newOrnum = 1;
  if (form.value.members.length > 0) {
    newOrnum = form.value.members[form.value.members.length - 1].ornum + 1;
  }
  if (form.value.id) {
    form.value.members.push({
      id: uuid(), maiid: form.value.id, ornum: newOrnum,
    });
  } else {
    form.value.members.push({
      id: uuid(), ornum: newOrnum,
    });
  }
};
//endregiton


//region-----业务字典-----


//endregion


</script>
