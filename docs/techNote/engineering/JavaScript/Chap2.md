# Chap2 HTML中的JavaScript

## \<script\>元素

* 将JavaScript插入HTML的主要方法是使用\<script\>元素，此元素具有8个属性
  * ``async``：可选。表示应该立即开始下载脚本，但不能阻止其他页面动作，比如下载资源或等待其他脚本加载，只对外部脚本文件有效。
  * `charset` ：可选。使用`src` 属性指定的代码字符集。这个属性很少使用，因为大多数浏览器不在乎它的值。
  * `crossorigin` ：可选。配置相关请求的CORS（跨源资源共享）设置。默认不使用CORS。`crossorigin="anonymous"` 配置文件请求不必设置凭据标志。`crossorigin="use-credentials"` 设置凭据标志，意味着出站请求会包含凭据。
  * `defer` ：可选。表示脚本可以延迟到文档完全被解析和显示之后再执行。只对外部脚本文件有效。在IE7及更早的版本中，对行内脚本也可以指定这个属性。
  * `integrity` ：可选。允许比对接收到的资源和指定的加密签名以验证子资源完整性（SRI，Subresource Integrity）。如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错，脚本不会执行。这个属性可以用于确保内容分发网络（CDN，Content Delivery Network）不会提供恶意内容。
  * `language` ：废弃。最初用于表示代码块中的脚本语言（如`"JavaScript"` 、`"JavaScript 1.2"` 或`"VBScript"` ）。大多数浏览器都会忽略这个属性，不应该再使用它。
  * `src` ：可选。表示包含要执行的代码的外部文件。
  * `type` ：可选。代替`language` ，表示代码块中脚本语言的内容类型（也称MIME类型）。按照惯例，这个值始终都是`"text/javascript"` ，尽管`"text/javascript"` 和`"text/ecmascript"` 都已经废弃了。JavaScript文件的MIME类型通常是`"application/x-javascript"` ，不过给type属性这个值有可能导致脚本被忽略。在非IE的浏览器中有效的其他值还有`"application/javascript"` 和`"application/ecmascript"` 。如果这个值是`module` ，则代码会被当成ES6模块，而且只有这时候代码中才能出现`import` 和`export` 关键字。

* 使用\<script\>的方式有两种：直接网页嵌入，包含外部JS文件

  * 嵌入行内JavaScript代码
    * 代码会被从上到下解释，如下例，函数会被保存在解释器环境中
    * \<script\>元素中的代码被计算完成前，页面其余内容个不会被加载，也不会被显示
    * 使用转义字符避免歧义（如下例）

  ```javascript
  <script>
    function sayScript() { console.log("<\/script>"); }
  </script>
  ```

  * 包含外部JS文件
    * 浏览器会向src属性指定的路径发起一个GET请求，这个初始的请求不受浏览器同源策略限制，但返回并被执行的JavaScript则受限制
    * 引用外部JavaScript文件需要小心，可能会被恶意修改，要确保该领域为可信来源，integrity属性是防范这种问题的一个武器，但并非所有浏览器都支持
    * 浏览器会按照script在页面中出现的顺序依次解释（前提是无defer和async属性）

  ```javascript
  <script src="http://www.somewhere.com/afile.js"></script>
  ```

### 标签占位符

* 过去，所有``<script>``元素放在页面的``<head>``标签内，意义是将外部css和js文件集中放置，意味着必须把所有JavaScript代码都下载、解析和解释完成后，才能开始渲染页面（页面在浏览器解析到`<body>` 的起始标签时开始渲染）。这会导致页面渲染的明显延迟，期间浏览器窗口完全空白，故现在Web应用程序通常将所有JS引用放在``<body>``元素中的页面内容后面，用户会因为浏览器显示空白页面的时间变短了从而感觉页面加载更快了，两者对比如下所示。

