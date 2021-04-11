# Chap5 基本引用类型

## Date

* `Date` 类型将日期保存为自协调世界时（UTC，Universal Time Coordinated）时间1970年1月1日午夜（零时）至今所经过的毫秒数。
* 在不给`Date` 构造函数传参数的情况下，创建的对象将保存当前日期和时间。要基于其他日期和时间创建日期对象，必须传入其毫秒表示
* `Date.parse()` 方法接收一个表示日期的字符串参数，转换为表示该日期的毫秒数（支持以下格式输入）
  * “月/日/年”，如`"5/23/2019"` ；
  * “月名 日, 年”，如`"May 23, 2019"` ；
  * “周几 月名 日 年 时:分:秒 时区”，如`"Tue May 23 2019 00:00:00 GMT-0700"` ；
  * ISO 8601扩展格式“YYYY-MM-DDTHH:mm:ss.sssZ”，如`2019-05-23T00:00:00` （只适用于兼容ES5的实现）。
* `Date.UTC()` 方法也返回日期的毫秒表示，传给`Date.UTC()` 的参数是年、零起点月数（1月是0，2月是1，以此类推）、日（1~31）、时（0~23）、分、秒和毫秒。这些参数中，只有前两个（年和月）是必需的。如果不提供日，那么默认为1日。其他参数的默认值都是0。
* `Date.now()` 方法，返回表示方法执行时日期和时间的毫秒数。这个方法可以方便地用在代码计时中

```javascript
let now = new Date();

let someDate = new Date(Date.parse("May 23, 2019"))
let someDate = new Date("May 23, 2019");

// 两种UTC是有区别的
let y2k = new Date(Date.UTC(2000, 0)); // GMT时间2000年1月1日零点
let allFives = new Date(Date.UTC(2005, 4, 5, 17, 55, 55)); // GMT时间2005年5月5日下午5点55分55秒
let y2k = new Date(2000, 0); // 本地时间2000年1月1日零点
let allFives = new Date(2005, 4, 5, 17, 55, 55); // 本地时间2005年5月5日下午5点55分55秒

// 代码计时
let start = Date.now();
doSomething();
let stop = Date.now(),
result = stop - start;
```

### 继承的方法

* `valueOf()` 方法被重写后返回的是日期的毫秒表示，比较操作符可以直接使用它返回的值。
* `toString()` 方法通常返回带时区信息的日期和时间，而时间也是以24小时制（0~23）表示的。

```javascript
let date1 = new Date(2019, 0, 1);    // 2019年1月1日
let date2 = new Date(2019, 1, 1);    // 2019年2月1日
console.log(date1 < date2); // true

toString() - Thu Feb 1 2019 00:00:00 GMT-0800 (Pacific Standard Time)
```

### 日期格式化方法

* `Date` 类型有几个专门用于格式化日期的方法，它们都会返回字符串：
  * `toDateString()` 显示日期中的周几、月、日、年（格式特定于实现）；
  * `toTimeString()` 显示日期中的时、分、秒和时区（格式特定于实现）；
  * `toLocaleDateString()` 显示日期中的周几、月、日、年（格式特定于实现和地区）；
  * `toLocaleTimeString()` 显示日期中的时、分、秒（格式特定于实现和地区）；
  * `toUTCString()` 显示完整的UTC日期（格式特定于实现）。

* 这些方法的输出因浏览器而异。因此不能用于在用户界面上一致地显示日期。

### 日期/时间组件方法

* `Date` 类型剩下的方法（见下表）直接涉及取得或设置日期值的特定部分
* “UTC日期”，指的是没有时区偏移（将日期转换为GMT）时的日期。

| 方法                                                         | 说明                                |
| ------------------------------------------------------------ | ----------------------------------- |
| [get/set]\[Time/FullYear/Month/Date/Day/Hours/Minutes/Seconds/Milliseconds]() | 带时区偏移的                        |
| [get/set]\[UTC]\[FullYear/Month/Date/Day/Hours/Minutes/Seconds/Milliseconds]() | 没有时区偏移的                      |
| getTimezoneOffset()                                          | 返回以分钟计的UTC与本地时区的偏移量 |

## RegExp

