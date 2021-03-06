# Chap1 什么是JavaScript

## 简短的历史回顾

* 随着web日益流行，对客户端脚本语言的需求越发强烈，当时，大多数用户使用28.8kb/s的调制解调器上网，用户交互带来的客户端与服务器的往返通信成为用户痛点（如表单忘填字段，要等30秒才能收到服务器反馈的错误信息）。

* 网景在当时是引领技术革新的公司，它将开发一个客户端脚本语言来处理这种简单的数据验证提上了日程。1995年，网景公司一位名叫Brendan Eich的工程师，开始为即将发布的Netscape Navigator 2开发一个叫Mocha（后来改名为LiveScript）的脚本语言。当时的计划是在客户端和服务器端都使用它，它在服务器端叫LiveWire。为了赶上发布时间，网景与Sun公司结为开发联盟，共同完成LiveScript的开发。就在Netscape Navigator 2正式发布前，网景把LiveScript改名为JavaScript，以便搭上媒体当时热烈炒作Java的顺风车。

* 由于JavaScript 1.0很成功，网景又在Netscape Navigator 3中发布了1.1版本。尚未成熟的Web的受欢迎程度创造了历史新高，而网景则稳居市场领导者的位置。这时候，微软决定向IE投入更多资源。就在Netscape Navigator 3发布后不久，微软发布了IE3，其中包含自己名为JScript（叫这个名字是为了避免与网景发生许可纠纷）的JavaScript实现。1996年8月，微软重磅进入Web浏览器领域，这是网景永远的痛，但它代表JavaScript作为一门语言向前迈进了一大步。微软的JavaScript实现意味着出现了两个版本的JavaScript：Netscape Navigator中的JavaScript，以及IE中的JScript。与C语言以及很多其他编程语言不同，JavaScript还没有规范其语法或特性的标准，两个版本并存让这个问题更加突出了。随着业界担忧日甚，JavaScript终于踏上了标准化的征程。

* 1997年，JavaScript 1.1作为提案被提交给欧洲计算机制造商协会（Ecma）。第39技术委员会（TC39）承担了“标准化一门通用、跨平台、厂商中立的脚本语言的语法和语义”的任务（参见TC39-ECMAScript）。TC39委员会由来自网景、Sun、微软、Borland、Nombas和其他对这门脚本语言有兴趣的公司的工程师组成。他们花了数月时间打造出ECMA-262，也就是ECMAScript（发音为“ek-ma-script”）这个新的脚本语言标准。1998年，国际标准化组织（ISO）和国际电工委员会（IEC）也将ECMAScript采纳为标准（ISO/IEC-16262）。自此以后，各家浏览器均以ECMAScript作为自己JavaScript实现的依据，虽然具体实现各有不同。

## JavaScript实现

完整的JavaScript包含以下部分：

* 核心（ECMAScript）：由ECMA-262定义并提供核心功能
* 文档对象模型（DOM）：提供与网页内容交互的方法和接口
* 浏览器对象模型（BOM）：提供与浏览器交互的方法和接口

JavaScript的这三个部分得到五大Web Browser（IE、Firefox、Chrome、Safari、Opera）不同程度的支持

* 所有浏览器基本对ES5 提供完善支持，对ES6，ES7的支持度正不断提升
* 对DOM支持各不相同，但对Level 3的支持日益趋于规范
* HTML5中收录的BOM因浏览器而异，但开发者仍可以假定存在一大部分的公有特性

### ECMAScript

##### ECMAScript定义

ECMAScript ，即ECMA-262定义的语言，并不局限于Web浏览器。事实上，这门语言没有输入和输出之类的方法。ECMA-262将这门语言作为一个基准来定义，以便在它之上再构建更稳健的脚本语言。Web浏览器只是ECMAScript实现可能存在的一种宿主环境 。宿主环境提供ECMAScript的基准实现和与环境自身交互必需的扩展。扩展（比如DOM）使用ECMAScript核心类型和语法，提供特定于环境的额外功能。其他宿主环境还有服务器端JavaScript平台Node.js和即将被淘汰的Adobe Flash。

ECMAScript只是对实现这个规范描述的所有方面的一门语言的称呼。JavaScript实现了ECMAScript，而Adobe ActionScript同样也实现了ECMAScript。

##### ECMAScript版本

* ECMA1（1997）
  * 在网景的JavaScript1.1上删除了所有浏览器特定的代码，外加少量修改，因为ECMA-262要求支持Unicode标准，且对象与平台无关
