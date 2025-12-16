<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { buildUUID } from '@vben/utils';

import { ElMessage } from 'element-plus';

import { requestClient } from '#/api/request';
import { tabSave } from '#/utils/page/edit';

const formRef = ref();

const state = reactive({
  url: '/tool/code/table',
  show: true,
  itemSelectedIds: [],
  form: {} as any,
});
const { form } = toRefs(state);
const activeName = ref('tab1');

onMounted(async () => {
  const id = useRoute().query?.id;
  state.form = id ? await requestClient.get(`${state.url}/info/${id}`) : { avtag: true, fields: [] };
  formRef?.value?.clearValidate();
});

const { closeCurrentTab } = useTabs();
const save = async () => {
  const back = await tabSave({
    formRef: formRef.value,
    state,
  });
  if (back) {
    await closeCurrentTab();
  }
};

const nameChange = () => {
  let resStr = form.value.name.replaceAll(/_(\w)/g, (_: any, letter: any) => letter.toUpperCase());
  resStr = resStr.slice(0, 1).toUpperCase() + resStr.slice(1);
  form.value.bunam = resStr;
};

const edtypChange = () => {
  if (form.value.pecol === 4) {
    form.value.pecol = 1;
  }
};

// // 字符串下划线转驼峰
// const formatToHump = (value) => {
//   return value.replace(/\_(\w)/g, (_, letter:any) => letter.toUpperCase())
// }
//
// // 字符串驼峰转下划线
// const formatToLine = (value) => {
//   return value.replace(/([A-Z])/g, '_$1').toLowerCase()
// }

// function asdf(arr:any){
//   //判断下划线位置，下划线位置加一，调用js的大写方法toUpperCase();
//   let a = arr.indexOf('_');
//   let lit = arr.split('');
//   lit[a+1] = lit[a+1].toUpperCase();
//   arr = lit.join('');
//   arr = arr.split('_').join('');
// }

// region-----字段逻辑-----
const addItem = () => {
  let newOrnum = 1;
  if (form.value.fields.length > 0) {
    newOrnum = form.value.fields[form.value.fields.length - 1].ornum + 1;
  }
  if (form.value.id) {
    form.value.fields.push({
      id: buildUUID(),
      tabid: form.value.id,
      ornum: newOrnum,
    });
  } else {
    form.value.fields.push({
      id: buildUUID(),
      ornum: newOrnum,
    });
  }
};

const itemSelect = (selection: any) => {
  state.itemSelectedIds = selection.map((item: any) => item.id);
};

const delItem = ($index: any) => {
  form.value.fields.splice($index, 1);
  for (let i = $index; i < form.value.fields.length; i++) {
    form.value.fields[i].ornum = i + 1;
  }
};

const delsItem = () => {
  if (state.itemSelectedIds.length <= 0) {
    ElMessage.warning('请选择后再进行删除');
    return;
  }
  for (let index = form.value.fields.length - 1; index >= 0; index--) {
    for (let i = 0; i < state.itemSelectedIds.length; i++) {
      if (state.itemSelectedIds[i] === form.value.fields[index].id) {
        form.value.fields.splice(index, 1);
        break;
      }
    }
  }
  for (let i = 0; i < form.value.fields.length; i++) {
    form.value.fields[i].ornum = i + 1;
  }
};

const upItem = () => {
  if (state.itemSelectedIds.length <= 0) {
    ElMessage.warning('请选择后再进行操作');
    return;
  }
  for (let i = 0; i <= form.value.fields.length - 1; i++) {
    for (let j = 0; j < state.itemSelectedIds.length; j++) {
      if (state.itemSelectedIds[j] === form.value.fields[i].id) {
        if (i === 0) {
          ElMessage.warning('已经是第一项');
          return;
        } else {
          const swap = form.value.fields[i - 1];
          form.value.fields[i - 1] = form.value.fields[i];
          form.value.fields[i - 1].ornum--;
          form.value.fields[i] = swap;
          form.value.fields[i].ornum++;
        }
        break;
      }
    }
  }
};

