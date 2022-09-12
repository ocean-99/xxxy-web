import type { App } from 'vue';
import 'xe-utils'
import VXETable from 'vxe-table'


VXETable.setup({
    size: 'small', // 全局尺寸 medium, small, mini
    // zIndex: 999, // 全局 zIndex 起始值，如果项目的的 z-index 样式值过大时就需要跟随设置更大，避免被遮挡
    // version: 0, // 版本号，对于某些带数据缓存的功能有用到，上升版本号可以用于重置数据
    table: {
      // showHeader: true,
      // keepSource: false,// 保持原始值的状态，被某些功能所依赖，比如编辑状态、还原数据等（开启后影响性能，具体取决于数据量）
      // animat: true,
      // delayHover: 250,
      showOverflow: true,//设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度）ellipsis（只显示省略号）,title（并且显示为原生 title）,tooltip（并且显示为 tooltip 提示）
      showHeaderOverflow: true,//设置表头所有内容过长时显示为省略号 ellipsis（只显示省略号）,title（并且显示为原生 title）,tooltip（并且显示为 tooltip 提示）
      // showFooterOverflow: null,
      // size: null,
      resizable: true,
      // autoResize: false,
      // stripe: false,
      border: true,
      // round: false,
      // emptyText: '暂无数据',
      // radioConfig: {
      //   trigger: 'default'
      // },
      checkboxConfig: {
        // strict: false,
        highlight: true,
        // range: true,//设置了没用
        reserve: true,
        // trigger: 'default'
      },
      sortConfig: {
        remote: true,//所有列是否使用服务端排序，如果设置为 true 则不会对数据进行处理
        trigger: 'cell',//触发方式（注：当多种功能重叠时，会同时触发）default（点击按钮触发）, cell（点击表头触发）
        // orders: ['asc', 'desc', null],
        // sortMethod: null
      },
      filterConfig: {
        // remote: true,//所有列是否使用服务端筛选，如果设置为 true 则不会对数据进行处理
        // filterMethod: null
      },
      // expandConfig: {
      //   trigger: 'default',
      //   showIcon: true
      // },
      // treeConfig: {
      //   children: 'children',
      //   hasChild: 'hasChild',
      //   indent: 20,
      //   showIcon: true
      // },
      // tooltipConfig: {
      //   theme: 'dark',
      //   enterable: false
      // },
      // menuConfig: {
      //   visibleMethod () {}
      // },
      rowId: 'id', // 行数据的唯一主键字段名 ，默认 _XID
      // editConfig: {
      //   mode: 'cell',
      //   showAsterisk: true
      // },
      // importConfig: {
      //   modes: ['insert', 'covering']
      // },
      // exportConfig: {
      //   modes: ['current', 'selected']
      // },
      // customConfig: {
      //  storage: false
      // },
      // scrollX: {
      //   gt: 60
      // },
      // scrollY: {
      //   gt: 100
      // }
    },
    grid: {
      // size: null,
      // zoomConfig: {
      //   escRestore: true
      // },
      // pagerConfig: {
      // perfect: false
      // },
      // toolbarConfig: {
      //   perfect: false
      // },
      proxyConfig: {
          seq: true,//存在 type=index 列时有效，是否代理动态序号（根据分页动态变化）
      //   autoLoad: true,
      //   message: true,
          props: {
          // list: null, // 用于列表，读取响应数据
            result: 'items', // 用于分页，读取响应数据
            total: 'total' // 用于分页，读取总条数
          },
      //   beforeItem: null,
      //   beforeColumn: null,
      //   beforeQuery: null,
      //   afterQuery: null,
      //   beforeDelete: null,
      //   afterDelete: null,
      //   beforeSave: null,
      //   afterSave: null
      }
    },
    pager: {
      // size: null,
      // autoHidden: false,
      // perfect: true,
      // pageSize: 20,
      // pagerCount: 1,
      //    pageSizes: [8, 10, 16, 20, 100, 500]
         pageSizes: [10, 20, 50, 100, 500,1000,5000]
      // layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
    },
    // form: {
    //   preventSubmit: false
    //   validConfig: {
    //     autoPos: true
    //   },
    //   size: null,
    //   colon: false,
    //   titleAsterisk: true
    // },
    // input: {
    //   size: null,
    //   transfer: false
    //   parseFormat: 'yyyy-MM-dd HH:mm:ss.SSS',
    //   labelFormat: '',
    //   valueFormat: '',
    //   startDay: 1,
    //   digits: 2,
    //   controls: true
    // },
    // textarea: {
    //   size: null
    //   autosize: {
    //     minRows: 1,
    //     maxRows: 10
    //   }
    // },
    // select: {
    //   size: null,
    //   transfer: false,
    //   multiCharOverflow: 8
    // },
    // toolbar: {
    //   size: null,
    //   import: {
    //     mode: 'covering'
    //   },
    //   export: {
    //     types: ['csv', 'html', 'xml', 'txt']
    //   },
    //   custom: {
    //     isFooter: true
    //   },
    //   buttons: [],
    //   tools: []
    // },
    // button: {
    //   size: null,
    //   transfer: false
    // },
    // radio: {
    //   size: null
    // },
    // checkbox: {
    //   size: null
    // },
    // switch: {
    //   size: null
    // },
    // modal: {
    //   // size: null,
    //   minWidth: 340,
    //   minHeight: 200,
    //   lockView: true,
    //   mask: true,
    //   duration: 3000,
    //   marginSize: 0,
    //   dblclickZoom: true,
    //   showTitleOverflow: true
    //   storage: false
    // },
    // list: {
    //   scrollY: {
    //     gt: 100
    //   }
    // }
})



export function setupVxe(app: App<Element>) {
    app.use(VXETable);

    // 给 vue 实例挂载内部对象，例如：
    // app.config.globalProperties.$XModal = VXETable.modal
    // app.config.globalProperties.$XPrint = VXETable.print
    // app.config.globalProperties.$XSaveFile = VXETable.saveFile
    // app.config.globalProperties.$XReadFile = VXETable.readFile

}

