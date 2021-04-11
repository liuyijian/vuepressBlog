# Chap6 集合引用类型

## Object

* Object很适合存储和在应用程序间交换数据
* 显式地创建Object实例有两种方式，一是使用new操作符和Object构造函数，二是使用字面量表示法

```javascript
// 方法一
let person = new Object();
person.name = 'Nicholas';
person.age = 29;

// 方法二, 推荐
let person = {
  name: "Nicholas"，
  age: 29
}
```

* 虽然属性一般是通过**点语法** 来存取的，这也是面向对象语言的惯例，但也可以使用中括号来存取属性。在使用中括号时，要在括号内使用属性名的字符串形式

## Array

* ECMAScript使用Array来存储一组有序的数据，但数组中每个槽位可以存储任意类型的数据；且数组是动态大小的，会随着数据添加而自动增长

### 创建数组

```javascript
let colors = new Array();
let colors = new Array(20); // 创建一个初始长度为20的数组
let colors = new Array("red", "blue", "green"); // 创建一个包含3个字符串的数组
let colors = Array(3); // 省略new操作符，结果是一样的
let colors = ["red", "blue", "green"]; // 使用字面量创建

// ES6 中新增了用于创建数组的静态方法:from()和of()，from()用于将类数组结构转换为数组实例，of()用于将一组参数转换为数组实例

// Array.from() 的第一个参数是一个类数组对象，或者有一个length 属性和可索引元素的结构。
// 字符串会被拆分为单字符数组
console.log(Array.from("Matt")); // ["M", "a", "t", "t"]
// 可以使用from()将集合和映射转换为一个新数组
const m = new Map().set(1, 2).set(3, 4);
const s = new Set().add(1).add(2).add(3).add(4);
console.log(Array.from(m)); // [[1, 2], [3, 4]]
console.log(Array.from(s)); // [1, 2, 3, 4]
// Array.from()对现有数组执行浅复制
const a1 = [1, 2, 3, 4];
const a2 = Array.from(a1);
console.log(a1);        // [1, 2, 3, 4]
alert(a1 === a2); // false
// 可以使用任何可迭代对象
const iter = {*[Symbol.iterator]() {yield 1;yield 2;yield 3;yield 4;}};
console.log(Array.from(iter)); // [1, 2, 3, 4]
// arguments对象可以被轻松地转换为数组
function getArgsArray() {return Array.from(arguments);}
console.log(getArgsArray(1, 2, 3, 4)); // [1, 2, 3, 4]
// from()也能转换带有必要属性的自定义对象
const arrayLikeObject = {0: 1, 1: 2, 2: 3, 3: 4, length: 4};
console.log(Array.from(arrayLikeObject)); // [1, 2, 3, 4]

//Array.from() 还接收第二个可选的映射函数参数。这个函数可以直接增强新数组的值，而无须像调用Array.from().map() 那样先创建一个中间数组。还可以接收第三个可选参数，用于指定映射函数中this 的值。但这个重写的this 值在箭头函数中不适用。
const a1 = [1, 2, 3, 4];
const a2 = Array.from(a1, x => x**2);
const a3 = Array.from(a1, function(x) {return x**this.exponent}, {exponent: 2});
console.log(a2);  // [1, 4, 9, 16]
console.log(a3);  // [1, 4, 9, 16]

//Array.of() 可以把一组参数转换为数组。用于替代在ES6之前常用的Array.prototype.slice.call(arguments) ，一种异常笨拙的将arguments 对象转换为数组的写法
console.log(Array.of(1, 2, 3, 4)); // [1, 2, 3, 4]
console.log(Array.of(undefined));  // [undefined]
```

### 数组空位

* 使用数组字面量初始化数组时，可以使用一串逗号来创建空位（hole）
* 由于行为不一致和存在性能隐患，因此实践中要避免使用数组空位。如果确实需要空位，则可以显式地用`undefined` 值代替

```javascript
const options = [1,,,,5];
// false, true, true, true, false
for (const option of options) {console.log(option === undefined);}
// map()会跳过空位置
console.log(options.map(() => 6));  // [6, undefined, undefined, undefined, 6]
// join()视空位置为空字符串
console.log(options.join('-'));  // "1----5"
```

### 数组索引

* 数组`length` 属性的独特之处在于，它不是只读的。通过修改`length` 属性，可以从数组末尾删除或添加元素``undefined``,一种便捷的末尾添加方法是``a[a.length]=new_value``
* 数组最多可以包含4294967295个元素

### 数组检测

* 如果网页里有多个框架，则可能涉及两个不同的全局执行上下文，因此就会有两个不同版本的`Array` 构造函数。如果要把数组从一个框架传给另一个框架，则这个数组的构造函数将有别于在第二个框架内本地创建的数组。
* 在一个全局作用上下文的情况下，使用`instanceof` 操作符就足矣；在多个全局上下文的情况下，使用``Array.isArray()``方法

### 迭代器方法