* ECMAScript通过`RegExp` 类型支持正则表达式。创建语法为``let expression = /pattern/flags;``
  * 正则表达式的`pattern` （模式）可以是任何简单或复杂的正则表达式，包括字符类、限定符、分组、向前查找和反向引用。
  * 每个正则表达式可以带零个或多个`flags` （标记），用于控制正则表达式的行为。
    * `g` ：全局模式，表示查找字符串的全部内容，而不是找到第一个匹配的内容就结束。
    * `i` ：不区分大小写，表示在查找匹配时忽略`pattern` 和字符串的大小写。
    * `m` ：多行模式，表示查找到一行文本末尾时会继续查找。
    * `y` ：粘附模式，表示只查找从`lastIndex` 开始及之后的字符串。
    * `u` ：Unicode模式，启用Unicode匹配。
    * `s` ：`dotAll` 模式，表示元字符`.` 匹配任何字符（包括`\n` 或`\r` ）

```javascript
// 匹配字符串中的所有"at"
let pattern1 = /at/g;

// 匹配第一个"bat"或"cat"，忽略大小写
let pattern2 = /[bc]at/i;

// 匹配所有以"at"结尾的三字符组合，忽略大小写
let pattern3 = /.at/gi;

// 元字符在模式中必须通过使用添加反斜杠来转义
( [ { \ ^ $ | ) ] } ? * + .
```

### RegExp实例方法

* `RegExp` 实例的主要方法是`exec()` ，主要用于配合捕获组使用。这个方法只接收一个参数，即要应用模式的字符串。如果找到了匹配项，则返回包含第一个匹配信息的数组；如果没找到匹配项，则返回`null` 。返回的数组虽然是`Array` 的实例，但包含两个额外的属性：`index` 和`input` 。
* `index` 是字符串中匹配模式的起始位置，`input` 是要查找的字符串。这个数组的第一个元素是匹配整个模式的字符串，其他元素是与表达式中的捕获组匹配的字符串。如果模式中没有捕获组，则数组只包含一个元素。

```javascript
// 模式包含两个捕获组
let text = "mom and dad and baby";
let pattern = /mom( and dad( and baby)?)?/gi;

let matches = pattern.exec(text);
console.log(matches.index);   // 0
console.log(matches.input);   // "mom and dad and baby"
console.log(matches[0]);      // "mom and dad and baby"
console.log(matches[1]);      // " and dad and baby"
console.log(matches[2]);      // " and baby"

// 如果在模式上设置了g标记，则每次调用exec()都会在字符串中向前搜索下一个匹配项；如果没有设置全局标记，则无论对同一个字符串调用多少次exec()，也只会返回第一个匹配的信息。
let text = "cat, bat, sat, fat";
let pattern = /.at/g;
let matches = pattern.exec(text);
console.log(matches.index);      // 0
console.log(matches[0]);         // cat
console.log(pattern.lastIndex);  // 3

matches = pattern.exec(text);
console.log(matches.index);      // 5
console.log(matches[0]);         // bat
console.log(pattern.lastIndex);  // 8

matches = pattern.exec(text);
console.log(matches.index);      // 10
console.log(matches[0]);         // sat
console.log(pattern.lastIndex);  // 13
```

* 正则表达式的另一个方法是`test()` ，接收一个字符串参数。如果输入的文本与模式匹配，则参数返回`true` ，否则返回`false` 。这个方法适用于只想测试模式是否匹配，而不需要实际匹配内容的情况。

```javascript
let text = "000-00-0000";
let pattern = /\d{3}-\d{2}-\d{4}/;

if (pattern.test(text)) {
  console.log("The pattern was matched.");
}
```

### RegExp构造函数属性

* 略

## 原始值包装类型

* 为了方便操作原始值，ECMAScript提供了3种特殊的引用类型：`Boolean` 、`Number` 和`String` 。这些类型具有本章介绍的其他引用类型一样的特点，但也具有与各自原始类型对应的特殊行为。每当用到某个原始值的方法或属性时，后台都会创建一个相应原始包装类型的对象，从而暴露出操作原始值的各种方法。
* 引用类型与原始值包装类型的主要区别在于对象的生命周期。自动创建的原始值包装对象只存在于访问它的那行代码执行期间。

```javascript
let s1 = "some text";
let s2 = s1.substring(2);

// s1作为原始值，逻辑上不应该有方法，但在以读模式访问字符串值的任何时候，后台执行以下3步
let s = new String(s1);
let s2 = s.substring(2)
s = null;
```