const downItem = () => {
  if (state.itemSelectedIds.length <= 0) {
    ElMessage.warning('请选择后再进行操作');
    return;
  }
  for (let i = form.value.fields.length - 1; i >= 0; i--) {
    for (let j = state.itemSelectedIds.length - 1; j >= 0; j--) {
      if (state.itemSelectedIds[j] === form.value.fields[i].id) {
        if (i === form.value.fields.length - 1) {
          ElMessage.warning('已经是最后一项');
          return;
        } else {
          const swap = form.value.fields[i + 1];
          form.value.fields[i + 1] = form.value.fields[i];
          form.value.fields[i + 1].ornum++;
          form.value.fields[i] = swap;
          form.value.fields[i].ornum--;
        }
        break;
      }
    }
  }
};

const copyItem = () => {
  if (state.itemSelectedIds.length <= 0) {
    ElMessage.warning('请选择后再进行操作');
    return;
  }
  for (let i = 0; i <= form.value.fields.length - 1; i++) {
    for (let j = 0; j < state.itemSelectedIds.length; j++) {
      if (state.itemSelectedIds[j] === form.value.fields[i].id) {
        const newField: any = deepClone(form.value.fields[i]);
        newField.id = buildUUID();
        newField.edtag = false;
        newField.ornum = form.value.fields.length + 1;
        form.value.fields.push(newField);
        break;
      }
    }
  }
};

function deepClone(obj: any) {
  if (obj === null) return;
  const newObj: any = obj.push ? [] : {};
  for (const attr in obj) {
    newObj[attr] = typeof obj[attr] === 'object' ? deepClone(obj[attr]) : obj[attr];
  }
  return newObj;
}
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>代码生成</el-space>
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
<!--              <el-form-item label="基础包名：" prop="panam" :rules="[{ required: true, message: '基础包名不能为空' }]" style="width: 50%">-->
<!--                <el-input v-model="form.panam" />-->
<!--              </el-form-item>-->
              <el-form-item label="ORM类型：" prop="ortyp" :rules="[{ required: true, message: 'ORM类型不能为空' }]" style="width: 50%">
                <el-select v-model="form.ortyp" style="width: 100%">
                  <el-option label="mybatis" value="mybatis" />
                  <el-option label="jpa" value="jpa" />
                  <el-option label="sqlsugar" value="sqlsugar" />
                </el-select>
              </el-form-item>
              <el-form-item label="上级菜单：" style="width: 50%">
                <el-select v-model="form.pmeid" style="width: 100%" clearable>
                  <el-option label="待完成1" value="tf1" />
                  <el-option label="待完成2" value="tf2" />
                </el-select>
              </el-form-item>
              <el-form-item label="表名称：" prop="name" :rules="[{ required: true, message: '表名称不能为空' }]" style="width: 50%">
                <el-input v-model="form.name" @keyup="nameChange" />
              </el-form-item>
              <el-form-item label="表描述：" prop="remark" :rules="[{ required: true, message: '表描述不能为空' }]" style="width: 50%">
                <el-input v-model="form.remark" />
              </el-form-item>
              <el-form-item label="实体类：" prop="bunam" :rules="[{ required: true, message: '实体类不能为空' }]" style="width: 50%">
                <el-input v-model="form.bunam" />
              </el-form-item>
              <el-form-item label="继承基类：" prop="baent" :rules="[{ required: true, message: '继承基类不能为空' }]" style="width: 50%">
                <el-select v-model="form.baent" style="width: 100%">
                  <el-option label="BaseMainEntity（主信息表）" value="BaseMainEntity" />
                  <el-option label="BaseCateEntity（分类表）" value="BaseCateEntity" />
                  <el-option label="BaseEntity（只含id,name）" value="BaseEntity" />
                </el-select>
              </el-form-item>
              <el-form-item label="编辑页类型：" prop="edtyp" :rules="[{ required: true, message: '名称不能为空' }]" style="width: 50%">
                <el-select v-model="form.edtyp" style="width: 100%" @click="edtypChange">
                  <el-option label="弹出框" value="modal" />
                  <el-option label="抽屉页" value="drawer" />
                  <el-option label="标签页" value="tab" />
                </el-select>
              </el-form-item>