* 在ES6中，`Array` 的原型上暴露了3个用于检索数组内容的方法：`keys()` 、`values()` 和`entries()` 。
  * `keys()` 返回数组索引的迭代器
  * `values()` 返回数组元素的迭代器
  * `entries()` 返回索引/值对的迭代器

```javascript
const a = ["foo", "bar", "baz", "qux"];
console.log(Array.from(a.keys()));     // [0, 1, 2, 3]
console.log(Array.from(a.values()));   // ["foo", "bar", "baz", "qux"]
console.log(Array.from(a.entries()));  //[[0,"foo"], [1,"bar"], [2,"baz"], [3,"qux"]]
for (const [idx, element] of a.entries()) {
  alert(idx);
  alert(element);
}
```

### 复制和填充方法

* ES6新增了两个方法：批量复制方法``copyWithin()``，填充数组方法``fill()``
* 这两个方法都需要指定既有数组实例上的一个范围，包含开始索引，不包含结束索引。
* 使用这个方法不会改变数组的大小。
* 使用`fill()` 方法可以向一个已有的数组中插入全部或部分相同的值。开始索引用于指定开始填充的位置，它是可选的。如果不提供结束索引，则一直填充到数组末尾。负值索引从数组末尾开始计算。`fill()` 静默忽略超出数组边界、零长度及方向相反的索引范围
* 与`fill()` 不同，`copyWithin()` 会按照指定范围浅复制数组中的部分内容，然后将它们插入到指定索引开始的位置。开始索引和结束索引则与`fill()` 使用同样的计算方法，`copyWithin()` 静默忽略超出数组边界、零长度及方向相反的索引范围

```javascript
const zeroes = [0, 0, 0, 0, 0];

// 用5填充整个数组
zeroes.fill(5);
console.log(zeroes);  // [5, 5, 5, 5, 5]
zeroes.fill(0);       // 重置
// 用6填充索引大于等于3的元素
zeroes.fill(6, 3);
console.log(zeroes);  // [0, 0, 0, 6, 6]
zeroes.fill(0);       // 重置
// 用7填充索引大于等于1且小于3的元素
zeroes.fill(7, 1, 3);
console.log(zeroes);  // [0, 7, 7, 0, 0];
zeroes.fill(0);       // 重置
// 用8填充索引大于等于1且小于4的元素
// (-4 + zeroes.length = 1)
// (-1 + zeroes.length = 4)
zeroes.fill(8, -4, -1);
console.log(zeroes);  // [0, 8, 8, 8, 0];
zeroes.fill(0);       // 重置
// 索引过低，忽略
zeroes.fill(1, -10, -6);
console.log(zeroes);  // [0, 0, 0, 0, 0]
// 索引过高，忽略
zeroes.fill(1, 10, 15);
console.log(zeroes);  // [0, 0, 0, 0, 0]
// 索引反向，忽略
zeroes.fill(2, 4, 2);
console.log(zeroes);  // [0, 0, 0, 0, 0]
// 索引部分可用，填充可用部分
zeroes.fill(4, 3, 10)
console.log(zeroes);  // [0, 0, 0, 4, 4]

let ints, reset = () => ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
reset();
// 从ints中复制索引0开始的内容，插入到索引5开始的位置
// 在源索引或目标索引到达数组边界时停止
ints.copyWithin(5);
console.log(ints);  // [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]
reset();
// 从ints中复制索引5开始的内容，插入到索引0开始的位置
ints.copyWithin(0, 5);
console.log(ints);  // [5, 6, 7, 8, 9, 5, 6, 7, 8, 9]
reset();
// 从ints中复制索引0开始到索引3结束的内容
// 插入到索引4开始的位置
ints.copyWithin(4, 0, 3);
alert(ints);  // [0, 1, 2, 3, 0, 1, 2, 7, 8, 9]
reset();
// JavaScript引擎在插值前会完整复制范围内的值,因此复制期间不存在重写的风险
ints.copyWithin(2, 0, 6);
alert(ints);  // [0, 1, 0, 1, 2, 3, 4, 5, 8, 9]
reset();
// 支持负索引值，与fill()相对于数组末尾计算正向索引的过程是一样的
ints.copyWithin(-4, -7, -3);
alert(ints);  // [0, 1, 2, 3, 4, 5, 3, 4, 5, 6]
reset();
// 索引过低，忽略
ints.copyWithin(1, -15, -12);
alert(ints);  // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
reset()
// 索引过高，忽略
ints.copyWithin(1, 12, 15);
alert(ints);  // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
reset();
// 索引反向，忽略
ints.copyWithin(2, 4, 2);
alert(ints);  // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
reset();
// 索引部分可用，复制、填充可用部分
ints.copyWithin(4, 7, 10)
alert(ints);  // [0, 1, 2, 3, 7, 8, 9, 7, 8, 9];
```

### 转换方法

