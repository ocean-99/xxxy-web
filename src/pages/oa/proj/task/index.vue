<template>
  <Wrap>
    <div class='p-left'>
      <TlistTree @node-click='nodeClick'/>
    </div>
    <div class='p-right'>
      <el-card class='box-card' body-style="padding-top:0">
        <vxe-toolbar ref="xToolbar" export refresh custom>
          <template #buttons>
            <vxe-input v-model="taskTable.filterName" placeholder="请输入名称" @keyup="searchEvent"></vxe-input>
            <vxe-button status="primary">查 询</vxe-button>
            <vxe-button @click="add()">新 增</vxe-button>
            <vxe-button @click="$refs.xTable.setAllTreeExpand(true)">展 开</vxe-button>
            <vxe-button @click="$refs.xTable.clearTreeExpand()">折 叠</vxe-button>
          </template>
          <template #tools>
            <button style="margin-right: 10px" @click="importEvent" class="vxe-button type--button size--small is--circle" type="button" title="导入">
              <i class="vxe-button--icon vxe-icon--upload"></i>
            </button>
          </template>
        </vxe-toolbar>

        <vxe-table
            resizable
            show-overflow
            ref="xTable"
            :height="state.tableHeight"
            :export-config="exportConfig"
            :tree-config="{transform: true, rowField: 'id', parentField: 'pid'}"
            :edit-config="{trigger: 'click', mode: 'row'}"
            :checkbox-config="{labelField: 'id'}"
            :data="taskTable.tableData">
          <vxe-column width="35">
            <template #default>
              <span class="drag-btn" style="text-align: center">
                <i class="vxe-icon--menu"></i>
              </span>
            </template>
            <!--          <template #header>-->
            <!--            <vxe-tooltip v-model="taskTable.showHelpTip" content="按住后可以上下拖动排序！" enterable>-->
            <!--              <i class="vxe-icon&#45;&#45;question" @click="taskTable.showHelpTip = !taskTable.showHelpTip"></i>-->
            <!--            </vxe-tooltip>-->
            <!--          </template>-->
          </vxe-column>
          <vxe-column field="name" tree-node title="任务名称" :edit-render="{}" width="500">
            <template #edit="{ row }">
              <vxe-input v-model="row.name" type="text"></vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="prman" title="负责人" :edit-render="{}" width="80">
            <template #edit="{ row }">
              <vxe-input v-model="row.prman" type="text"></vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="crtim" title="创建时间" width="90">
            <template #edit="{ row }">
              <vxe-input v-model="row.crtim" type="date"></vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="sttim" title="开始时间" width="90">
            <template #edit="{ row }">
              <vxe-input v-model="row.sttim" type="date"></vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="cltim" title="截止时间" width="90">
            <template #edit="{ row }">
              <vxe-input v-model="row.cltim" type="date" ></vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="fitim" title="完成时间" width="90">
            <template #edit="{ row }">
              <vxe-input v-model="row.fitim" type="date" ></vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="state" title="当前状态" width="76">
            <template #edit="{ row }">
              <vxe-input v-model="row.state"></vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="grade" title="优先级" width="66">
            <template #edit="{ row }">
              <vxe-input v-model="row.grade"></vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="notes" title="备注" :edit-render="{}">
            <template #edit="{ row }">
              <vxe-input v-model="row.notes" transfer></vxe-input>
            </template>
          </vxe-column>

          <vxe-column title="操作" width="100" show-overflow header-align="center" align="right">
            <template #default="{ row }">
              <el-icon @click="insertRow(row, 'bottom')" style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #52C41A">
                <circle-plus/>
              </el-icon>
              <el-icon @click="drawer.open({id:row.id})" style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #2874C5">
                <edit/>
              </el-icon>
              <el-icon @click="removeEvent(row)" style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #ED6F6F">
                <delete/>
              </el-icon>
            </template>
          </vxe-column>
        </vxe-table>


      </el-card>
      <DrawerEdit ref='drawer' @afterEdit='vxeQuery(gridRef)'/>
    </div>
  </Wrap>
</template>
<script lang='ts' setup>
import {Operation, Search, Plus, Delete, ArrowDown, ArrowUp,Edit, CirclePlus} from '@element-plus/icons-vue';
import {nextTick, onMounted,onUnmounted, reactive, ref} from 'vue';
import {listDelete, tabAdd} from '/@/comps/page';
import {vxeInit, vxeQuery} from '/@/comps/vxe';
import Wrap from '/@/comps/page/Wrap.vue';
import TlistTree from '../tlist/tree.vue';
import {VxeGridProps, VXETable,VxeTableInstance, VxeToolbarInstance} from 'vxe-table';
import {useRoute} from 'vue-router';
import DrawerEdit from './edit.vue';
import {ElMessage} from "element-plus";
import XEUtils from "xe-utils";
import Sortable from "sortablejs";
import request from "/@/utils/request";

