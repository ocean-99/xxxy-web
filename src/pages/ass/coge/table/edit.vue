<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
      <el-row>
        <el-col :span='10'>
          <div style='line-height: 32px'>代码生成配置</div>
        </el-col>
        <el-col :span='14' style='text-align: right'>
          <el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
          <el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
        </el-col>
      </el-row>
    </template>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref="formRef" :inline="true" class='yform' :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1'>
            <div class="yform-div">
              <el-form-item label='表名称：' style="width: 25%" prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
                <el-input v-model='form.name'></el-input>
              </el-form-item>
              <el-form-item label='表描述：' style="width: 25%">
                <el-input v-model='form.remark'></el-input>
              </el-form-item>
              <el-form-item label='业务名：' style="width: 50%">
                <el-input v-model='form.bunam'></el-input>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label='字段信息' name='tab2'>
            <el-table border :data='form.fields' :row-style="{height: '36px'}" style='width: 100%'>
              <el-table-column label='排序号' width='90'>
                <template #default='scope'>
                  <el-input-number v-model='scope.row.ornum' controls-position='right' style='width: 100%'/>
                </template>
              </el-table-column>
              <el-table-column label='字段名称' width='120'>
                <template #default='scope'>
                  <el-input v-model='scope.row.name' required></el-input>
                </template>
              </el-table-column>
              <el-table-column label='字段注释' width='160'>
                <template #default='scope'>
                  <el-input v-model='scope.row.remark' required></el-input>
                </template>
              </el-table-column>
              <el-table-column label='字段类型' width='160'>
                <template #default='scope'>
                  <el-select v-model='scope.row.type' placeholder='请选择' style='width: 100%'>
                    <el-option :value="'string'" :label="'string'"></el-option>
                    <el-option :value="'int'" :label="'int'"></el-option>
                    <el-option :value="'long'" :label="'long'"></el-option>
                    <el-option :value="'date'" :label="'date'"></el-option>
                    <el-option :value="'bool'" :label="'bool'"></el-option>
                    <el-option :value="'decimal'" :label="'decimal'"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label='字段长度' width='90'>
                <template #default='scope'>
                  <el-input v-model='scope.row.length' controls-position='right'/>
                </template>
              </el-table-column>
              <el-table-column label='备注'>
                <template #default='scope'>
                  <el-input v-model='scope.row.notes' required></el-input>
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
                    <ele-CircleClose @click='form.fields.splice(scope.$index, 1)'/>
                  </el-icon>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label='其他信息' name='tab9'>
            <div class="yform-div">
              <el-form-item label='备注：' style="width: 100%">
                <el-input type='textarea' :rows='4' v-model='form.notes'/>
              </el-form-item>
              <el-form-item label='创建人：' style="width: 25%">
                {{ form.crman ? form.crman.name : '' }}
              </el-form-item>
              <el-form-item label='创建时间：' style="width: 25%">
                <div class='zinput'> {{ form.crtim }}</div>
              </el-form-item>
              <el-form-item label='更新人：' style="width: 25%">
                {{ form.upman ? form.upman.name : '' }}
              </el-form-item>
              <el-form-item label='更新时间：' style="width: 25%">
                <div class='zinput'> {{ form.uptim }}</div>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </el-card>
</template>
<script lang='ts'>
export default {name: 'AssCogeMainEdit'};
</script>
<script lang='ts' setup>
import {getCurrentInstance, onMounted, reactive, ref, toRefs} from 'vue';
import {editInit, tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import {uuid} from '/@/utils/xutil';

const formRef = ref();
const route = useRoute();
const {proxy} = getCurrentInstance() as any;

const state = reactive({
  url: '/ass/coge/table',
  params: {path: '', query: ''},
  form: {avtag: true, fields: []} as any,
});

const {form} = toRefs(state);
const activeName = ref('tab1');

onMounted(async () => {
  await editInit({state, route});
});


// 屏幕弹框逻辑
const addItem = () => {
  if (form.value.id) {
    form.value.fields.push({
      id: uuid(), parid: form.value.id
    })
  } else {
    form.value.fields.push({
      id: uuid(),
    })
  }
};
//endregiton

</script>