* 所有对象都有`toLocaleString()` 、`toString()` 和`valueOf()` 方法。其中，`valueOf()` 返回的还是数组本身。而`toString()` 返回由数组中每个值的等效字符串拼接而成的一个逗号分隔的字符串。也就是说，对数组的每个值都会调用其`toString()` 方法，以得到最终的字符串。
* 如果想使用不同的分隔符，则可以使用`join()` 方法。`join()` 方法接收一个参数，即字符串分隔符，返回包含所有项的字符串
* 如果数组中某一项是`null` 或`undefined` ，则在`join()` 、`toLocaleString()` 、`toString()` 和`valueOf()` 返回的结果中会以空字符串表示

```javascript
let colors = ["red", "green", "blue"];
alert(colors.toString());   // red,blue,green
alert(colors.valueOf());    // red,blue,green
alert(colors);              // red,blue,green  隐式调用数组的toString()方法
alert(colors.join("||"));    // red||green||blue
```

### 栈方法

* ECMAScript数组提供了`push()` 和`pop()` 方法，以实现类似栈的行为。
* `push()` 方法接收任意数量的参数，并将它们添加到数组末尾，返回数组的最新长度。
* `pop()` 方法则用于删除数组的最后一项，同时减少数组的`length` 值，返回被删除的项。

### 队列方法

* 这个数组方法叫`shift()` ，它会删除数组的第一项并返回它，然后数组长度减1。使用`shift()` 和`push()` ，可以把数组当成队列来使用
* `unshift()` 就是执行跟`shift()` 相反的操作：在数组开头添加任意多个值，然后返回新的数组长度。通过使用`unshift()` 和`pop()` ，可以在相反方向上模拟队列，即在数组开头添加新数据，在数组末尾取得数据

```javascript
let colors = new Array();                 // 创建一个数组
let count = colors.push("red", "green");  // 推入两项
alert(count);                             // 2
count = colors.push("black"); // 再推入一项
alert(count);                 // 3
let item = colors.shift();  // 取得第一项
alert(item);                // red
alert(colors.length);       // 2

let colors = new Array();                    // 创建一个数组
let count = colors.unshift("red", "green");  // 从数组开头推入两项
alert(count);                                // 2
count = colors.unshift("black");  // 再推入一项
alert(count);                     // 3
let item = colors.pop();  // 取得最后一项
alert(item);              // green
alert(colors.length);     // 2
```

### 排序方法

* `reverse()` 方法就是将数组元素反向排列
* 默认情况下，`sort()` 会按照升序重新排列数组元素，即最小的值在前面，最大的值在后面。为此，`sort()` 会在每一项上调用`String()` 转型函数，然后比较字符串来决定顺序。即使数组的元素都是数值，也会先把数组转换为字符串再比较、排序。
* 很明显，这在多数情况下都不是最合适的。为此，`sort()` 方法可以接收一个**比较函数** ，用于判断哪个值应该排在前面。比较函数接收两个参数，如果第一个参数应该排在第二个参数前面，就返回负值；如果两个参数相等，就返回0；如果第一个参数应该排在第二个参数后面，就返回正值

```javascript
let values = [1, 2, 3, 4, 5];
values.reverse();
alert(values);  // 5,4,3,2,1

let values = [0, 1, 5, 10, 15];
values.sort();
alert(values);  // 0,1,10,15,5

// 升序排序比较函数
function compare(value1, value2) {
  if (value1 < value2) {
    return -1;
  } else if (value1 > value2) {
    return 1;
  } else {
    return 0;
  }
}

let values = [0, 1, 5, 10, 15];
values.sort(compare);
alert(values);  // 0,1,5,10,15

// 降序排序比较函数简写
let values = [0, 1, 5, 10, 15];
values.sort((a, b) => a < b ? 1 : a > b ? -1 : 0);
alert(values); // 15,10,5,1,0

// 如果数组的元素是数值，或者是其valueOf()方法返回数值的对象，比较函数可以直接用第二个值减去第一个值
function compare(value1, value2){
  return value2 - value1;
}
```

### 操作方法