const route = useRoute();

const state = reactive({
  url: '/oa/proj/task', loading: true, ids: [], moreParams: false,tableHeight:600,
  form: {} as any, single: true, multiple: true, list: [], total: 0,
});

const drawer = ref();

const xTable = ref({} as VxeTableInstance);
const xToolbar = ref({} as VxeToolbarInstance);

let initTime: any;
nextTick(() => {
  // 加载完成之后在绑定拖动事件
  initTime = setTimeout(() => {
    rowDrop();
  }, 500);

});

onMounted(() => {
  state.form.proid = route.query?.proid;
  const $table = xTable.value;
  const $toolbar = xToolbar.value;
  $table.connect($toolbar);
  state.tableHeight=window.innerHeight-156;
  // listQuery(state);
});

onUnmounted(() => {
  clearTimeout(initTime);
  if (sortable1) {
    sortable1.destroy();
  }
});


//region a 左侧部门树点击
const nodeClick = async (node: any) => {
  if (node) {
    state.form.tliid = node.id;
    // state.form.grona = node.name;
    state.form.proid = node.proid;
    taskTable.tableData= await request({
      url: '/oa/proj/task/list',
      params:{proid:state.form.proid,tliid:state.form.tliid},
      method: 'get',
    });
  }
};
//endregion

const add = () => {
  if (state.form.tliid) {
    drawer.value.open({tliid: state.form.tliid})
  } else {
    ElMessage.warning("请先选择任务清单后再创建任务");
  }
}

let sortable1: any;
const rowDrop = () => {
  const $table = xTable.value;
  sortable1 = Sortable.create($table.$el.querySelector(".body--wrapper>.vxe-table--body tbody"), {
    handle: ".drag-btn",
    onEnd: (sortableEvent) => {
      const newIndex = sortableEvent.newIndex as number;
      const oldIndex = sortableEvent.oldIndex as number;
      const currRow = taskTable.tableData.splice(oldIndex, 1)[0];
      taskTable.tableData.splice(newIndex, 0, currRow);
    }
  });
};

const taskTable = reactive({
  filterName: "",
  tableData: [] as any,
  originData: [] as any[],
  tableTreeConfig: {
    transform: true,
    children: "children",
    rowKey: "id",
    indent: 15,
    parentKey: "pid",
    iconOpen: "vxe-icon--arrow-bottom",
    iconClose: "vxe-icon--arrow-right"
  }
});



const insertRow = async (currRow: any, locat: string) => {
  const $table = xTable.value
  // 如果 null 则插入到目标节点顶部
  // 如果 -1 则插入到目标节点底部
  // 如果 row 则有插入到效的目标节点该行的位置
  if (locat === 'current') {
    const record = {
      name: '新数据',
      id: Date.now(),
      pid: currRow.pid, // 父节点必须与当前行一致
      date: XEUtils.toDateString(new Date(), 'yyyy-MM-dd')
    }
    const { row: newRow } = await $table.insertAt(record, currRow)
    await $table.setActiveRow(newRow) // 插入子节点
  } else if (locat === 'top') {
    const record = {
      name: '新数据',
      id: Date.now(),
      pid: currRow.id, // 需要指定父节点，自动插入该节点中
      date: XEUtils.toDateString(new Date(), 'yyyy-MM-dd')
    }
    const { row: newRow } = await $table.insert(record)
    await $table.setTreeExpand(currRow, true) // 将父节点展开
    await $table.setActiveRow(newRow) // 插入子节点
  } else if (locat === 'bottom') {
    const record = {
      name: '新数据',
      id: Date.now(),
      tliid: state.form.tliid,
      pid: currRow.id, // 需要指定父节点，自动插入该节点中
      date: XEUtils.toDateString(new Date(), 'yyyy-MM-dd')
    }
    const { row: newRow } = await $table.insertAt(record, -1)
    await $table.setTreeExpand(currRow, true) // 将父节点展开
    // await $table.setActiveRow(newRow) // 插入子节点
    await $table.setActiveCell(newRow, 'name')
  }
}


const removeEvent = async (row: any) => {
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const $table = xTable.value
    await $table.remove(row)
  }
}



</script>

<style scoped>

</style>