<!--              <el-form-item label="每行列数：" prop="pecol" :rules="[{ required: true, message: '继承基类不能为空' }]" style="width: 50%">-->
<!--                <el-select v-model="form.pecol" style="width: 100%">-->
<!--                  <el-option label="1列" :value="1" />-->
<!--                  <el-option label="2列" :value="2" />-->
<!--                  <el-option label="4列" :value="4" v-show="form.edtyp === 'tab'" />-->
<!--                </el-select>-->
<!--              </el-form-item>-->
              <el-form-item label="排序字段：" style="width: 50%">
                <el-input v-model="form.orfie" />
              </el-form-item>
              <!--              <el-form-item label='排序号：' prop='ornum'>-->
              <!--                <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />-->
              <!--              </el-form-item>-->
              <el-form-item label="显示按钮：" prop="ornum" style="width: 100%">
                <el-checkbox v-model="form.addbt" label="新增" />
                <el-checkbox v-model="form.delbt" label="删除" />
                <el-checkbox v-model="form.impbt" label="导入" />
                <el-checkbox v-model="form.expbt" label="导出" />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="字段信息" name="tab2">
              <div style="margin-bottom: 10px">
                <el-button type="primary" @click.stop="addItem" plain>新 增</el-button>
                <el-button type="primary" @click="upItem" plain>上 移</el-button>
                <el-button type="primary" @click="downItem" plain>下 移</el-button>
                <el-button type="primary" @click="copyItem" plain>复 制</el-button>
                <el-button type="primary" @click="delsItem" plain>删 除</el-button>
                <el-dropdown style="margin-left: 10px; top: 1px">
                  <el-button type="primary" plain>更 多</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="test1">测试1</el-dropdown-item>
                      <el-dropdown-item command="test2">测试2</el-dropdown-item>
                      <el-dropdown-item command="test3">测试3</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>

              <el-table border :data="form.fields" :row-style="{ height: '36px' }" style="width: 100%" @selection-change="itemSelect">
                <el-table-column type="selection" width="46" header-align="center" align="center" />
                <el-table-column label="#" width="40" header-align="center" align="center">
                  <template #default="scope">
                    <span>{{ scope.row.ornum }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="字段名称" width="120">
                  <template #default="scope">
                    <el-input v-model="scope.row.name" required />
                  </template>
                </el-table-column>
                <el-table-column label="字段注释" width="160">
                  <template #default="scope">
                    <el-input v-model="scope.row.remark" required />
                  </template>
                </el-table-column>
                <el-table-column label="字段类型" width="140">
                  <template #default="scope">
                    <el-select v-model="scope.row.type" placeholder="请选择" style="width: 100%">
                      <el-option value="string" label="string" />
                      <el-option value="int" label="int" />
                      <el-option value="long" label="long" />
                      <el-option value="date" label="date" />
                      <el-option value="bool" label="bool" />
                      <el-option value="decimal" label="decimal" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="字段长度" width="88">
                  <template #default="scope">
                    <el-input v-show="scope.row.type === 'string'" v-model.number="scope.row.length" controls-position="right" />
                  </template>
                </el-table-column>
                <el-table-column label="备注">
                  <template #default="scope">
                    <el-input v-model="scope.row.notes" required />
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="50" align="center">
                  <template #header>
                    <el-icon :size="22" style="top: 5px; cursor: pointer" color="#666">
                      <CirclePlus @click="addItem" />
                    </el-icon>
                  </template>
                  <template #default="scope">
                    <el-icon :size="22" style="top: 3px; cursor: pointer">
                      <CircleClose @click="delItem(scope.$index)" />
                    </el-icon>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="其他信息" name="tab9">
              <el-form-item label="备注：" style="width: 100%">
                <el-input type="textarea" :rows="4" v-model="form.notes" />
              </el-form-item>
              <el-form-item label="创建人：" style="width: 25%">
                {{ form.cruna }}
              </el-form-item>
              <el-form-item label="创建时间：" style="width: 25%">
                {{ form.crtim }}
              </el-form-item>
              <el-form-item label="更新人：" style="width: 25%">
                {{ form.upuna }}
              </el-form-item>
              <el-form-item label="更新时间：" style="width: 25%">
                {{ form.uptim }}
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </el-card>
  </Page>
</template>