```html
<!DOCTYPE html>
<html>
  <head>
  	<title>Example HTML Page</title>
    <!-- 不佳放置位置 -->
    <script src="example1.js"></script>
  	<script src="example2.js"></script>
  </head>
  <body>
  	<!-- 这里是页面内容 -->
    <!-- 更佳放置位置 -->
  	<script src="example1.js"></script>
  	<script src="example2.js"></script>
  </body>
</html>
```

### 推迟执行脚本

* 在``<script>``元素中设置``defer``属性，相当于告诉浏览器立即下载外部js文件，但会延迟到整个页面都解析完毕后再运行。考虑到某些浏览器会忽略这个属性，把推迟执行的脚本放在页面底部较好
* 实际中，推迟执行的脚本不一定总会按顺序执行，或者在``DOMContentLoaded``事件之前执行，因此最好只包含一个这样的脚本

```html
<!DOCTYPE html>
<html>
  <head>
  	<title>Example HTML Page</title>
  	<script defer src="example1.js"></script>
  	<script defer src="example2.js"></script>
  </head>
  <body>
  	<!-- 这里是页面内容 -->
  </body>
</html>
```

### 异步执行脚本

* async的脚本并不保证按照出现次序执行，重点在于它们之间没有依赖关系，每个async的脚本加载完会立即执行，不必等待html渲染完成

* 异步脚本不应该在加载期间修改DOM，异步脚本保证会在页面的`load` 事件前执行，但可能会在`DOMContentLoaded` 之前或之后

```html
<!DOCTYPE html>
<html>
  <head>
  	<title>Example HTML Page</title>
  	<script async src="example1.js"></script>
  	<script async src="example2.js"></script>
  </head>
  <body>
  	<!-- 这里是页面内容 -->
  </body>
</html>
```

### 动态加载脚本

* 因为JavaScript可以使用DOM API，所以通过向DOM中动态添加`script` 元素同样可以加载指定的脚本。只要创建一个`script` 元素并将其添加到DOM即可。
* 默认情况下，以这种方式创建的`<script>` 元素是以异步方式加载的，相当于添加了`async` 属性。不过这样做可能会有问题，因为所有浏览器都支持`createElement()` 方法，但不是所有浏览器都支持`async` 属性。因此，如果要统一动态脚本的加载行为，可以明确将其设置为同步加载：

```javascript
let script = document.createElement('script');
script.src = 'gibberish.js';
script.async = false;
document.head.appendChild(script);
```

* 以这种方式获取的资源对浏览器预加载器是不可见的。这会严重影响它们在资源获取队列中的优先级。要想让预加载器知道这些动态请求文件的存在，可以在文档头部显式声明它们

```html
<link rel="preload" href="gibberish.js">
```

## 行内代码与外部文件

* 最佳实践是尽可能将JavaScript代码放在外部文件中，原因如下：
  * 可维护性：用一个目录保存所有JavaScript文件会更容易维护
  * 缓存：若两个页面共用一个文件，则文件只需要下载一次，为页面加载提速
  * 适应未来：不必考虑XHTML等历史遗留问题
* 对于支持SPDY/HTTP2的浏览器，以轻量独立JS组件形式送至客户端会更具优势。从浏览器角度看，通过SPDY/HTTP2获取所有这些独立的资源与获取一个大JavaScript文件的延迟差不多。但在第二个页面请求时，由于你已经把应用程序切割成了轻量可缓存的文件，第二个页面也依赖的某些组件此时已经存在于浏览器缓存中了。
* 对较老浏览器，一个大文件可能会更合适

## 文档模式

* 略

## \<noscript\>元素

* 针对早期浏览器不支持JavaScript的问题，需要一个页面优雅降级的处理方案。

* 当浏览器不支持脚本或对脚本的支持被关闭时，会渲染``<noscript>``标签中的内容，否则不渲染

* `<noscript>` 元素可以包含任何可以出现在`<body>` 中的HTML元素，`<script>` 除外。