* `concat()` 方法可以在现有数组全部元素基础上创建一个新数组。它首先会创建一个当前数组的副本，然后再把它的参数添加到副本末尾，最后返回这个新构建的数组。如果传入一个或多个数组，则`concat()` 会把这些数组的每一项都添加到结果数组。如果参数不是数组，则直接把它们添加到结果数组末尾。打平数组参数的行为可以重写，方法是在参数数组上指定一个特殊的符号：`Symbol.isConcatSpreadable` 。这个符号能够阻止`concat()` 打平参数数组。相反，把这个值设置为`true` 可以强制打平类数组对象
* `slice()` 方法用于创建一个包含原有数组中一个或多个元素的新数组。`slice()` 方法可以接收一个或两个参数：返回元素的开始索引和结束索引。如果只有一个参数，则`slice()` 会返回该索引到数组末尾的所有元素。如果有两个参数，则`slice()` 返回从开始索引到结束索引对应的所有元素，其中不包含结束索引对应的元素。这个操作不影响原始数组
* `splice()` 的主要目的是在数组中间插入元素，但有3种不同的方式使用这个方法。
  * **删除** 。需要给`splice()` 传2个参数：要删除的第一个元素的位置和要删除的元素数量。可以从数组中删除任意多个元素，比如`splice(0, 2)` 会删除前两个元素。
  * **插入** 。需要给`splice()` 传3个参数：开始位置、0（要删除的元素数量）和要插入的元素，可以在数组中指定的位置插入元素。第三个参数之后还可以传第四个、第五个参数，乃至任意多个要插入的元素。比如，`splice(2, 0, "red", "green")` 会从数组位置2开始插入字符串`"red"` 和`"green"` 。
  * **替换** 。`splice()` 在删除元素的同时可以在指定位置插入新元素，同样要传入3个参数：开始位置、要删除元素的数量和要插入的任意多个元素。要插入的元素数量不一定跟删除的元素数量一致。比如，`splice(2, 1, "red", "green")` 会在位置2删除一个元素，然后从该位置开始向数组中插入`"red"` 和`"green"` 。
  * `splice()` 方法始终返回这样一个数组，它包含从数组中被删除的元素（如果没有删除元素，则返回空数组）。

```javascript
let colors = ["red", "green", "blue"];
let colors2 = colors.concat("yellow", ["black", "brown"]);
console.log(colors2);  // ["red", "green", "blue", "yellow", "black", "brown"]
let newColors = ["black", "brown"];
newColors[Symbol.isConcatSpreadable] = false;
let colors2 = colors.concat("yellow", newColors);
console.log(colors2);  // ["red", "green", "blue", "yellow", ["black", "brown"]]

let colors = ["red", "green", "blue", "yellow", "purple"];
let colors2 = colors.slice(1);
let colors3 = colors.slice(1, 4);
alert(colors2);  // green,blue,yellow,purple
alert(colors3);  // green,blue,yellow

let colors = ["red", "green", "blue"];
let removed = colors.splice(0,1);  // 删除第一项
alert(colors);                     // green,blue
alert(removed);                    // red，只有一个元素的数组
removed = colors.splice(1, 0, "yellow", "orange");   // 在位置1插入两个元素
alert(colors);                                       // green,yellow,orange,blue
alert(removed);                                      // 空数组
removed = colors.splice(1, 1, "red", "purple");  // 插入两个值，删除一个元素
alert(colors);                                   // green,red,purple,orange,blue
alert(removed);                                  // yellow，只有一个元素的数组
```

### 搜索和位置方法

* ECMAScript提供了3个严格相等的搜索方法：`indexOf()` 、`lastIndexOf()` 和`includes()` 。
  * 这些方法都接收两个参数：要查找的元素和一个可选的起始搜索位置。`indexOf()` 和`includes()` 方法从数组前头（第一项）开始向后搜索，而`lastIndexOf()` 从数组末尾（最后一项）开始向前搜索。
  * `indexOf()` 和`lastIndexOf()` 都返回要查找的元素在数组中的位置，如果没找到则返回-1。`includes()` 返回布尔值，表示是否至少找到一个与指定元素匹配的项。在比较第一个参数跟数组每一项时，会使用全等（`===` ）比较，也就是说两项必须严格相等。

* ECMAScript也允许按照定义的断言函数搜索数组，每个索引都会调用这个函数。断言函数的返回值决定了相应索引的元素是否被认为匹配。
  * 断言函数接收3个参数：元素、索引和数组本身。其中元素是数组中当前搜索的元素，索引是当前元素的索引，而数组就是正在搜索的数组。断言函数返回真值，表示是否匹配。
  * `find()` 和`findIndex()` 方法使用了断言函数。这两个方法都从数组的最小索引开始。`find()` 返回第一个匹配的元素，`findIndex()` 返回第一个匹配元素的索引。这两个方法也都接收第二个可选的参数，用于指定断言函数内部`this` 的值。找到匹配项后，这两个方法都不再继续搜索。

```javascript
let numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];
alert(numbers.indexOf(4));          // 3
alert(numbers.lastIndexOf(4));      // 5
alert(numbers.includes(4));         // true
alert(numbers.indexOf(4, 4));       // 5
alert(numbers.lastIndexOf(4, 4));   // 3
alert(numbers.includes(4, 7));      // false

const people = [{name: "Matt", age: 27}, {name: "Nicholas",age: 29}];
alert(people.find((element, index, array) => element.age < 28)); // {name: "Matt", age: 27}
alert(people.findIndex((element, index, array) => element.age < 28)); // 0
```

### 迭代方法

* ECMAScript为数组定义了5个迭代方法。每个方法接收两个参数：以每一项为参数运行的函数，以及可选的作为函数运行上下文的作用域对象（影响函数中`this` 的值）。传给每个方法的函数接收3个参数：数组元素、元素索引和数组本身。
  * `every()` ：对数组每一项都运行传入的函数，如果对每一项函数都返回`true` ，则这个方法返回`true` 
  * `filter()` ：对数组每一项都运行传入的函数，函数返回`true` 的项会组成数组之后返回。
  * `forEach()` ：对数组每一项都运行传入的函数，没有返回值。
  * `map()` ：对数组每一项都运行传入的函数，返回由每次函数调用的结果构成的数组。
  * `some()` ：对数组每一项都运行传入的函数，如果有一项函数返回`true` ，则这个方法返回`true` 。

```javascript
let numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];

let everyResult = numbers.every((item, index, array) => item > 2);
alert(everyResult);  // false

let someResult = numbers.some((item, index, array) => item > 2);
alert(someResult);   // true

let filterResult = numbers.filter((item, index, array) => item > 2);
alert(filterResult);  // 3,4,5,4,3

let mapResult = numbers.map((item, index, array) => item * 2);
alert(mapResult);  // 2,4,6,8,10,8,6,4,2

numbers.forEach((item, index, array) => {
  // 执行某些操作
});
```

### 归并方法

* ECMAScript为数组提供了两个归并方法：`reduce()` 和`reduceRight()` ，这两个方法都会迭代数组的所有项，并在此基础上构建一个最终返回值。
* `reduce()` 方法从数组第一项开始遍历到最后一项。
* `reduceRight()` 从最后一项开始遍历至第一项。

* 这两个方法都接收两个参数：对每一项都会运行的归并函数，以及可选的以之为归并起点的初始值。传给`reduce()` 和`reduceRight()` 的函数接收4个参数：上一个归并值、当前项、当前项的索引和数组本身。
* 这个函数返回的任何值都会作为下一次调用同一个函数的第一个参数。如果没有给这两个方法传入归并起点值，则传给归并函数的第一个参数是数组的第一项，第二个参数是数组的第二项。

```javascript
let values = [1, 2, 3, 4, 5];

let sum = values.reduce((prev, cur, index, array) => prev + cur);
alert(sum);  // 15

let sum = values.reduceRight(function(prev, cur, index, array){ return prev + cur;});
alert(sum); // 15
```

## 定型数组

* 定型数组（typed array）是ECMAScript新增的结构，目的是提升向原生库传输数据的效率。
* ArrayBuffer：所有定型数组及视图引用的基本单位
  * `ArrayBuffer()` 是一个普通的JavaScript构造函数，可用于在内存中分配特定数量的字节空间。
  * `ArrayBuffer` 一经创建就不能再调整大小，但可以使用`slice()` 复制其全部或部分到一个新实例中
  * `ArrayBuffer` 某种程度上类似于C++的`malloc()` ，但也有几个明显的区别
    * `ArrayBuffer` 在分配失败时会抛出错误
    * 分配的内存不能超过`Number.MAX_SAFE_INTEGER` 字节
    * 声明`ArrayBuffer` 则会将所有二进制位初始化为0
    * 通过声明`ArrayBuffer` 分配的堆内存可以被当成垃圾回收，不用手动释放
    * 不能仅通过对`ArrayBuffer` 的引用就读取或写入其内容。要读取或写入`ArrayBuffer` ，就必须通过视图。

### DataView

* DataView：一种允许读写`ArrayBuffer` 的视图。这个视图专为文件I/O和网络I/O设计，其API支持对缓冲数据的高度控制，但相比于其他类型的视图性能也差一些。`DataView` 对缓冲内容没有任何预设，也不能迭代。必须在对已有的`ArrayBuffer` 读取或写入时才能创建`DataView` 实例。这个实例可以使用全部或部分`ArrayBuffer` ，且维护着对该缓冲实例的引用，以及视图在缓冲中开始的位置。

```javascript
const buf = new ArrayBuffer(16);

// DataView默认使用整个ArrayBuffer
const fullDataView = new DataView(buf);
alert(fullDataView.byteOffset);      // 0
alert(fullDataView.byteLength);      // 16
alert(fullDataView.buffer === buf);  // true

// 构造函数接收一个可选的字节偏移量和字节长度
//   byteOffset=0表示视图从缓冲起点开始
//   byteLength=8限制视图为前8个字节
const firstHalfDataView = new DataView(buf, 0, 8);
alert(firstHalfDataView.byteOffset);      // 0
alert(firstHalfDataView.byteLength);      // 8
alert(firstHalfDataView.buffer === buf);  // true

// 如果不指定，则DataView会使用剩余的缓冲
//   byteOffset=8表示视图从缓冲的第9个字节开始
//   byteLength未指定，默认为剩余缓冲
const secondHalfDataView = new DataView(buf, 8);
alert(secondHalfDataView.byteOffset);      // 8
alert(secondHalfDataView.byteLength);      // 8
alert(secondHalfDataView.buffer === buf);  // true
```

