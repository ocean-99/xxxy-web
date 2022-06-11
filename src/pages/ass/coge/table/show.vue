<template>
  <el-dialog v-if="state.show" v-model='state.show' title='代码预览' draggable width='90%'>
    <el-tabs v-model='activeName' >
      <el-tab-pane v-for='code in codes' :key='code.id' :label='code.title' :name='code.title'>
        <div v-if="activeName==code.title">
          <CodeMirror
              v-model:value="code.content"
              :options="state.cmOptions"
              border
              placeholder="test placeholder"
              height="500px"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang='ts' setup>
import {defineExpose, reactive, ref, toRefs} from 'vue';
// import CodeMirror from 'codemirror';
import CodeMirror from "codemirror-editor-vue3";

import 'codemirror/lib/codemirror.css'; // 引入css文件
// import 'codemirror/theme/idea.css';
import 'codemirror/theme/darcula.css';
// import 'codemirror/mode/javascript/javascript.js'; // 引入语言模式 可以从 codemirror/mode/ 下引入多个
import 'codemirror/mode/clike/clike.js'; // 引入语言模式 可以从 codemirror/mode/ 下引入多个

//https://renncheung.github.io/codemirror-editor-vue3/instructions/props.html

const activeName = ref('Entity.cs');
const state = reactive({
  cmShow:true,
  show: false,
  codes: [] as any,
  cmOptions: {
    readOnly: true,
    // mode: 'text/x-nginx-conf', // Language mode
    // mode: 'javascript', // Language mode
    // mode: 'text/x-csharp', // Language mode
    mode: 'text/x-java', // Language mode
    // theme: 'darcula', // Theme
    lineNumbers: true, // Show line number
    smartIndent: true, // Smart indent
    indentUnit: 4, // The smart indent unit is 2 spaces in length
    foldGutter: true, // Code folding
    matchBrackets: true,
    autoCloseBrackets: true,
    styleActiveLine: true, // Display the style of the selected row
  }
});
const {codes} = toRefs(state);


const openModal = async (data: any) => {
  codes.value = data;
  activeName.value = data[0].title;
  state.show = true;

};



defineExpose({openModal});

</script>
<style scoped>


</style>
