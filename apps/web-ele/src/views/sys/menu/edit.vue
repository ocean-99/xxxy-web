<script lang="ts" setup>
import { VbenIcon } from '@vben/icons';

import { requestClient } from '#/api/request';
import { drawerSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const formRef = ref();
const state = reactive({
  url: '/sys/menu',
  show: false,
  form: {} as any,
});
const rdata = reactive({} as any);
const { form } = toRefs(state);

// 暴露open方法给父组件调用
const open = async (data: any) => {
  if (data && data.id) {
    state.form = await requestClient.get(`${state.url}/info/${data.id}`);
    rdata.menus = await requestClient.get(`${state.url}/tree?id=${data.id}`);
  } else {
    state.form = { avtag: true, pid: data.pid, shtag: true, catag: false, outag: false };
    rdata.menus = await requestClient.get(`${state.url}/tree`);
  }
  if (state.form.pid === 0 || state.form.pid === '0' || state.form.pid === undefined) {
    delete state.form.pid;
  }
  state.show = true;
  formRef?.value?.clearValidate();
};
defineExpose({ open });

const save = async () => {
  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};

const openIcon = () => {
  window.open('https://icon-sets.iconify.design/');
};

const pathChange = () => {
  // state.form.comp = `${state.form.path}/index`;
};
</script>

<template>
  <el-drawer v-model="state.show" size="46%">
    <template #header>
      <h4>菜单信息--{{ form.id ? '修改' : '新增' }}</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="100px" class="zform">
        <el-form-item label="上级菜单">
          <el-tree-select clearable v-model="form.pid" :data="rdata.menus" :props="{ value: 'id', label: 'name' } as any" value-key="id" placeholder="选择上级菜单" check-strictly />
        </el-form-item>
        <el-form-item label="菜单类型" style="width: 50%" prop="type" :rules="[{ required: true, message: '菜单类型不能为空' }]">
          <el-select v-model="form.type">
            <el-option value="1" label="目录" />
            <el-option value="2" label="菜单" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="ornum" :rules="[{ required: true, message: '排序号不能为空' }]" style="width: 50%">
          <el-input-number v-model="form.ornum" controls-position="right" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name" :rules="[{ required: true, message: '菜单名称不能为空' }]">
          <el-input v-model="form.name" placeholder="请输入菜单名称" maxlength="100" />
          <template #label>
            <span>
              <el-tooltip content="支持i18n写法, 如: sys.org.user" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              菜单名称
            </span>
          </template>
        </el-form-item>
        <el-form-item prop="icon" :rules="[{ required: true, message: '菜单图标不能为空' }]">
          <template #label>
            <span>
              <el-tooltip content="点击搜索图标跳转到iconify & 粘贴" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              菜单图标
            </span>
          </template>
          <el-input v-model="form.icon" placeholder="请输入iconify图标名称">
            <template #prepend>
              <VbenIcon :icon="form.icon" />
            </template>
            <template #append>
              <el-button icon="Search" @click="openIcon" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="path" :rules="[{ required: true, message: '路由地址不能为空' }]" @keyup="pathChange">
          <template #label>
            <span>
              <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              路由地址
            </span>
          </template>
          <el-input v-model="form.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item prop="comp" v-if="form.type === '2'" :rules="[{ required: form.type === '2', message: '路由地址不能为空' }]">
          <template #label>
            <span>
              <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              组件路径
            </span>
          </template>
          <el-input v-model="form.comp" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item v-if="form.type === '2'">
          <el-input v-model="form.param" placeholder="请输入路由参数" maxlength="255" />
          <template #label>
            <span>
              <el-tooltip content="访问路由的默认传递参数，如：`{'id': 1, 'name': 'ry'}`" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              路由参数
            </span>
          </template>
        </el-form-item>
        <el-form-item v-if="form.type === '2'" style="width: 50%">
          <template #label>
            <span>
              <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              是否缓存
            </span>
          </template>
          <el-radio-group v-model="form.catag">
            <el-radio :value="true">缓存</el-radio>
            <el-radio :value="false">不缓存</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type === '2'" style="width: 50%">
          <template #label>
            <span>
              <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              是否外链
            </span>
          </template>
          <el-radio-group v-model="form.outag">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="width: 50%">
          <template #label>
            <span>
              <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              是否显示
            </span>
          </template>
          <el-switch v-model="form.shtag" />
        </el-form-item>
        <el-form-item style="width: 50%">
          <template #label>
            <span>
              <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              是否可用
            </span>
          </template>
          <el-switch v-model="form.avtag" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" :rows="3" type="textarea" />
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
