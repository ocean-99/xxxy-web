<script lang="ts" setup>
import { requestClient } from '#/api/request';
import CateTree from '#/components/tree/ViewTree.vue';

const emits = defineEmits(['close']);
let p_tab_key = 'k1';
let p_select_mode = 1; // 1单选，2多选
let p_opener = null as any; // 弹框打开者标记
let p_cate_init_flag = false; // 层级架构页签初始化标记

const cateTreeRef = ref();

const state = reactive({
  show: false,
  receSearch: '' as string,
  receItems: [] as any,
  tierItems: [] as any,
  seldItems: [] as any,
});

const { receItems, tierItems, seldItems } = toRefs(state);

const activeName = ref('k1');

// region z Tab切换
async function tabChange(tab: any) {
  p_tab_key = tab.paneName;
  switch (p_tab_key) {
    case 'k1': {
      for (const rItem of receItems.value) {
        let flag = false;
        for (const sItem of seldItems.value) {
          if (sItem.id === rItem.id) {
            rItem.checked = true;
            flag = true;
            break;
          }
        }
        if (!flag) {
          rItem.checked = false;
        }
      }
      break;
    }
    case 'k2': {
      if (!p_cate_init_flag) {
        await cateTreeRef.value.init();
        p_cate_init_flag = true;
      }
      for (const tItem of tierItems.value) {
        let flag = false;
        for (const sItem of seldItems.value) {
          if (sItem.id === tItem.id) {
            tItem.checked = true;
            flag = true;
            break;
          }
        }
        if (!flag) {
          tItem.checked = false;
        }
      }
      break;
    }
    // No default
  }
}

// endregion

// region x.1 最近使用

async function onSearch() {
  receItems.value = await requestClient.get(`/gen/org/main?name=${state.receSearch}`);
  for (const rItem of receItems.value) {
    let flag = false;
    for (const sItem of seldItems.value) {
      if (sItem.id === rItem.id) {
        rItem.checked = true;
        flag = true;
        break;
      }
    }
    if (!flag) {
      rItem.checked = false;
    }
  }
}

const receInit = async () => {
  receItems.value = await requestClient.get(`/gen/org/rece`);
};

function receItemClick(item: any) {
  item.checked = !item.checked;
  if (p_select_mode === 1) {
    // 单选
    if (seldItems.value.length > 0) {
      seldItems.value.splice(0, 1);
    }
    seldItems.value.push(item);
    for (let i = 0; i < receItems.value.length; i++) {
      if (receItems.value[i].id !== item.id) {
        receItems.value[i].checked = false;
      }
    }
    // closeOrgModal();改成不自动关
  } else {
    // 多选
    if (item.checked) {
      let flag = false;
      for (const sItem of seldItems.value) {
        if (sItem.id === item.id) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        seldItems.value.push(item);
      }
    } else {
      for (let i = 0; i < seldItems.value.length; i++) {
        if (seldItems.value[i].id === item.id) {
          seldItems.value.splice(i, 1);
          break;
        }
      }
    }
  }
}

// endregion

// region x.2 分类查询

async function nodeClick(node: any) {
  if (node && node.id) {
    const res = await requestClient.get(`/wf/bus/tmpl/list?cateId=${node.id}`);
    tierItems.value = res.rows;
    for (const tItem of tierItems.value) {
      for (const sItem of seldItems.value) {
        if (sItem.id === tItem.id) {
          tItem.checked = true;
          break;
        }
      }
    }
  }
}

function tierItemClick(item: any) {
  item.checked = !item.checked;
  if (p_select_mode === 1) {
    // 单选
    if (seldItems.value.length > 0) {
      seldItems.value.splice(0, 1);
    }
    seldItems.value.push(item);
    for (let i = 0; i < tierItems.value.length; i++) {
      if (tierItems.value[i].id !== item.id) {
        tierItems.value[i].checked = false;
      }
    }
    // closeOrgModal();改成不自动关
  } else {
    // 多选
    if (item.checked) {
      let flag = false;
      for (const sItem of seldItems.value) {
        if (sItem.id === item.id) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        seldItems.value.push(item);
      }
    } else {
      for (let i = 0; i < seldItems.value.length; i++) {
        if (seldItems.value[i].id === item.id) {
          seldItems.value.splice(i, 1);
          break;
        }
      }
    }
  }
}

// endregion

// region x.6 我的收藏

// endregion

// region c.1 已选逻辑
function selectedItemClick(item: any) {
  if (p_tab_key === 'k1') {
    for (let i = 0; i < receItems.value.length; i++) {
      if (receItems.value[i].id === item.id) {
        receItems.value[i].checked = false;
        break;
      }
    }
  } else if (p_tab_key === 'k2') {
    for (let i = 0; i < tierItems.value.length; i++) {
      if (tierItems.value[i].id === item.id) {
        tierItems.value[i].checked = false;
        break;
      }
    }
  }
  for (let j = 0; j < seldItems.value.length; j++) {
    if (seldItems.value[j].id === item.id) {
      seldItems.value.splice(j, 1);
      break;
    }
  }
}

// endregion

// region 与父组件的交互逻辑
const openModal = async (data: any) => {
  if (!data.selectMode) {
    data.selectMode = 1;
  }
  p_select_mode = data.selectMode;
  p_opener = data.opener;
  // 1.初始化
  seldItems.value = data.orgs ? data.orgs : [];
  // //2.设置最近使用与层级架构里item的check状态
  if (p_tab_key === 'k1') {
    for (const rItem of receItems.value) {
      for (const sItem of seldItems.value) {
        let flag = false;
        if (sItem.id === rItem.id) {
          rItem.checked = true;
          flag = true;
          break;
        }
        if (!flag) {
          rItem.checked = false;
        }
      }
    }
  } else if (p_tab_key === 'k2') {
    for (const tItem of tierItems.value) {
      for (const sItem of seldItems.value) {
        let flag = false;
        if (sItem.id === tItem.id) {
          tItem.checked = true;
          flag = true;
          break;
        }
        if (!flag) {
          tItem.checked = false;
        }
      }
    }
  }
  state.show = true;
};