* ECMA2（1998）
  * 编校工作，为了更新后严格符合ISO/IEC-16262的要求，无增减改变任何特性
* ECMA3（成为真正编程语言的标志，1999）
  * 更新字符串处理、错误定义、数值输出，增加正则表达式、新的控制语句、try/catch异常处理的支持
* ECMA4（因改动跳跃过大，正式发布前被放弃）
* ECMA5（ES3.1进化而来，发布于2009年12月）
  * 理清ECMA3的歧义，增加新功能包括原生的解析和序列化JSON数据的JSON对象、便于继承和高级属性定义的方法，增强ECMAScript引擎解释和执行代码能力的严格模式
  * 后来在2011年6月发布一个维护性的修订版，无特性增加
* ECMA6（ES6，ES2015，ES Harmony，发布于2015年6月）
  * 正式支持类、模块、迭代器、生成器、箭头函数、期约、反射、代理和众多新数据类型
  * 有史以来最重要的一批增强特性
* ECMA7（ES7，ES2016，发布于2016年6月）
  * 少量语法层面的增强，如Array.prototype.includes和指数操作符
* ECMA8（ES8，ES2017，发布于2017年6月）
  * 增加异步函数（async/await），共享缓冲区（sharedArrayBuffer），原子接口（Atomics API）
  * 增加Object.values()/.entries()/.getOwnPropertyDescriptors()和字符串填充方法
  * 支持对象字面量最后的逗号
* ECMA9（ES9，ES2018，发布于2018年6月）
  * 修订包括异步迭代、剩余和扩展属性、一组新的正则表达式属性、Promise finally()，模版字面量
* ECMA10（ES10，ES2019，发布于2019年6月）
  * 增加Array.prototype.flat()/flatMap()、String.prototype.trimStart()/trimEnd()、Object.fromEntries()方法、Symbol.prototype.description属性
  * 明确定义Function.prototype.toString()的返回值并固定Array.prototype.sort()的顺序，catch子句的可选绑定
  * 解决了JSON字符串的兼容问题

##### 浏览器对ECMAScript的支持

[在线检测浏览器对ES6的支持](http://ruanyf.github.io/es-checker/index.cn.html)

[ECMA各版本和主流浏览器各版本的兼容表](http://kangax.github.io/compat-table/es6/)

### DOM

##### DOM定义

文档对象模型（DOM）是一个应用编程接口（API），用于在HTML中使用扩展的XML。DOM通过创建表示文档的树，让开发者随心所欲控制网页内容和结构，使用DOM API，可以删除、添加、替换、修改节点。

##### DOM级别

DOM Level 1（目标是映射文档结构）于1998年10月成为W3C的推荐标准，这个规范由两个模块组成：

* DOM Core：提供了一种映射XML文档，从而方便访问和操作文档任意部分的方式
* DOM HTML：扩展DOM Core，并增加了特定于HTML的对象和方法。

DOM Level 2的目标则宽泛得多，它对最初的DOM进行扩展，增加了对鼠标和用户界面事件、范围、遍历（迭代DOM节点的方法）的支持通过对象接口支持了层叠样式表（CSS）DOM Level 1中的DOM Core也被扩展以包含对XML命名空间的支持

* DOM视图：描述追踪文档不同视图的接口
* DOM事件：描述事件及事件处理的接口
* DOM样式：描述处理元素CSS样式的接口
* DOM遍历和范围：描述遍历和操作DOM树的接口

DOM Level 3进一步扩展DOM

* 增加以统一方式加载/保存文档的方法，还有验证文档的方法
* 经过扩展支持所有XML 1.0 的特性，包括XML Infoset、XPath和XML Base

DOM Level 4（DOM Living Standard 的快照）

* 新增内容包括替代Mutation Events的Mutation Observers

### BOM

使用BOM，开发者可以操控浏览器显示页面以外的部分。HTML5以正式规范的形式涵盖了尽可能多的BOM特性（以前都是每个浏览器各自定义各自实现，HTML5逐渐统一这一点），BOM主要针对浏览器窗口和子窗口，不过人们会把特定于浏览器的扩展都归于BOM的范畴内，如下：

* 弹出新浏览器窗口的能力
* 移动、缩放、关闭浏览器窗口的能力
* 对cookie的支持
* navigator对象：提供关于浏览器的详尽信息
* location对象：提供浏览器加载页面的详尽信息
* screen对象：提供关于用户屏幕分辨率的详尽信息
* performance对象：提供浏览器内存占用、导航行为和时间统计的详尽信息
* 其他自定义对象：如XMLHttpRequest和IE的ActiveXObject

