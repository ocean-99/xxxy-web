/* eslint-disable no-unused-vars */
import inherits from 'inherits'

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import {
    isObject,
    assign,
    forEach
} from 'min-dash';
import {
    append as svgAppend,
    create as svgCreate,
    classes as svgClasses
} from 'tiny-svg'

import { customElements, customConfig, hasLabelElements } from '../../utils/util'
/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer(eventBus, styles, textRenderer) {
    BaseRenderer.call(this, eventBus, 2000)

    var computeStyle = styles.computeStyle

    function renderLabel(parentGfx, label, options) {

        options = assign({
            size: {
                width: 100
            }
        }, options);

        var text = textRenderer.createText(label || '', options);

        svgClasses(text).add('djs-label');

        svgAppend(parentGfx, text);

        return text;
    }

    this.drawCustomElements = function(parentNode, element) {
        // console.log(678)
        // console.log(parentNode)
        console.log(789)
        console.log(element)
        const type = element.type // 获取到类型
        if (type !== 'label') {
            if (type === 'bpmn:Task') { // or customConfig[type]
                console.log("重构")
                let data={};
                data.tabna = "sys_org [组织架构汇总表]";
                data.fields = [
                    {name:'id',comet:'主键'},
                    {name:'name',comet:'名称'}
                ];
                if(element.businessObject.$attrs.data){
                    data=JSON.parse(element.businessObject.$attrs.data)
                }

                const { url, attr } = customConfig[type];
                attr.height=44+data.fields.length*18.3;
                // const customIcon = svgCreate('image', {
                //     ...attr,
                //     href: url
                // })
                // let color = element.businessObject.color;
                // console.log(element.businessObject.di);
                // element.businessObject.di.set('bioc:stroke', "red")
                // const shape = this.bpmnRenderer.drawShape(parentNode, element);
                const myShape = svgCreate('rect',{
                    "width":attr.width,
                    "height":attr.height,
                    "fill":"transparent",
                    "stroke":"black",
                    "stroke-width":"1",
                })
                svgAppend(parentNode, myShape)

                const myLine = svgCreate('line',{
                    "x1":"0",
                    "y1":"1.5em",
                    "x2":attr.width,
                    "y2":"1.5em",
                    "stroke":"black",
                    "stroke-width":"1",
                })
                svgAppend(parentNode, myLine);

                const tableName = svgCreate('text', {
                    "font-size": "14",
                    "fill": "blue",
                    "x":attr.width/2,
                    "dy":"15",
                    "text-anchor":"middle",
                })
                // tableName.innerHTML="测试一下 [sys_org_dept]";
                tableName.innerHTML=data.tabna;
                svgAppend(parentNode, tableName);

                const customDiv = svgCreate('text', {
                    "font-size": "14",
                    "font-family":'Courier New',
                    "fill": "#000"
                })
                // customDiv.innerHTML="<tspan x='8' dy='38' fill='green'>名称</tspan>\n" +
                //     "                <tspan x='8' dy='1.3em'>crtim</tspan>\n" +
                //     "                <tspan x='8' dy='1.3em'>uptim</tspan>\n" +
                //     "                <tspan x='8' dy='1.3em'>crman</tspan>\n" +
                //     "                 <tspan x='70' y='38' fill='green'>描述</tspan>\n" +
                //     "                <tspan x='70' dy='1.3em'>创建时间</tspan>\n" +
                //     "                <tspan x='70' dy='1.3em'>更新时间</tspan>\n" +
                //     "                <tspan x='70' dy='1.3em'>创建人</tspan>" ;

                customDiv.innerHTML="<tspan x='8' dy='38' fill='green'>名称</tspan>";
                for (const field of data.fields) {
                    customDiv.innerHTML+="<tspan x='8' dy='1.3em'>"+field.name+"</tspan>";
                }
                customDiv.innerHTML+="<tspan x='70' y='38' fill='green'>描述</tspan>";
                for (const field of data.fields) {
                    customDiv.innerHTML+="<tspan x='70' dy='1.3em'>"+field.comet+"</tspan>";
                }

                element['width'] = attr.width // 这里我是取了巧, 直接修改了元素的宽高
                element['height'] = attr.height
                // let color = element.businessObject.color
                // element.businessObject.di.set('bioc:stroke', color)
                // svgAppend(parentNode, customIcon)
                svgAppend(parentNode, customDiv)
                // 判断是否有name属性来决定是否要渲染出label
                // if (!hasLabelElements.includes(type) && element.businessObject.name) {
                //     const text = svgCreate('text', {
                //         x: attr.x,
                //         y: attr.y + attr.height + 20,
                //         "font-size": "14",
                //         "fill": "#000"
                //     })
                //     text.innerHTML = element.businessObject.name
                //     svgAppend(parentNode, text)
                //     console.log(text)
                // }
                // this.modeling.resizeShape(element, {
                //     x: element.x,
                //     y: element.y,
                //     width: element['width'] / 2,
                //     height: element['height'] / 2
                // })
                // return customIcon
                return myShape
            }
            // else if (true) {
            //     console.log('我是绿色的')
            //     // let color = element.businessObject.color
            //     // element.businessObject.di.set('bioc:stroke', color)
            //     const shape = this.bpmnRenderer.drawShape(parentNode, element)
            //     return shape
            // }
            if(this.bpmnRenderer!=null){
                return this.bpmnRenderer.drawShape(parentNode, element)
            }
        } else {
            if(this.bpmnRenderer!=null){
                return this.bpmnRenderer.drawShape(parentNode, element)
            }
        }
    }
}

inherits(CustomRenderer, BaseRenderer)

CustomRenderer.$inject = ['eventBus', 'styles', 'textRenderer']

CustomRenderer.prototype.canRender = function(element) {
    // ignore labels
    return true
        // return !element.labelTarget;
}

CustomRenderer.prototype.drawShape = function(p, element) {
    console.log(element)
    console.log(element.type)
    if (customElements.includes(element.type)) {
        return this.drawCustomElements(p, element)
    }
}

CustomRenderer.prototype.getShapePath = function(shape) {
    console.log(shape)
}