* `Object` 构造函数作为一个工厂方法，能够根据传入值的类型返回相应原始值包装类型的实例。

### Boolean

* 强烈建议不使用

### Number

```javascript
let num = 10.005;
console.log(num.toString()); // "10"
// toFixed() 方法可以表示有0~20个小数位的数值
console.log(num.toFixed(2)); // "10.01"  
// toExponential() 也接收一个参数，表示结果中小数的位数
console.log(num.toExponential(1)); // "1.0e1"
// toPrecision() 方法会根据情况返回最合理的输出结果，可能是固定长度，也可能是科学记数法形式。这个方法接收一个参数，表示结果中数字的总位数（不包含指数）
let num = 99;
console.log(num.toPrecision(1)); // "1e+2"
console.log(num.toPrecision(2)); // "99"
console.log(num.toPrecision(3)); // "99.0"
// ES6 新增了isInteger()方法，用于辨别一个数值是否保存为整数
console.log(Number.isInteger(1));    // true
console.log(Number.isInteger(1.00)); // true
console.log(Number.isInteger(1.01)); // false
```

### String

```javascript
let message = "abcde";
console.log(message.length); // 5
console.log(message.charAt(2)); // "c"
// JavaScript字符串使用了两种Unicode编码混合的策略：UCS-2和UTF-16。对于可以采用16位编码的字符（U+0000~U+FFFF），这两种编码实际上是一样的。
console.log(message.charCodeAt(2));  // 99,Unicode "Latin small letter C"的编码是U+0063
console.log(String.fromCharCode(97, 98, 99, 100, 101)); // "abcde"
// concat()方法，用于将一个或多个字符串拼接成一个新字符串（用加号更常见）
let stringValue = "hello ";
let result = stringValue.concat("world", "!");
console.log(result);      // "hello world!"
console.log(stringValue); // "hello"
// slice()、substr()、substring()方法，注意区别
let stringValue = "hello world";
console.log(stringValue.slice(3));       // "lo world"
console.log(stringValue.substring(3));   // "lo world"
console.log(stringValue.substr(3));      // "lo world"
console.log(stringValue.slice(3, 7));    // "lo w"
console.log(stringValue.substring(3,7)); // "lo w"
console.log(stringValue.substr(3, 7));   // "lo worl"
console.log(stringValue.slice(-3));         // "rld"
console.log(stringValue.substring(-3));     // "hello world"，substring() 方法会将所有负参数值都转换为0
console.log(stringValue.substr(-3));        // "rld"
console.log(stringValue.slice(3, -4));      // "lo w"
console.log(stringValue.substring(3, -4));  // "hel"
console.log(stringValue.substr(3, -4));     // "" (empty string)
// indexOf()、lastIndexOf()方法用于定位子字符串，没找到就返回-1
let stringValue = "hello world";
console.log(stringValue.indexOf("o"));     // 4
console.log(stringValue.lastIndexOf("o")); // 7
console.log(stringValue.indexOf("o", 6));     // 7， 表示从该位置向后搜索，
console.log(stringValue.lastIndexOf("o", 6)); // 4， 表示从该位置向前搜索
// startsWith()、endsWith()、includes()方法 检测字符串包含关系
let message = "foobarbaz";
console.log(message.startsWith("foo"));  // true
console.log(message.startsWith("bar"));  // false
console.log(message.endsWith("baz"));    // true
console.log(message.endsWith("bar"));    // false
console.log(message.includes("bar"));    // true
console.log(message.includes("qux"));    // false
console.log(message.startsWith("foo", 1));  // false 可接受第二个参数表示开始搜索的位置
console.log(message.includes("bar", 4));    // false
// trim()、trimLeft()、trimRight()方法 删除前后空格，返回结果
let stringValue = "  hello world  ";
console.log(stringValue.trim());  // "hello world"
// repeat()方法 接收一个整数参数，表示要将字符串复制多少次
let stringValue = "a"
console.log(stringValue.repeat(3)) // "aaa"
// padStart()、padEnd()方法 复制字符串，如果小于指定长度，则在相应一边填充字符，直至满足长度条件。这两个方法的第一个参数是长度，第二个参数是可选的填充字符串，默认为空格。可选的第二个参数并不限于一个字符。如果提供了多个字符的字符串，则会将其拼接并截断以匹配指定长度。此外，如果长度小于或等于字符串长度，则会返回原始字符串。
let stringValue = "foo";
console.log(stringValue.padStart(6));       // "   foo"
console.log(stringValue.padStart(9, "."));  // "......foo"
console.log(stringValue.padEnd(6));         // "foo   "
console.log(stringValue.padEnd(9, "."));    // "foo......"
console.log(stringValue.padStart(8, "bar")); // "barbafoo"
console.log(stringValue.padStart(2));        // "foo"
console.log(stringValue.padEnd(8, "bar"));   // "foobarba"
console.log(stringValue.padEnd(2));          // "foo"
// 字符串分割为字符数组(实用)
let message = "abcde";
console.log([...message]); // ["a", "b", "c", "d", "e"]
// toUpperCase(), tolowerCase() 字符串大小写转换
let stringValue = "hello world";
console.log(stringValue.toUpperCase());        // "HELLO WORLD"
console.log(stringValue.toLowerCase());        // "hello world"
// match()、search()、replace() 字符串模式匹配方法
let text = "cat, bat, sat, fat";
let pattern = /.at/;
let matches = text.match(pattern); // 等价于pattern.exec(text)
console.log(matches.index);      // 0
console.log(matches[0]);         // "cat",第一个元素是与整个模式匹配的字符串，其余元素则是与表达式中的捕获组匹配的字符串（如果有的话）
console.log(pattern.lastIndex);  // 0
let text = "cat, bat, sat, fat";
let pos = text.search(/at/);
console.log(pos);  // 1
let text = "cat, bat, sat, fat";
let result = text.replace("at", "ond");
console.log(result);  // "cond, bat, sat, fat"
result = text.replace(/at/g, "ond");
console.log(result);  // "cond, bond, sond, fond"
let text = "cat, bat, sat, fat";
result = text.replace(/(.at)/g, "word ($1)"); // 更详细用法见书
console.log(result);  // word (cat), word (bat), word (sat), word (fat)
```

