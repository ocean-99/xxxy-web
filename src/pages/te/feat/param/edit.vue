<template>

  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
      <el-row>
        <el-col :span='10'>
          <div style='line-height: 32px'>参数配置</div>
        </el-col>
        <el-col :span='14' style='text-align: right'>
          <el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
          <el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
        </el-col>
      </el-row>
    </template>
    <CateModal url='oa/flow/cate/tree' ref='cateModal' @close='cateChoose'/>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref="formRef" class='zform' :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1'>
            <el-row style='border-top: 1px solid #d2d2d2;'>
              <el-col :span='12'>
                <el-form-item label='参数代码：' prop='code' :rules="[{ required: true, message: '代码不能为空'}]">
                  <div class='zinput'>
                    <el-input v-model='form.code' :disabled='form.crtim'></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='参数名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
                  <div class='zinput'>
                    <el-input v-model='form.name'></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='12'>
                <el-form-item label='所属屏幕：' prop='scrid' :rules="[{ required: true, message: '屏幕不能为空'}]">
                  <div class='zinput'>
                    <el-input v-model='form.scrna' readonly :suffix-icon='Search' @click='openScreenModal'></el-input>
                    <ScreenModal url='te/feat/screen/tree' ref='screenModal' @close='screenChoose'/>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='6'>
                <el-form-item label='排序号：'>
                  <div class='zinput'>
                    <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='6'>
                <el-form-item label='是否可用：'>
                  <div class='zinput'>
                    <el-switch v-model='form.avtag'>
                    </el-switch>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='6'>
                <el-form-item label='显示模式：'>
                  <div class='zinput'>
                    <el-select v-model='form.shmod' placeholder='请选择' style='width: 100%'>
                      <el-option :value="'input'" :label="'A1 普通输入框'"></el-option>
                      <el-option :value="'select'" :label="'B1 普通下拉框'"></el-option>
                      <el-option :value="'select2'" :label="'B2 可输入下拉框'"></el-option>
                      <el-option :value="'textarea'" :label="'C1 多行输入框'"></el-option>
                      <el-option :value="'list'" :label="'D1 明细表'"></el-option>
                      <el-option :value="'switch'" :label="'E1 开关（有，无）'"></el-option>
                      <el-option :value="'fuhe'" :label="'复合参数'"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='6'>
                <el-form-item label='是否只读：'>
                  <div class='zinput'>
                    <el-switch v-model='form.rotag'>
                    </el-switch>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='6'>
                <el-form-item label='是否为土建参数：'>
                  <div class='zinput'>
                    <el-switch v-model='form.drtag'>
                    </el-switch>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='6'>
                <el-form-item label='是否为询价参数：'>
                  <div class='zinput'>
                    <el-switch v-model='form.qutag'>
                    </el-switch>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <div class='znotes'>
              1.参数与选项（及联动、校验）删除时需要校验是否有产品版本关联，如果有关联则不允许删除<br>
              2.对于一些复杂的参数，如楼层明细，可做硬编码做成vue组件，参数这里保留引用<br>
              3.对于一些常用的，或者型号无关的联动，可将联动代码写在参数或者选项本身上<br>
            </div>
          </el-tab-pane>
          <el-tab-pane label='选项信息' name='tab2'>


            <el-table border :data='form.options' :row-style="{height: '36px'}" style='width: 100%'>
              <el-table-column type='expand'>
                <template #default='props'>
                  <el-row :gutter='10' style='background-color: white;border: 0;margin-left: 4px;margin-right: 4px'>
                    <el-col :span='12'>
                      <el-input style="font-family: 'Courier New', sans-serif; font-size:16px"
                                type='textarea' :rows='10' placeholder='显示隐藏控制函数'
                                v-model='props.row.func1'>
                      </el-input>
                    </el-col>
                    <el-col :span='12'>
                      <el-input style="font-family: 'Courier New', sans-serif; font-size:16px"
                                type='textarea' :rows='10' placeholder='选项选择后的触发函数'
                                v-model='props.row.func2'>
                      </el-input>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>

              <el-table-column label='排序号' width='110'>
                <template #default='scope'>
                  <el-input-number v-model='scope.row.ornum' controls-position='right' style='width: 100%'/>
                </template>
              </el-table-column>
              <el-table-column label='选项代码' width='180'>
                <template #default='scope'>
                  <el-input v-model='scope.row.code' required></el-input>
                </template>
              </el-table-column>
              <el-table-column label='选项名称' width='180'>
                <template #default='scope'>
                  <el-input v-model='scope.row.name' required></el-input>
                </template>
              </el-table-column>
              <el-table-column label='选项备注'>
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
                    <ele-CircleClose @click='form.options.splice(scope.$index, 1)'/>
                  </el-icon>
                </template>
              </el-table-column>


              <!--							<el-table-column label="Name" width="180">-->
              <!--								<template #default="scope">-->
              <!--									<el-popover effect="light" trigger="hover" placement="top" width="auto">-->
              <!--										<template #default>-->
              <!--											<div>name: {{ scope.row.name }}</div>-->
              <!--											<div>address: {{ scope.row.id }}</div>-->
              <!--										</template>-->
              <!--										<template #reference>-->
              <!--											<el-tag>{{ scope.row.name }}</el-tag>-->
              <!--										</template>-->
              <!--									</el-popover>-->
              <!--								</template>-->
              <!--							</el-table-column>-->
            </el-table>


          </el-tab-pane>
          <el-tab-pane label='其他信息' name='tab9'>
            <el-row style='border-top: 1px solid #d2d2d2;'>
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
        </el-tabs>
      </el-form>
    </div>
  </el-card>
</template>
<script lang='ts'>
export default {name: 'teFeatParamEdit'};
</script>
<script lang='ts' setup>
import {Search} from '@element-plus/icons-vue';
import {getCurrentInstance, onMounted, reactive, ref, toRefs} from 'vue';
import {editInit, tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import ScreenModal from '/@/comps/gen/GenModal.vue';
import {uuid} from '/@/utils/xutil';

const formRef = ref();
const route = useRoute();
const {proxy} = getCurrentInstance() as any;

const state = reactive({
  url: '/te/feat/param',
  params: {path: '', query: ''},
  form: {avtag: true, options: []} as any,
});

const {form} = toRefs(state);
const activeName = ref('tab1');

onMounted(async () => {
  await editInit({state, route});
});


// 屏幕弹框逻辑
const screenModal = ref();
const openScreenModal = () => {
  screenModal.value.openModal();
};
const screenChoose = (node: any) => {
  form.value.scrid = node.id;
  form.value.scrna = node.name;
};

//region -----可选项-----


const addItem = () => {
  if (form.value.id) {
    form.value.options.push({
      id: uuid(), parid: form.value.id
    })
  } else {
    form.value.options.push({
      id: uuid(),
    })
  }
};


//endregiton


</script>

<style scoped>

</style>
