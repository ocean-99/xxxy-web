<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
      <el-row>
        <el-col :span='10'>
          <div style='line-height: 32px'>角色信息</div>
        </el-col>
        <el-col :span='14' style='text-align: right'>
          <el-button type='success' @click='save' plain>保 存</el-button>
          <el-button type='info' @click='tabClose(proxy,route)' plain>关 闭</el-button>
        </el-col>
      </el-row>
    </template>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref="formRef" class='zform' :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1'>
            <el-row style='border-top: 1px solid #d2d2d2;'>
              <el-col :span='24'>
                <el-form-item label='角色名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
                  <div class='zinput'>
                    <el-input v-model='form.name'></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='24'>
                <el-form-item label='指派用户：'>
                  <div class='zinput' style='height: auto'>
                    <el-input type='textarea' :rows='4' v-model='orgsName' readonly @click='openOrgsModal'>
                    </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='12'>
                <el-form-item label='排序号：'>
                  <div class='zinput'>
                    <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='是否可用：'>
                  <div class='zinput'>
                    <el-switch v-model='form.avtag'>
                    </el-switch>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='24'>
                <el-form-item label='备注：'>
                  <div class='zinput' style='height: auto'>
                    <el-input style="font-family: 'Courier New', Helvetica, Arial, sans-serif; font-size:16px"
                              type='textarea' :rows='4' v-model='form.notes'>
                    </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show='form.crtim'>
              <el-col :span='6'>
                <el-form-item label='创建人：'>
                  <div class='zinput'>
                    {{ form.crman ? form.crman.name : '' }}
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='6'>
                <el-form-item label='创建时间：'>
                  <div class='zinput'>
                    {{ form.crtim }}
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='6'>
                <el-form-item label='更新人：'>
                  <div class='zinput'>
                    {{ form.upman ? form.upman.name : '' }}
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='6'>
                <el-form-item label='更新时间：'>
                  <div class='zinput'>
                    {{ form.uptim }}
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label='菜单分配' name='tab3'>
            <div style='margin-bottom: 10px'>
              <el-button @click='expandAll' plain>展 开</el-button>
              <el-button @click='collapseAll' plain>折 叠</el-button>
            </div>
            <div style='border: 1px solid #eee'>
              <el-tree ref='treeRef' :data='treeData' show-checkbox node-key='id' :props="{children: 'children',label: 'name'}"/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <OrgModal ref='orgModal' @close='closeOrgModal'/>
  </el-card>
</template>
<script lang='ts'>
export default {name: 'sysPermRole'};
</script>
<script lang='ts' setup>
import {computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs} from 'vue';
import {editInit, tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import request from '/@/utils/request';
import {FormInstance} from "element-plus";

const route = useRoute();
const formRef = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
  url: '/sys/perm/role',
  params: {path: '', query: ''},
  form: {avtag: true,menus:[]} as any,
  treeData: [] as any,
});

const {form, treeData} = toRefs(state);

onMounted(async () => {
  await editInit(state, route);
  await treeDataInit();

});

//region -----d 展开折叠逻辑-----
const expandAll = () => {
  for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
    treeRef.value!.store._getAllNodes()[i].expanded = true;
  }
};

const collapseAll = () => {
  for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
    treeRef.value!.store._getAllNodes()[i].expanded = false;
  }
};
//


//region -----c 保存逻辑-----
const treeRef = ref();
const save = async () => {
  const nodes = treeRef.value.getCheckedNodes();
  const menus = [];
  for (const node of nodes) {
    menus.push({id: node.id, name: node.name});
  }
  form.value.menus = menus;
  await tabSave(formRef.value, state, proxy, route);
};
//endregion


//region -----a 指派成员逻辑-----
const orgModal = ref();

const openOrgsModal = () => {
  orgModal.value.openModal({
    orgType: 10,
    selectMode: 2,
    orgs: toRaw(form.value.orgs),
  });
};

const closeOrgModal = (data: any) => {
  form.value.orgs = data.orgs;
};

const orgsName = computed(() => {
  let names = '';
  if (form.value.orgs && form.value.orgs.length > 0) {
    for (const user of form.value.orgs) {
      names += user.name + '；';
    }
  }
  return names;
});
//endregion

//region -----b 菜单分配逻辑-----
async function treeDataInit() {
  treeData.value = await request({url: '/sys/perm/menu/tree', method: 'get'});
  const menus = [];
  for (const menu of form.value.menus) {
    menus.push(menu.id);
  }
  treeRef.value.setCheckedKeys(menus);
}

//endregion


</script>

<style scoped>

</style>
