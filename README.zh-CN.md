### 🍿 项目简介

[![码云Gitee](https://gitee.com/vben/vben-web/badge/star.svg?theme=blue)](https://gitee.com/vben/vben-web)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()

vben-web 是vben系列框架的统一WEB前端，基于```玲娜贝er```大佬的 [ruoyi-plus-vben5](https://gitee.com/dapppp/ruoyi-plus-vben5) 改造，将Ant Design版本改造成Element Plus版本。

vben5 使用了最新前端技术栈，提供丰富的组件和模板以及N种偏好设置组合方案， 应用层可自由选择UI框架（Element Plus，Ant Design Vue，Native UI）

### 🍟 相关地址

* QQ交流群：[795417789](https://jq.qq.com/?_wv=1027&k=yoKKIlIG)

* 前端WEB 体验地址 ：[http://8.153.168.178/](http://8.153.168.178/)

* 移动端APP 体验地址 ：[http://8.153.168.178/unibest/](http://8.153.168.178/unibest/)

* 前端WEB 项目地址 https://gitee.com/vben/vben-web

* 移动端APP 项目地址 https://gitee.com/vben/vben-app

* java后端API 项目地址 https://gitee.com/vben/vben-java

* vben-java文档 ：[http://8.153.168.178/java-doc](http://8.153.168.178/java-doc)

* .net后端API 项目地址 https://gitee.com/vben/vben-net

* vben-net文档 ：[http://8.153.168.178/net-doc](http://8.153.168.178/net-doc)

* python后端API 项目地址 https://gitee.com/vben/vben-python

### ⚡ 快速启动

java后端

* 准备工作：1. 准备java17及以上版本，修改pom.xml对应java.version 2. 根据application-dev.yml配置文件准备一个空的数据库，默认为vben-java的mysql数据库，账号root,密码123456 3. 开启redis 默认密码为空

* 数据库初始化：启动VbenSetup，程序会自动创建数据库表与初始化表数据，生成完成后VbenSet应用会自动关闭

* 启动后台API：启动VbenAdmin，也可启动VbenJpa或VbenMybatis查看相应DEMO示例

.net后端

* 准备工作：1. 准备.NET8（.NET10）环境，修改.csproj对应TargetFramework 2. 根据web.Development.json配置文件准备一个空的数据库，默认为vben-net的mysql数据库，账号root,密码123456 3. 开启redis 默认密码为空

* 启动后台API：启动VbenAdmin，系统会根据SqlSugar CodeFirst自动生成数据库表结构，另外会根据Init相关服务生成数据库初始化数据。也可启动VbenFurion或VbenNative查看相应DEMO示例

web前端

* 准备工作：准备Node.js 20.15.0以上环境，全局安装pnpm：npm install -g pnpm

* 启动前台WEB：1. 使用pnpm install安装依赖 2. 使用pnpm dev:ele运行项目 3.访问 http://localhost:5666/ 预览

### 🍄 主要特色

- 后端项目中抽离并拆分了公共功能，以插件化与扩展包的方式组织，结构解耦且易于扩展。
- 后端项目业务模块以多基础模块与多应用方式组织，可实现多个应用共用相同基础模块，方便实现基础模块共享
- 工作流模块不依赖其他工作流引擎，全部自行实现，易于扩展，实现复杂工作流
- 统一的命名风格，数据库表主键统一用ID命名，表字段采用SAP风格（后端手册里有详细介绍）

### 🍖 内置功能

以下表格列出了各后台API功能的支持度。

<table>
    <thead>
    <tr>
        <th width="150" align="center">业务模块</th>
        <th width="*">功能说明</th>
        <th width="150" align="center">JAVA版本</th>
        <th width="150" align="center">.NET版本</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td align="center">用户管理</td>
        <td>用户的管理配置 如:新增用户、分配用户所属部门、角色、岗位等</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">部门管理</td>
        <td>配置系统组织机构（公司、部门、小组） 树结构展现支持数据权限</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">岗位管理</td>
        <td>配置系统用户所属担任职务</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">菜单管理</td>
        <td>配置系统菜单、操作权限、按钮权限标识等</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">角色管理</td>
        <td>角色根据部门、用户、岗位、群组分配权限</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">字典管理</td>
        <td>对系统中经常使用的一些较为固定的数据进行维护</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">参数管理</td>
        <td>对系统动态配置常用参数</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">通知公告</td>
        <td>系统通知公告信息发布维护</td>
        <td align="center">√</td>
        <td align="center">× 待支持</td>
    </tr>
    <tr>
        <td align="center">客户端管理</td>
        <td>系统内对接的所有客户端管理 如: pc端、小程序端等，支持动态授权登录方式 如: 短信登录、密码登录等 支持动态控制token时效</td>
        <td align="center">√</td>
        <td align="center">× 待支持</td>
    </tr>
    <tr>
        <td align="center">操作日志</td>
        <td>系统正常操作日志记录和查询 系统异常信息日志记录和查询</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">登录日志</td>
        <td>系统登录日志记录查询包含登录异常</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">文件管理</td>
        <td>同时支持本地文件存储于分布式对象存储。系统文件展示、上传、下载、删除等管理</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">在线用户管理</td>
        <td>已登录系统的在线用户信息监控与强制踢出操作</td>
        <td align="center">√</td>
        <td align="center">× 待支持</td>
    </tr>
    <tr>
        <td align="center">定时任务</td>
        <td>运行报表、任务管理(添加、修改、删除)、日志管理、执行器管理等</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">代码生成</td>
        <td>前后端代码的生成（c#、vue、sql）支持CRUD下载</td>
        <td align="center">√</td>
        <td align="center">×</td>
    </tr>
    <tr>
        <td align="center">系统接口</td>
        <td>根据业务代码自动生成相关的api接口文档</td>
        <td align="center">√ 通过Apifox支持</td>
        <td align="center">√ 通过swagger-ui支持</td>
    </tr>
    <tr>
        <td align="center">服务监控</td>
        <td>监视系统CPU、内存、磁盘、堆栈、在线日志等</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">缓存监控</td>
        <td>对系统的缓存信息查询，命令统计等</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">在线构建器</td>
        <td>拖动表单元素生成相应的HTML代码</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">使用案例</td>
        <td>系统的一些功能案例</td>
        <td align="center">√</td>
        <td align="center">√</td>
    </tr>
    <tr>
        <td align="center">工作流</td>
        <td>前端流程图采用BPMN.js，表单采用FromCreate（FormDesigner），后端自行实现流程引擎</td>
        <td align="center">√ 持续扩展</td>
        <td align="center">× 待java版本稳定</td>
    </tr>
    </tbody>
</table>

### 💐 特别鸣谢
- 👉 原框架作者：[zsvg](https://gitee.com/zsvg)
- 👉 Vben-Admin：[https://github.com/vbenjs/vue-vben-admin](https://github.com/vbenjs/vue-vben-admin)
- 👉 FormCreate：[https://www.form-create.com/](https://www.form-create.com/)
- 👉 RuoYi-Vue-Plus：[https://gitee.com/dromara/RuoYi-Vue-Plus](https://gitee.com/dromara/RuoYi-Vue-Plus)
- 👉 ruoyi-plus-vben5：[https://gitee.com/dapppp/ruoyi-plus-vben5](https://gitee.com/dapppp/ruoyi-plus-vben5)
- 👉 Furion：[https://furion.net/](https://furion.net/)
- 👉 SqlSugar：[https://www.donet5.com/Home/Doc](https://www.donet5.com/Home/Doc)
- 👉 Admin.Net：[https://gitee.com/zuohuaijun/Admin.NET](https://gitee.com/zuohuaijun/Admin.NET)
- 👉 ZrAdmin：[https://gitee.com/izory/ZrAdminNetCore](https://gitee.com/izory/ZrAdminNetCore)

### 🏀 浏览器支持

最低适配应该为`Chrome 88+`以上浏览器 详见 [css - where](https://developer.mozilla.org/en-US/docs/Web/CSS/:where#browser_compatibility)

本地开发推荐使用`Chrome` 最新版本浏览器

支持现代浏览器，不支持 IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |
