# Chap3 语言基础

## 语法

* 区分大小写：ECMAScript中，无论是变量、函数名、操作符都区分大小写
* 标识符：即变量、函数、属性、函数参数的名称
  * 可由单个或多个下列字符组成：首字符必须是字母、下划线或美元符号，剩下的字符可以是字母、下划线、美元符号或数字
  * 标识符一般采用小驼峰形式：如``myCar``
* 注释：单行注释以``//``开头，块注释以``/*``开头，以``*/``结尾
* 严格模式：ECMAScript5增加了这个概念，严格模式对不安全的活动将抛出错误，启用时，需要在脚本开头加上``"use strict";``，若单独指定一个函数在严格模式下执行，只需要将该预处理指令放到函数体开头即可，所有现在浏览器都支持严格模式
* 语句：语句用分号结尾，代码块用大括号括起来，提高清晰度，避免出错的可能性

## 关键字与保留字

* 关键字有特殊用途，不能用作标识符或属性名，ES6规定的所有关键字如下：

```javascript
break do in typeof case else instanceof var catch export new void class extends return while const finally super with continue for switch yield debugger function this default if throw delete import try 
```

* 保留字同样不能用作标识符或属性名，是保留给将来做关键字用的

```javascript
// 始终保留
enum 
// 严格模式下保留
implements package public interface protected static let private
// 模块代码中保留
await
```

## 变量

* ECMAScript变量是松散类型的，即变量可以用于保存任何类型的数据。有3个关键字可以声明变量：`var` 、`const` 和`let` 。其中，`var` 在ECMAScript的所有版本中都可以使用，而`const` 和`let` 只能在ECMAScript 6及更晚的版本中使用。
* ECMAScript 6增加`let` 和`const` 从客观上为这门语言更精确地声明作用域和语义提供了更好的支持。
* 最佳实践是不使用var，const优先，let次之

### var

* `var` 操作符定义的变量会成为包含它的函数的局部变量，该变量将在函数退出时被销毁
* 若在函数内定义变量时省略`var` 操作符，可以创建一个全局变量（不推荐，严格模式下会报错）
* 定义多个变量时，可以使用逗号分隔：``var message="hi",age=29;``
* var声明提升，在于将所有变量声明都拉到函数作用域的顶部，故下面的代码不会报错，只会输出undefined

```javascript
function foo() {
  console.log(age);
  var age = 26;
}
foo();  // undefined
```

### let

* `let` 声明的范围是块作用域，而`var` 声明的范围是函数作用域

```javascript
if (true) {
  var name = 'Matt';
  console.log(name); // Matt
}
console.log(name);   // Matt

if (true) {
  let age = 26;
  console.log(age);   // 26
}
console.log(age);     // ReferenceError: age没有定义

// for循环 变量外渗
for (var i = 0; i < 5; ++i) {
    setTimeout(() => console.log(i), 0) // 所有的i都指向一个变量，会输出 5，5，5，5，5
}


for (let i = 0; i < 5; ++i) {
    setTimeout(() => console.log(i), 0) // 会输出0、1、2、3、4
}

```

* `let` 也不允许同一个块作用域中出现冗余声明

```javascript
var name;
var name;

let age;
let age;  // SyntaxError；标识符age已经声明过了
```

* `let` 声明的变量不会在作用域中被提升

```javascript
// name会被提升
console.log(name); // undefined
var name = 'Matt';

// age不会被提升
console.log(age); // ReferenceError：age没有定义
let age = 26;
```

* 使用`let` 在全局作用域中声明的变量不会成为`window` 对象的属性（`var` 声明的变量则会），

```javascript
var name = 'Matt';
console.log(window.name); // 'Matt'

let age = 26;
console.log(window.age);  // undefined
let age;  // SyntaxError；标识符age已经声明过了
```

### const

* `const` 的行为与`let` 基本相同，唯一一个重要的区别是用它声明变量时必须同时初始化变量，且尝试修改`const` 声明的变量会导致运行时错误。