defineExpose({ openModal });

const closeModal = async () => {
  const rawSeldItems = toRaw(seldItems.value);
  if (rawSeldItems && rawSeldItems.length > 0) {
    // 更新后台数据库最近使用的ORGS
    await requestClient.post('/gen/org/rece', rawSeldItems);
  }
  emits('close', { opener: p_opener, orgs: toRaw(rawSeldItems) });
  state.show = false;
};

const clearAndcloseModal = () => {
  emits('close', { opener: p_opener, orgs: null });
  state.show = false;
};
// endregion
</script>

<template>
  <el-dialog v-model="state.show" title="流程模板选择" width="1000px" draggable>
    <div style="height: 440px">
      <el-row>
        <el-col :span="16">
          <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
            <el-tab-pane label="快捷选择" name="k1">
              <div>
                <el-input v-model="state.receSearch" placeholder="请输入关键字查询" style="width: 200px" @keyup.enter="onSearch" />
                <el-button type="primary" style="margin-left: 10px" @click="onSearch">查询 </el-button>
              </div>
              <div style="margin-top: 5px; overflow: auto; height: 353px; border: 1px solid #ccc">
                <ul class="z-org-search" id="zOrgSearch" style="padding: 2px">
                  <li v-for="item in receItems" :key="item.id" class="f-user" @click="receItemClick(item)">
                    <el-checkbox v-model="item.checked" />
                    <span class="layui-elip f-user-name">{{ item.name }}</span>
                    <span class="layui-elip f-user-dept">{{ item.dept }}</span>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
            <el-tab-pane label="按分类查询" name="k2">
              <el-row>
                <el-col :span="12">
                  <div style="height: 390px">
                    <CateTree @node-click="nodeClick" url="/wf/bus/cate" ref="cateTreeRef" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <div style="border: 1px solid #ccc; height: 390px; margin-left: 5px; overflow: auto">
                    <ul class="z-org-tree">
                      <li v-for="item in tierItems" :key="item.id" class="f-user" title=" " @click="tierItemClick(item)">
                        <el-checkbox v-model="item.checked" />
                        <span>{{ item.name }}</span>
                      </li>
                    </ul>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="我的收藏" name="k9">这个也暂不支持，待开发</el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="8">
          <div style="margin-left: 5px">
            <div style="height: 36px">
              <div style="margin-top: 20px">已 选</div>
            </div>
            <div style="border: 1px solid #ccc; height: 390px; overflow: auto">
              <ul class="z-org-selected" style="position: relative">
                <li v-for="item in seldItems" :key="item.id" class="f-user" style="overflow: hidden">
                  <el-icon @click="selectedItemClick(item)">
                    <CircleClose />
                  </el-icon>
                  <span class="layui-elip f-user-name2">{{ item.name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="closeModal">确认</el-button>
        <el-button @click="state.show = false">取消</el-button>
        <el-button @click="clearAndcloseModal" style="margin-left: 20px">清空选择</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.layui-elip {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.f-user:before,
.f-user:after {
  content: ' ';
  display: table;
}

.f-user:after {
  clear: both;
}

.f-user input,
.f-user label {
  float: left;
  margin-top: 10px;
  margin-right: 8px;
}

.f-user img {
  width: 50px;
  height: 50px;
  float: left;
  border-radius: 100%;
  margin-right: 8px;
}

.f-user .f-user-name,
.f-user .f-user-dept {
  display: block;
}

.f-user .f-user-name {
  margin-top: 6px;
}

.f-user .f-user-dept {
  color: #a599b2;
}

/*最近*/
/*.z-org-recently li {*/
/*	width: 33%;*/
/*	float: left;*/
/*	cursor: pointer;*/
/*	padding: 5px;*/
/*	list-style-type: none;*/
/*}*/

/*.z-org-recently li:hover {*/
/*	background-color: #f7efec;*/
/*}*/

/*搜索查询*/
.z-org-search li {
  /*width: 280px;*/
  width: 50%;
  float: left;
  cursor: pointer;
  padding: 2px;
  list-style-type: none;
  /*margin: 3px;*/
}

.z-org-search li:hover {
  background-color: #f7efec;
}

.dark .z-org-search li:hover {
  background-color: #1f1f1f;
}

/*!*组织架构树*!*/
.z-org-tree li {
  margin: 3px;
  cursor: pointer;
  padding: 3px;
  list-style-type: none;
}

.z-org-tree li:hover {
  background-color: #f7efec;
}

.dark .z-org-tree li:hover {
  background-color: #1f1f1f;
}

/*已选的*/
.z-org-selected li {
  margin: 3px;
  cursor: pointer;
  padding: 3px;
  list-style-type: none;
}

.z-org-selected li:hover {
  background-color: #f7efec;
}

.dark .z-org-selected li:hover {
  background-color: #1f1f1f;
}

.z-org-selected .f-user .el-icon {
  /*float: left;*/
  /*position:relative;*/
  position: absolute;
  /*position:fixed;*/
  color: #f26b96;
  font-size: 20px;
  display: none;
  margin-left: 42px;
}

.z-org-selected li:hover .el-icon {
  display: inline;
}

.z-org-selected .f-user img {
  display: inline;
  /*float: none;*/
}

.z-org-selected .f-user-name2 {
  display: block;
  margin-top: 14px;
}
</style>