## 单例内置对象

* ECMA-262对内置对象的定义是“任何由ECMAScript实现提供、与宿主环境无关，并在ECMAScript程序开始执行时就存在的对象”。这就意味着，开发者不用显式地实例化内置对象。
* 前面我们已经接触了大部分内置对象，包括`Object` 、`Array` 和`String` 
* 本节介绍ECMA-262定义的另外两个单例内置对象：`Global` 和`Math` 

### Global

* ECMA-262规定`Global` 对象为一种兜底对象，它所针对的是不属于任何对象的属性和方法。
* 事实上，不存在全局变量或全局函数这种东西。在全局作用域中定义的变量和函数都会变成`Global` 对象的属性 。
* Global对象的方法如：`isNaN()` 、`isFinite()` 、`parseInt()` 和`parseFloat()`，下面介绍更多

#### URL编码方法

* `ecnodeURI()` 方法用于对整个URI进行编码，而`encodeURIComponent()` 方法用于编码URI中单独的组件
* 这两个方法的主要区别是，`encodeURI()` 不会编码属于URL组件的特殊字符，比如冒号、斜杠、问号、井号，而`encodeURIComponent()` 会编码它发现的所有非标准字符。

```javascript
let uri = "http://www.wrox.com/illegal value.js#start";
// "http://www.wrox.com/illegal%20value.js#start"
console.log(encodeURI(uri));
// "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.js%23start"
console.log(encodeURIComponent(uri));
```

* 对应的解码方法为``decodeURI()``和``decodeURIComponent()``
* URI方法`encodeURI()` 、`encodeURIComponent()` 、`decodeURI()` 和`decodeURIComponent()` 取代了`escape()` 和`unescape()` 方法，后者在ECMA-262第3版中就已经废弃了。URI方法始终是首选方法，因为它们对所有Unicode字符进行编码，而原来的方法只能正确编码ASCII字符。

#### eval()方法

* 当解释器发现`eval()` 调用时，会将参数解释为实际的ECMAScript语句，然后将其插入到该位置。通过`eval()` 执行的代码属于该调用所在上下文，被执行的代码与该上下文拥有相同的作用域链。这意味着定义在包含上下文中的变量可以在`eval()` 调用内部被引用
* 通过`eval()` 定义的任何变量和函数都不会被提升，这是因为在解析代码的时候，它们是被包含在一个字符串中的。它们只是在`eval()` 执行的时候才会被创建
* 在严格模式下，在`eval()` 内部创建的变量和函数无法被外部访问，赋值给`eval` 也会导致错误