```javascript
const age = 26;
age = 36; // TypeError: 给常量赋值
// const也不允许重复声明
const name = 'Matt';
const name = 'Nicholas'; // SyntaxError

// const声明的作用域也是块
const name = 'Matt';
if (true) {
  const name = 'Nicholas';
}
console.log(name); // Matt
```

* `const` 声明的限制只适用于它指向的变量的引用。换句话说，如果`const` 变量引用的是一个对象，那么修改这个对象内部的属性并不违反`const` 的限制。

```javascript
const person = {};
person.name = 'Matt';  // ok
```

* const不能用于声明迭代变量，但能声明一个在循环中不会被修改的变量

```javascript
for (const i = 0; i < 10; ++i) {} // TypeError：给常量赋值
for (const key in {a: 1, b: 2}) { console.log(key); } // a,b
for (const value of [1,2,3]) { console.log(value); } // 1, 2, 3
```

## 数据类型

* ECMAScript的数据类型
  * 6种简单数据类型（原始类型 ）：`Undefined` 、`Null` 、`Boolean` 、`Number` 、`String` 和`Symbol` 
  * 1种复杂数据类型：``Object``
* typeof操作符用于确定任意变量的数据类型，对一个值使用typeof操作符会返回下列字符串之一
  * ``undefined``：表示值未定义
  * ``boolean``：表示值为布尔值
  * ``string``：表示值为字符串* 
  * ``number``：表示值为数值
  * ``object``：表示值为对象（不是函数）或null
  * ``function``：表示值为函数
  * ``symbol``：表示值为符号

### Undefined

* ``Undefined``类型只有一个值，就是特殊值``undefined``
* 当使用var或let声明了变量但没有初始化时，就相当于给变量赋于了``undefined``值
* 增加这个特殊值的目的是为了正式明确控对象指针（null）和未初始化变量的区别
* 建议声明变量时同时进行初始化，因为对未声明变量使用typeof操作符同样会返回undefined，这样会无法区分是未声明还是声明未初始化，但可以通过``if(variable)``的方式区分，未声明的变量会直接运行时报错

### Null

* Null类型只有一个值，就是特殊值``null``，null值表示一个空对象指针，故``typeof null``会返回object
* 定义将来要保存对象值的变量时，建议使用`null` 来初始化，便于后续检查是否被重新赋予一个对象的引用
* undefined值是由null值派生而来的，表面值是相等的

```javascript
let car = null;
let age;

if (car != null){
  // car是一个对象的引用
}

if (car) {
  // 这个块不会执行
}
```

### Boolean类型

* Boolean类型有两个字面值：true和false（注意，是小写）
* 可以使用``Boolean()``转型函数将任意类型数据转为布尔值，if等流控制语句会自动执行隐式转换

| 数据类型  | 转化为true的值         | 转化为false的值 |
| --------- | ---------------------- | --------------- |
| Boolean   | true                   | false           |
| String    | 非空字符串             | ""(空字符串)    |
| Number    | 非零数值（包括无穷值） | 0、NaN          |
| Object    | 任意对象               | null            |
| Undefined | N/A (不存在)           | undefined       |

### Number类型

* Number类型使用IEEE 754格式表示整数和浮点值

```javascript
let intNum = 5; // 十进制整数
let octalNum = 0o70; // 八进制值（前导0o）
let hexNum = 0xA; // 十六进制值（前导0x，字母大小写均可）
let floatNum1 = 1.1; // 浮点值存储空间是整数的两倍
let floatNum2 = 1.0; // 小数点后是零或没有数字，都会被当作整数处理
let floatNum3 = 5.2e-7 // 科学计数法表示浮点数
```

* ECMAScript可以表示的值具有一定范围

```javascript
// 最大最小值保存在这两个常量中
Number.MAX_VALUE  Number.MIN_VALUE
// 某个计算结果若超出可表示范围，会自动转换为特殊的无穷值（-Infinity, Infinity）
Number.POSITIVE_INFINITY Number.NEGATIVE_INFINITY
```