* 要通过`DataView` 读取缓冲，还需要几个组件。
  * 首先是要读或写的字节偏移量。可以看成`DataView` 中的某种“地址”。
  * `DataView` 应该使用`ElementType` 来实现JavaScript的`Number` 类型到缓冲内二进制格式的转换。
  * `DataView` 的所有API方法都以大端字节序作为默认值，但接收一个可选的布尔值参数，设置为`true` 即可启用小端字节序。
  * `DataView` 完成读、写操作的前提是必须有充足的缓冲区，否则就会抛出`RangeError`
  * `DataView` 在写入缓冲里会尽最大努力把一个值转换为适当的类型，后备为0。如果无法转换，则抛出错误

```javascript
// 在内存中分配两个字节并声明一个DataView
const buf = new ArrayBuffer(2);
const view = new DataView(buf);

// ECMAScript6支持8种不同的ElementType：Int8，Uint8，Int16，Uint16，Int32，Uint32，Float32，Float64；通过使用get/set前缀作为DataView实例的方法

// 说明整个缓冲确实所有二进制位都是0
// 检查第一个和第二个字符
alert(view.getInt8(0));  // 0
alert(view.getInt8(1));  // 0
// 检查整个缓冲
alert(view.getInt16(0)); // 0

// 将整个缓冲都设置为1
// 255的二进制表示是11111111（2^8 - 1）
view.setUint8(0, 255);

// DataView会自动将数据转换为特定的ElementType
// 255的十六进制表示是0xFF
view.setUint8(1, 0xFF);

// 现在，缓冲里都是1了
// 如果把它当成二补数的有符号整数，则应该是-1
alert(view.getInt16(0)); // -1
```

### 定型数组

* 定型数组是另一种形式的ArrayBuffer视图，遵循系统原生的字节序，提供了适用面更广的API和更高的性功能
* 设计定型数组的目的是提高与WebGL等原生库交换二进制数据的效率，JavaScript引擎可以重度优化算术运算，按位运算等对定型数组的常见操作
* 创建定型数组的方式包括读取已有的缓冲、使用自有缓冲、填充可迭代结构，以及填充基于任意类型的定型数组。另外，通过`<ElementType>.from()` 和`<ElementType>.of()` 也可以创建定型数组

```javascript
// 创建一个12字节的缓冲
const buf = new ArrayBuffer(12);
// 创建一个引用该缓冲的Int32Array
const ints = new Int32Array(buf);
// 这个定型数组知道自己的每个元素需要4字节
// 因此长度为3
alert(ints.length); // 3

// 创建一个长度为6的Int32Array
const ints2 = new Int32Array(6);
// 每个数值使用4字节，因此ArrayBuffer是24字节
alert(ints2.length);             // 6
// 类似DataView，定型数组也有一个指向关联缓冲的引用
alert(ints2.buffer.byteLength);  // 24

// 创建一个包含[2, 4, 6, 8]的Int32Array
const ints3 = new Int32Array([2, 4, 6, 8]);
alert(ints3.length);            // 4
alert(ints3.buffer.byteLength); // 16
alert(ints3[2]);                // 6

// 通过复制ints3的值创建一个Int16Array
const ints4 = new Int16Array(ints3);
// 这个新类型数组会分配自己的缓冲
// 对应索引的每个值会相应地转换为新格式
alert(ints4.length);            // 4
alert(ints4.buffer.byteLength); // 8
alert(ints4[2]);                // 6

// 基于普通数组来创建一个Int16Array
const ints5 = Int16Array.from([3, 5, 7, 9]);
alert(ints5.length);            // 4
alert(ints5.buffer.byteLength); // 8
alert(ints5[2]);                // 7

// 基于传入的参数创建一个Float32Array
const floats = Float32Array.of(3.14, 2.718, 1.618);
alert(floats.length);            // 3
alert(floats.buffer.byteLength); // 12
alert(floats[2]);                // 1.6180000305175781
```

* 定型数组的构造函数和实例都有一个`BYTES_PER_ELEMENT` 属性，返回该类型数组中每个元素的大小
* 如果定型数组没有用任何值初始化，则其关联的缓冲会以0填充

```javascript
alert(Int16Array.BYTES_PER_ELEMENT);  // 2
alert(Int32Array.BYTES_PER_ELEMENT);  // 4

const ints = new Int32Array(1), floats = new Float64Array(1);

alert(ints.BYTES_PER_ELEMENT);        // 4
alert(floats.BYTES_PER_ELEMENT);      // 8

const ints = new Int32Array(4);
alert(ints[0]);  // 0
alert(ints[1]);  // 0
alert(ints[2]);  // 0
alert(ints[3]);  // 0
```