* 使用`eval()` 的时候必须极为慎重，特别是在解释用户输入的内容时。因为这个方法会对XSS利用暴露出很大的攻击面

```javascript
let msg = "hello world";
eval("console.log(msg)");  // "hello world"

eval("function sayHi() { console.log('hi'); }");
sayHi();

eval("let msg = 'hello world';");
console.log(msg);  // Reference Error: msg is not defined
```

#### Global对象属性

* Global对象的属性包括：
  * 特殊值：undefined、NaN、Infinity
  * 构造函数：Object、Array、Function、Boolean、String、Number、Date、RegExp、Symbol、Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError

#### window对象

* 浏览器将`window` 对象实现为`Global` 对象的代理。因此，所有全局作用域中声明的变量和函数都变成了`window` 的属性。（window属性还不止这些）
* 一个函数在没有明确（通过成为某个对象的方法，或者通过`call()` /`apply()` ）指定`this` 值的情况下执行时，`this` 值等于`Global` 对象。因此，调用一个简单返回`this` 的函数是在任何执行上下文中获取`Global` 对象的通用方式。

```javascript
let global = function() { return this; }
console.log(global())
```

### Math

* ``Math``对象提供一些辅助计算的属性和方法。`Math` 对象上提供的计算要比直接在JavaScript实现的快得多，因为`Math` 对象上的计算使用了JavaScript引擎中更高效的实现和处理器指令。

```javascript
// Math对象的属性
Math.E      // 自然对数的基数e的值
Math.LN10   
Math.LN2
Math.LOG2E
Math.LOG10E
Math.PI
Math.SQRT1_2
Math.SQRT2
// Math对象的方法
// min()和max()方法用于确定一组数值中的最小最大值，这两个方法都接受任意多的参数
let a = [1,2,3]
console.log(Math.min(...a))
console.log(Math.max(...a))
// 小数值舍入为整数的方法
Math.ceil() 方法始终向上舍入为最接近的整数。
Math.floor() 方法始终向下舍入为最接近的整数。
Math.round() 方法执行四舍五入。
Math.fround() 方法返回数值最接近的单精度（32位）浮点值表示
// Math.random() 方法返回一个[0,1)范围内的随机数, 但如果是为了加密而需要生成随机数（传给生成器的输入需要较高的不确定性），那么建议使用window.crypto.getRandomValues() 
// 其他常用的方法
Math.abs(x)
Math.exp(x)
Math.expm1(x) // e^x - 1
Math.log(x)
Math.log1p(x) // 1 + ln(x)
Math.pow(x, power)
Math.hypot(...nums) // 一堆数平方和的平方根，多维欧式距离
Math.trunc(x) // 返回整数部分
Math.sqrt(x) 
Math.cbrt(x) // 立方根
Math.sin(x)
Math.cos(x)
Math.tan(x)
```

## 小结

JavaScript中的对象称为引用值，几种内置的引用类型可用于创建特定类型的对象。

- 引用值与传统面向对象编程语言中的类相似，但实现不同。
- `Date` 类型提供关于日期和时间的信息，包括当前日期、时间及相关计算。
- `RegExp` 类型是ECMAScript支持正则表达式的接口，提供了大多数基础的和部分高级的正则表达式功能。

JavaScript比较独特的一点是，函数实际上是`Function` 类型的实例，也就是说函数也是对象。因为函数也是对象，所以函数也有方法，可以用于增强其能力。

由于原始值包装类型的存在，JavaScript中的原始值可以被当成对象来使用。有3种原始值包装类型：`Boolean` 、`Number` 和`String` 。它们都具备如下特点。

- 每种包装类型都映射到同名的原始类型。
- 以读模式访问原始值时，后台会实例化一个原始值包装类型的对象，借助这个对象可以操作相应的数据。
- 涉及原始值的语句执行完毕后，包装对象就会被销毁。

当代码开始执行时，全局上下文中会存在两个内置对象：`Global` 和`Math` 。其中，`Global` 对象在大多数ECMAScript实现中无法直接访问。不过，浏览器将其实现为`window` 对象。所有全局变量和函数都是`Global` 对象的属性。`Math` 对象包含辅助完成复杂计算的属性和方法。