* 有一个特殊数值叫NaN，意思是“不是数值”，用于表示本来要返回数值的操作失败了（而不是抛出错误），任何涉及NaN的操作始终返回NaN，NaN不等于任何值，可通过isNaN()函数检测

```javascript 
console.log(0/0); // NaN
console.log(-0/+0); // NaN
console.log(5/0); // Infinity
console.log(5/-0); //-Infinity
console.log(NaN == NaN); // false

// isNaN()函数，会先调用对象的valueof()方法，然后确定返回的值是否可以转换为数值，不能，再调用toString()方法，并测试其返回值
console.log(isNaN(NaN)); 		 // true
console.log(isNaN(10));      // false，10是数值
console.log(isNaN("10"));    // false，可以转换为数值10
console.log(isNaN("blue"));  // true，不可以转换为数值
console.log(isNaN(true));    // false，可以转换为数值1
```

* 数值转换的3个函数：``Number()``，``parseInt()``，``parseFloat()``

```javascript
// Number()函数的转换规则如下：布尔值true 1 false 0，数值则直接返回，null返回0，undefined返回NaN，若为字符串，忽略前导0，若是有效的数值字符、浮点字符返回对应数值，若是空串返回0，若包含其他诡异字符，返回NaN；若为对象，则先调用valueOf()方法，再根据上述规则转换返回的值
let num1 = Number(true); // 1
let num2 = Number(null); // 0
let num3 = Number(undefined); // NaN
let num4 = Number("000011"); // 11
let num5 = Number(""); // 0
let num6 = Number("Hello World"); // NaN

// parseInt() 函数更专注于字符串是否包含数值模式。字符串最前面的空格会被忽略，从第一个非空格字符开始转换。如果第一个字符不是数值字符、加号或减号，parseInt() 立即返回NaN。如果第一个字符是数值字符、加号或减号，则继续依次检测每个字符，直到字符串末尾，或碰到非数值字符。
let num1 = parseInt(""); // NaN
let num2 = parseInt("1.1"); // 1
let num3 = parseInt("0xA"); // 10
let num4 = parseInt("AF", 16); // 175 (指定进制数则可省略0x前缀)
let num4 = parseInt("123red"); //123

// parseFloat() 函数的工作方式从位置0开始检测每个字符。同样，它也是解析到字符串末尾或者解析到一个无效的浮点数值字符为止。parseFloat() 只解析十进制值，因此不能指定底数
let num1 = parseFloat("123red"); // 123
let num2 = parseFloat("3.2.1"); // 3.2
let num3 = parseFloat("3.2e2"); // 320
let num4 = parseFloat("08.5");  // 8.5
```

### String类型

* 字符串可以使用双引号、单引号、反引号(模版字面量)括起来；下面是一些有其他用途的字符字面量（长度为1）；ECMAScript中的字符串是不可变的（immutable），修改就需要销毁加新建

```javascript
\n 		// 换行
\t 		// 制表
\b 		// 退格
\r		// 回车
\f		// 换页
\\		// 反斜杠
\'		// 单引号
\"		// 双引号
\`		// 反引号
\xnn	// 以16进制编码nn表示的字符
\unnnn	// 以十六进制编码nnnn表示的Unicode字符
```

* 转换为字符串的两种方式：``toString()``方法和``String()``函数

```javascript
// toString()方法可用于数值，布尔值，对象，字符串值；null和undefined没有这个方法，toString()方法可接受一个进制参数（默认为10），例子如下
let num=10;
console.log(num.toString()); // "10"
console.log(num.toString(16)); // "a"

// String()函数遵循如下规则，若值有toString()方法，则调用该方法并返回结果，若值为null，返回null，若值为undefined，返回undefined
console.log(String(null)); // null
console.log(String(undefined)); // undefined
```

* ECMAScript 6 新增了使用模版字面量定义字符串的能力（可跨行定义字符串，但会保持反引号内部的空格，注意缩进）

```javascript
let templateLiteral = `first line
second line`;

let pageHTML = `<div>
	<span>Tracy</span>
</div>`;
```