* 定型数组与普通数组都很相似。定型数组支持较多操作符、方法和属性
* 定型数组同样使用数组缓冲来存储数据，而数组缓冲无法调整大小，下列方法**不适用**于定型数组：concat(), pop(), push(), shift(), splice(), unshift()
* 定型数组也提供了两个新方法，可以快速向外或向内复制数据：`set()` 和`subarray()`
  * `set()` 从提供的数组或定型数组中把值复制到当前定型数组中指定的索引位置
  * `subarray()` 会基于从原始定型数组中复制的值返回一个新定型数组

```javascript
// 创建长度为8的int16数组
const container = new Int16Array(8);
// 把定型数组复制为前4个值
// 偏移量默认为索引0
container.set(Int8Array.of(1, 2, 3, 4));
console.log(container);  // [1,2,3,4,0,0,0,0]
// 把普通数组复制为后4个值
// 偏移量4表示从索引4开始插入
container.set([5,6,7,8], 4);
console.log(container);  // [1,2,3,4,5,6,7,8]

// 溢出会抛出错误
container.set([5,6,7,8], 7);
// RangeError

const source = Int16Array.of(2, 4, 6, 8);

// 把整个数组复制为一个同类型的新数组
const fullCopy = source.subarray();
console.log(fullCopy);  // [2, 4, 6, 8]

// 从索引2开始复制数组
const halfCopy = source.subarray(2);
console.log(halfCopy);  // [6, 8]

// 从索引1开始复制到索引3
const partialCopy = source.subarray(1, 3);
console.log(partialCopy);  // [4, 6]
```

* 定型数组不会考虑上下溢出的问题，请自行解决，具体形式不表

## Map

### 基本API

* 作为ES6的新增特性，`Map` 是一种新的集合类型，为这门语言带来了真正的键/值存储机制
* 如果想在创建的同时初始化实例，可以给`Map` 构造函数传入一个可迭代对象，需要包含键/值对数组
* 初始化之后，可以使用`set()` 方法再添加键/值对。另外，可以使用`get()` 和`has()` 进行查询，可以通过`size` 属性获取映射中的键/值对的数量，还可以使用`delete()` 和`clear()` 删除值
* `Map` 可以使用任何JavaScript数据类型作为键

```javascript
// 使用嵌套数组初始化映射
const m1 = new Map([
  ["key1", "val1"],
  ["key2", "val2"],
  ["key3", "val3"]
]);
alert(m1.size); // 3
// 使用自定义迭代器初始化映射
const m2 = new Map({
  [Symbol.iterator]: function*() {
    yield ["key1", "val1"];
    yield ["key2", "val2"];
    yield ["key3", "val3"];
  }
});
alert(m2.size); // 3

const m = new Map();

alert(m.has("firstName"));  // false
alert(m.get("firstName"));  // undefined

m.set("firstName", "Matt")
 .set("lastName", "Frisbie"); // set() 方法返回映射实例，因此可以把多个操作连起来，包括初始化

alert(m.has("firstName")); // true
alert(m.get("firstName")); // Matt
alert(m.size);             // 2

m.delete("firstName");     // 只删除这一个键/值对

alert(m.has("firstName")); // false
alert(m.has("lastName"));  // true

m.clear(); // 清除这个映射实例中的所有键/值对

alert(m.has("firstName")); // false
alert(m.has("lastName"));  // false
alert(m.size);             // 0
```

* 与严格相等一样，在映射中用作键和值的对象及其他“集合”类型，在自己的内容或属性被修改时仍然保持不变
* SameValueZero比较也可能导致意想不到的冲突；SameValueZero是ECMAScript规范新增的相等性比较算法。关于ECMAScript的相等性比较，可以参考MDN文档中的文章“Equality Comparisons and Sameness”

```javascript
const m = new Map();

const objKey = {},
      objVal = {},
      arrKey = [],
      arrVal = [];

m.set(objKey, objVal);
m.set(arrKey, arrVal);

objKey.foo = "foo";
objVal.bar = "bar";
arrKey.push("foo");
arrVal.push("bar");

console.log(m.get(objKey)); // {bar: "bar"}
console.log(m.get(arrKey)); // ["bar"]

const m = new Map();

const a = 0/"", // NaN
      b = 0/"", // NaN
      pz = +0,
      nz = -0;

alert(a === b);   // false
alert(pz === nz); // true

m.set(a, "foo");
m.set(pz, "bar");

alert(m.get(b));  // foo
alert(m.get(nz)); // bar
```

### 顺序与迭代

* `Map` 实例会维护键值对的插入顺序，因此可以根据插入顺序执行迭代操作。映射实例可以提供一个迭代器（`Iterator` ），能以插入顺序生成`[key, value]` 形式的数组。可以通过`entries()` 方法取得这个迭代器
* 因为`entries()` 是默认迭代器，所以可以直接对映射实例使用扩展操作``...m``，把映射转换为数组
* 如果不使用迭代器，而是使用回调方式，则可以调用映射的`forEach(callback, opt_thisArg)` 方法并传入回调，依次迭代每个键/值对。传入的回调接收可选的第二个参数，这个参数用于重写回调内部`this` 的值
* `keys()` 和`values()` 分别返回以插入顺序生成键和值的迭代器；键和值在迭代器遍历时是可以修改的，但映射内部的引用则无法修改。当然，这并不妨碍修改作为键或值的对象内部的属性，因为这样并不影响它们在映射实例中的身份

