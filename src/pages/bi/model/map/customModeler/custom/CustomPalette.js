/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
export default function PaletteProvider(palette, create, elementFactory,handTool,lassoTool,
                                        spaceTool, globalConnect, bpmnFactory) {
    this.create = create
    this.elementFactory = elementFactory
    this.handTool = handTool;
    this.lassoTool = lassoTool;
    this.spaceTool = spaceTool;
    this.globalConnect = globalConnect
    this.bpmnFactory = bpmnFactory
    palette.registerProvider(this)
}

PaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    "handTool",
    "lassoTool",
    "spaceTool",
    'globalConnect',
    'bpmnFactory'
]

PaletteProvider.prototype.getPaletteEntries = function(element) {
    const {
        create,
        elementFactory,
        bpmnFactory,
        handTool,
        lassoTool,
        spaceTool,
        globalConnect,
    } = this;

    function createTask() {
        return function(event) {
            const businessObject = bpmnFactory.create('bpmn:Task', { custom: 2 });
            // businessObject['custom'] = 1 // 这样不行
            const shape = elementFactory.createShape({
                type: 'bpmn:Task',
                businessObject
            });
            const label = elementFactory.createLabel();
            console.log(shape) // 只在拖动或者点击时触发
            console.log(label) // 只在拖动或者点击时触发
            create.start(event, shape);
            // create.start(event, label);
        }
    }

    function createStratEvent() {
        return function(event) {
            const shape = elementFactory.createShape({
                type: 'bpmn:StartEvent'
            });
            create.start(event, shape);
        }
    }

    function createGateway() {
        return function(event) {
            const shape = elementFactory.createShape({
                type: 'bpmn:ExclusiveGateway'
            });
            create.start(event, shape);
        }
    }

    return {
        "hand-tool": {
            group: "tools",
            className: "bpmn-icon-hand-tool",
            title: "Activate the hand tool",
            action: {
                click: function (event) {
                    handTool.activateHand(event);
                }
            }
        },
        "lasso-tool": {
            group: "tools",
            className: "bpmn-icon-lasso-tool",
            title: "Activate the lasso tool",
            action: {
                click: function (event) {
                    lassoTool.activateSelection(event);
                }
            }
        },
        "space-tool": {
            group: "tools",
            className: "bpmn-icon-space-tool",
            title: "fadf",
            action: {
                click: function (event) {
                    spaceTool.activateSelection(event);
                }
            }
        },
        "global-connect-tool": {
            group: "tools",
            className: "bpmn-icon-connection-multi",
            title: "Activate the connection tool",
            action: {
                click: function (event) {
                    globalConnect.toggle(event);
                }
            }
        },
        "tool-separator": {//工具分割线
            group: 'tools',
            separator: true
        },
        'create.lindaidai-task': {
            group: 'model',
            className: 'icon-custom lindaidai-task',
            title: '创建一个类型为lindaidai-task的任务节点',
            action: {
                dragstart: createTask(),
                click: createTask()
            }
        },
        'create.exclusive-gateway': {
            group: 'gateway',
            className: 'bpmn-icon-gateway-none',
            title: '创建一个网关',
            action: {
                dragstart: createGateway(),
                click: createGateway()
            }
        }
    }
}
