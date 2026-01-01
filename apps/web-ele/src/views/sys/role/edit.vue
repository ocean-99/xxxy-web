<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { VbenIcon } from '@vben/icons';

import { requestClient } from '#/api/request';
import OrgModal from '#/components/sys/OrgModal.vue';
import { tabSave } from '#/utils/page/edit';
import { handleTree } from '#/utils/ruoyi';

const formRef = ref();

const state = reactive({
  url: '/sys/role',
  show: true,
  form: {} as any,
});
const rdata = reactive({} as any);
const { form } = toRefs(state);
const activeName = ref('tab1');
const permTableRef = ref();
const treeProps = reactive({
  checkStrictly: true,
});

onMounted(async () => {
  const id = useRoute().query?.id;
  state.form = id ? await requestClient.get(`${state.url}/info/${id}`) : { avtag: true, type: 1 };
  formRef?.value?.clearValidate();
  const perms = await requestClient.get(`/sys/role/perms`);
  rdata.perms = handleTree(perms);
  if (id) {
    await nextTick(() => {
      perms.forEach((row: any) => {
        for (const menid of form.value.menus) {
          if (menid === row.id) {
            permTableRef.value.toggleRowSelection(row, true);
            break;
          }
        }
      });
    });
  }
});

const { closeCurrentTab } = useTabs();
const save = async () => {
  form.value.menus = [];
  const selectedMenus = permTableRef.value.getSelectionRows();
  for (const menu of selectedMenus) {
    form.value.menus.push(menu.id);
  }
  const back = await tabSave({
    formRef: formRef.value,
    state,
  });
  if (back) {
    await closeCurrentTab();
  }
};

// region a 包含成员逻辑
const orgModal = ref();

const openOrgsModal = () => {
  orgModal.value.open({
    orgType: 15,
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
    for (const org of form.value.orgs) {
      names += `${org.name}；`;
    }
  }
  return names;
});
// endregion
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>权限角色</el-space>
          <el-space>
            <el-button type="primary" @click="save">保 存</el-button>
            <el-button @click="closeCurrentTab()">关 闭</el-button>
          </el-space>
        </div>
      </template>
      <div style="height: calc(100% - 50px); overflow: auto; padding-top: 5px; padding-left: 0; padding-right: 0">
        <el-form :inline="true" ref="formRef" :model="form" label-width="140px" class="zform">
          <el-tabs type="card" v-model="activeName" style="width: 100%">
            <el-tab-pane label="基本信息" name="tab1">
              <el-form-item label="角色名称：" prop="name" :rules="[{ required: true, message: '名称不能为空' }]" style="width: 50%">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item label="排序号：" prop="ornum" :rules="[{ required: true, message: '排序号不能为空' }]" style="width: 25%">
                <el-input-number v-model="form.ornum" controls-position="right" style="width: 100%" />
              </el-form-item>
              <el-form-item label="是否可用：" style="width: 25%">
                <el-switch v-model="form.avtag" />
              </el-form-item>
              <el-form-item label="包含成员：">
                <el-input type="textarea" placeholder="这里可以选择用户，部门，岗位，群组。权限都会生效" :rows="4" v-model="orgsName" readonly @click="openOrgsModal" />
              </el-form-item>
              <el-form-item label="角色类型：" style="width: 50%">
                <el-select v-model="form.type">
                  <el-option :value="1" label="综合角色" />
                  <el-option :value="2" label="数据权限角色" />
                  <el-option :value="3" label="菜单角色" />
                  <el-option :value="4" label="接口角色" />
                  <el-option :value="5" label="菜单与接口角色" />
                </el-select>
              </el-form-item>
              <el-form-item label="数据权限：" style="width: 50%">
                <el-select v-model="form.scope" clearable>
                  <el-option :value="1" label="全部数据权限" />
                  <el-option :value="2" label="自定数据权限" />
                  <el-option :value="3" label="本部门数据权限" />
                  <el-option :value="4" label="本部门及以下数据权限" />
                  <el-option :value="5" label="仅本人数据权限" />
                  <el-option :value="6" label="部门及以下或本人数据权限" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注：" style="width: 100%">
                <el-input style="font-family: 'Courier New', Helvetica, Arial, sans-serif; font-size: 16px" type="textarea" :rows="3" v-model="form.notes" />
              </el-form-item>
              <div v-show="form.crtim">
                <el-form-item label="创建人：" style="width: 50%">
                  <div class="zinput">{{ form.cruna }}</div>
                </el-form-item>
                <el-form-item label="创建时间：" style="width: 50%">
                  <div class="zinput">{{ form.crtim }}</div>
                </el-form-item>
                <el-form-item label="更新人：" style="width: 50%">
                  <div class="zinput">{{ form.upuna }}</div>
                </el-form-item>
                <el-form-item label="更新时间：" style="width: 50%">
                  <div class="zinput">{{ form.uptim }}</div>
                </el-form-item>
              </div>
            </el-tab-pane>
            <el-tab-pane label="权限分配" name="tab2">
              <el-table ref="permTableRef" :tree-props="treeProps" :data="rdata.perms" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all>
                <el-table-column type="selection" width="46" align="center" />
                <el-table-column prop="name" label="菜单名称" width="160" />
                <el-table-column label="图标" prop="icon" width="55" align="center">
                  <template #default="scope">
                    <div style="display: flex; justify-content: center; align-items: center">
                      <VbenIcon :icon="scope.row.icon" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="类型" prop="type" width="68" align="center">
                  <template #default="scope">
                    <el-tag type="primary" v-if="scope.row.type === '1'">目录</el-tag>
                    <el-tag type="success" v-else>菜单</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="接口列表" prop="api">
                  <template #default="scope">
                    <el-checkbox-group v-model="form.apis">
                      <el-checkbox v-for="item in scope.row.apis" :key="item.id" :label="item.name" :value="item.id" />
                    </el-checkbox-group>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </el-card>
    <OrgModal ref="orgModal" @close="closeOrgModal" />
  </Page>
</template>