```javascript
const m1 = new Map([
  ["key1", "val1"]
]);

// 作为键的字符串原始值是不能修改的
for (let key of m1.keys()) {
  key = "newKey";
  alert(key);             // newKey
  alert(m1.get("key1"));  // val1
}

const keyObj = {id: 1};

const m = new Map([
  [keyObj, "val1"]
]);

// 修改了作为键的对象的属性，但对象在映射内部仍然引用相同的值
for (let key of m.keys()) {
  key.id = "newKey";
  alert(key);            // {id: "newKey"}
  alert(m.get(keyObj));  // val1
}
alert(keyObj);           // {id: "newKey"}
```

### 选择Object还是Map

* 内存占用：给定固定大小的内存，`Map` 大约可以比`Object` 多存储50%的键/值对
* 插入性能：向`Object` 和`Map` 中插入新键/值对时，Map稍快一点
* 查找性能：若仅包含少量键值对，``Object``查询速度更快
* 删除性能：若涉及大量删除操作，``Map``是更好的选择

## WeakMap

* ECMAScript 6新增的“弱映射”（`WeakMap` ）是一种新的集合类型，为这门语言带来了增强的键/值对存储机制。`WeakMap` 是`Map` 的“兄弟”类型，其API也是`Map` 的子集。`WeakMap` 中的“weak”（弱），描述的是JavaScript垃圾回收程序对待“弱映射”中键的方式
* WeakMap的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放对象占用的内存
* WeakMap只有四个方法可以使用：get(),set(),has(),delete()，没有遍历方法和清空方法
* WeakMap应用的典型场合就是Dom节点作为键名，另一个用处是部署私有属性
* 更多用法请参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap

## Set

* 使用`new` 关键字和`Set` 构造函数可以创建一个空集合，如果想在创建的同时初始化实例，则可以给`Set` 构造函数传入一个可迭代对象，其中需要包含插入到新集合实例中的元素
* 初始化之后，可以使用`add()` 增加值，使用`has()` 查询，通过`size` 取得元素数量，以及使用`delete()` 和`clear()` 删除元素
* `add()` 返回集合的实例，所以可以将多个添加操作连缀起来，包括初始化
* `add()` 和`delete()` 操作是幂等的。`delete()` 返回一个布尔值，表示集合中是否存在要删除的值

* `Set` 会维护值插入时的顺序，因此支持按顺序迭代

## WeakSet

* 弱集合中的值只能是`Object` 或者继承自`Object` 的类型，尝试使用非对象设置值会抛出`TypeError` 

## 迭代与扩展操作

* ECMAScript 6新增的迭代器和扩展操作符对集合引用类型特别有用。`Array`、所有定型数组、`Map `, `Set`原生集合类型定义了默认迭代器，意味着上述所有类型都支持顺序迭代，都可以传入`for-of` 循环

## 小结

JavaScript中的对象是引用值，可以通过几种内置引用类型创建特定类型的对象。

- 引用类型与传统面向对象编程语言中的类相似，但实现不同。
- `Object` 类型是一个基础类型，所有引用类型都从它继承了基本的行为。
- `Array` 类型表示一组有序的值，并提供了操作和转换值的能力。
- 定型数组包含一套不同的引用类型，用于管理数值在内存中的类型。
- `Date` 类型提供了关于日期和时间的信息，包括当前日期和时间以及计算。
- `RegExp` 类型是ECMAScript支持的正则表达式的接口，提供了大多数基本正则表达式以及一些高级正则表达式的能力。

JavaScript比较独特的一点是，函数其实是`Function` 类型的实例，这意味着函数也是对象。由于函数是对象，因此也就具有能够增强自身行为的方法。

因为原始值包装类型的存在，所以JavaScript中的原始值可以拥有类似对象的行为。有3种原始值包装类型：`Boolean` 、`Number` 和`String` 。它们都具有如下特点。

- 每种包装类型都映射到同名的原始类型。
- 在以读模式访问原始值时，后台会实例化一个原始值包装对象，通过这个对象可以操作数据。
- 涉及原始值的语句只要一执行完毕，包装对象就会立即销毁。

JavaScript还有两个在一开始执行代码时就存在的内置对象：`Global` 和`Math` 。其中，`Global` 对象在大多数ECMAScript实现中无法直接访问。不过浏览器将`Global` 实现为`window` 对象。所有全局变量和函数都是`Global` 对象的属性。`Math` 对象包含辅助完成复杂数学计算的属性和方法。

ECMAScript 6新增了一批引用类型：`Map` 、`WeakMap` 、`Set` 和`WeakSet` 。这些类型为组织应用程序数据和简化内存管理提供了新能力。