* 模版字面量的最常用特性是支持字符串插值，通过`${}`中使用一个JS表达式实现；在定义时立即求值并转换为字符串实例，任何插入的变量从最近的作用域中取值，所有插入的值都会使用toString()强制转型为字符串

```javascript
let value = 5;
let exponent = 'second';
let TemplateLiteral = `${value} to the ${exponent} power is ${value * value}`;

function capitalize(word){ return `${word[0].toUpperCase()}${word.slice(1)}` };
function duplicate(word){ return `${word}${word}`};
console.log(`${capitalize('hello')}`); // Hello
console.log(`${duplicate('hello')}`); // hellohello
```

* 模版字面量也支持定义标签函数，通过标签函数可以自定义插值行为。可以使用默认的String.raw标签函数直接获取原始的字面量内容，而非转义后的

```javascript
let a = 6;
let b = 9;

function simpleTag(strings, aValExpression, bValExpression, sumExpression) {
  console.log(strings);
  console.log(aValExpression);
  console.log(bValExpression);
  console.log(sumExpression);
  return 'foobar';
}

let untaggedResult = `${ a } + ${ b } = ${ a + b }`;
let taggedResult = simpleTag`${ a } + ${ b } = ${ a + b }`;
// ["", " + ", " = ", ""]
// 6
// 9
// 15

console.log(untaggedResult);   // "6 + 9 = 15"
console.log(taggedResult);     // "foobar"

// 使用剩余操作符收集可变的参数列表，并拼接出原来的字符串
function ZipTag(strings, ...expressions) {
  return strings[0] + expressions.map((e, i) => `${e}${strings[i + 1]}`).join('');
}

// String.raw标签函数
console.log(`\u00A9`);            // ©
console.log(String.raw`\u00A9`);  // \u00A9
```

### Symbol类型

