## Single Page Application
### 定义
SPA, 单页应用是指在浏览器中运行的应用，在使用期间页面不会重新加载。本项目是一个从前端到后端都是用JS语言来实现的应用，即纯'js'栈。
### V1.0
Chapter 01 在一个页面上完成的一个demo.
### V3.0 
Chapter 03 渲染功能容器与管理应用状态。
####深入理解Shell
Shell 是单页应用的主控制器( master controller ), 在我们的架构中是必需的。可以看作是与MVC中Master Controller是一致的，因为它是协调所有从属功能模块的控制器。
Shell 负责以下事情。
1. 渲染和管理功能容器。
2. 管理应用状态。
3. 协调功能模块。
####创建文件和名字空间
我们会为js/css创建平行的文件结构，这种约定能加快开发，提升质量和简化维护。我们已经选择spa作为单页应用的根名字空间，JS和CSS文件名，JS名字空间和CSS选择器名称都同步使用。这样就可以很容易的追踪那个JS文件搭配那个CSS文件了。
###管理功能容器
Shell渲染并管理着功能容器。
#### 编写展开和收起聊天滑块方法
我们对聊天滑块函数的要求是适度的。我们需要它具有产品级的质量，但不用过度设计。
下面是我们想要完成的需求。
1. 开发人员能配置滑块的运动的速度和高度。
2. 创建单个方法来展开或者收起聊天滑块。
3. 避免出现竞争条件（race condition ) 即，滑块可能同时在展开和收起。
4. 开发人员能够传入一个可选的回调函数，会在滑块运动结束时调用。
5. 创建测试代码，以便确保滑块功能正常。