* Symbol是ECMAScript6新增的数据类型。符号是原始值，且符号实例是唯一、不可变的。符号的用途是确保对象属性使用唯一标识符，不会发生属性冲突的危险。
* 过分复杂，不展开讲，[细节参考这里] (https://es6.ruanyifeng.com/#docs/symbol)

### Object类型

```javascript
let o = new Object();
```

* 每个`Object` 实例都有如下属性和方法。
  - `constructor` ：用于创建当前对象的函数。在前面的例子中，这个属性的值就是`Object()` 函数。
  - `hasOwnProperty(propertyName)` ：用于判断当前对象实例（不是原型）上是否存在给定的属性。要检查的属性名必须是字符串（如`o.hasOwnProperty("name")` ）或符号。
  - `isPrototypeOf(object)` ：用于判断当前对象是否为另一个对象的原型。（第8章将详细介绍原型。）
  - `propertyIsEnumerable(propertyName)` ：用于判断给定的属性是否可以使用（本章稍后讨论的）`for-in` 语句枚举。与`hasOwnProperty()` 一样，属性名必须是字符串。
  - `toLocaleString()` ：返回对象的字符串表示，该字符串反映对象所在的本地化执行环境。
  - `toString()` ：返回对象的字符串表示。
  - `valueOf()` ：返回对象对应的字符串、数值或布尔值表示。通常与`toString()` 的返回值相同。

## 操作符

### 一元操作符

* 递增/递减操作符：++a, --a, a++,a--
* 一元加和减：+a，-a

### 位操作符

* 按位与``&``
* 按位或``|``
* 按位异或``^``
* 左移``<<``
* 有符号右移``>>``
* 无符号右移(符号位置可能变化)``>>>``

### 布尔操作符

* 逻辑非``!``
* 逻辑与``&&``：若第一个操作数为对象，则返回第二个操作数；如果第二个操作数是对象，则只有第一个操作数求值为`true` 才会返回该对象不一定返回布尔值！！
* 逻辑或``||``：若第一个操作数为对象，则返回第一个操作数；若第一个操作数求值为false，则返回第二个操作数，此特性常用于变量的赋值，不一定返回布尔值！！

### 乘性操作符

* 乘法操作符``*``
* 除法操作符``/``
* 取模操作符``%``

### 指数操作符

* 指数操作符``**``：ECMAScript 7 新增，等价于以前的``Math.pow()``函数

### 加性操作符

* 加法操作符`+`
* 减法操作符``-``

### 关系操作符

* 小于 ``<``
* 大于``>``
* 小于等于``<=``
* 大于等于``>=``

### 相等操作符

* 等于和不等于``==, !=``：先进行强制类型转换，再确定操作数是否相等

  * 在转换操作数的类型时，相等和不相等操作符遵循如下规则

    - 如果任一操作数是布尔值，则将其转换为数值再比较是否相等。`false` 转换为0，`true` 转换为1
    - 如果一个操作数是字符串，另一个操作数是数值，则尝试将字符串转换为数值，再比较是否相等
    - 如果一个操作数是对象，另一个操作数不是，则调用对象的`valueOf()` 方法取得其原始值，再根据前面的规则进行比较

    在进行比较时，这两个操作符会遵循如下规则。

    - `null` 和`undefined` 相等
    - `null` 和`undefined` 不能转换为其他类型的值再进行比较
    - 如果有任一操作数是`NaN` ，则相等操作符返回`false` ，不相等操作符返回`true` 。记住：即使两个操作数都是`NaN` ，相等操作符也返回`false` ，因为按照规则，`NaN` 不等于`NaN` 。
    - 如果两个操作数都是对象，则比较它们是不是同一个对象。如果两个操作数都指向同一个对象，则相等操作符返回`true` 。否则，两者不相等

* 全等和不全等``===, !==``:不进行类型转换的对比（推荐使用这个保持数据类型的完整性）

### 条件操作符

* ``a = (num1 > num2) ? num1 : num2``

### 赋值操作符

* 简单赋值``=``：将右边的值赋给左边的变量
* 复合赋值``*= /= %= += -= <<= >>= >>>= ``：仅是一种简写，不会提升性能

### 逗号操作符

* 用于一条语句中执行多个操作：``let num1 = 1, num2 = 2;``

## 语句

### if语句

```javascript
// 推荐写成以下语句块的形式
if (condition1){
  ...
} else if (condition2){
  ...
} else {
  ...
}
```

### do-while语句

```javascript
// 后测试循环语句，至少执行一次
do {
  statement
} while (expression);
```

### while语句

```javascript
// 先测试循环语句，可能不执行循环体
while (expression) {
  statement
}
```

### for语句

```javascript
for (initialization; expression; post-loop-expression){
  statement
}
```

### for-in语句

```javascript
// 枚举对象中的非符号键属性，只保证都会返回一次，但不保证顺序一致
for (property in expression) {
	statement
}
```

### for-of语句

```javascript
// 用于遍历可迭代对象的元素， ES2018增加了for-await-of循环，以支持生成promise的异步可迭代对象
for (property of expression){
  statement
}
```

### 标签语句、break、continue语句

```javascript
// break 和 continue 正常 是跳出一层循环，重新进入该层循环，但搭配标签语句后，可实现任意层的跳转
let num = 0;

outermost:
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    if (i == 5 && j == 5) {
      break outermost;
    }
    num++;
  }
}

console.log(num); // 55

let num = 0;

outermost:
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    if (i == 5 && j == 5) {
      continue outermost;
    }
    num++;
  }
}

console.log(num); // 95
```

###with语句

```javascript
// with语句的用途是将代码作用域设定为特定的对象，但严格模式不允许使用with语句，会影响性能！
with(location) {
  let hostName = hostname;
  let url = href;
}

// 等价表示
let hostName = location.hostname;
let url = location.href;
```

### switch语句

```javascript
// 类C，但条件的值不一定是常量
switch (expression){
	case value1:
		statement1;
		break;
	case value2:
		statement2;
		break;
	default:
		statement;
}
```

## 函数

* 不需要指定函数的返回值，因为任何函数可以在任何时候返回任何值
* 不指定返回值的函数实际上返回特殊值undefined

