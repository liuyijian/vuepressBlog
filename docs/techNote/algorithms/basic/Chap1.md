# Chap 1 递归与分治

#### 整数划分

将正整数 $n$ 表示成一系列正整数之和 $n = n_1 + n_2 + \dots + n_k \ \ \ \ s.t. \ \ n_1 \geq n_2 \geq \dots \geq n_k \geq 1, k \geq 1$

正整数 $n$ 的一个这种表示称为正整数 $n$ 的一个划分，记 $p(n)$ 为正整数 $n$ 的不同的划分个数



解：

在 $n$ 的所有不同的划分中，将最大加数 $n_1$ 不大于 $m$ 的划分个数记作 $q(n,m)$, 而 $p(n) = q(n,n)$

有递归关系如下:

* $q(n, 1) = 1$ :  任何正整数只有一种划分形式 $n = 1+1+ \dots + 1$

* $q(n, m) = q(n, n) \ \ s.t. m \geq n$ : 最大加数实际上不能大于$n$ 

* $q(n, n) = 1 + q(n, n-1)$ : 

* $q(n, m) = q(n, m-1) + q(n-m, m)$ : 不大于 $m$ 的划分由 $n_1 \leq m-1$ 和 $n_1 = m$ 组成

有递归函数如下：

$q(n,m)=\left\{
\begin{array}{rcl}
1       &      & {n=1,m=1}\\
q(n,n)     &      & {n \lt m}\\
1+ q(n,n-1)     &      & {n = m}\\
q(n,m-1)+q(n-m,m)       &      & {n \gt m \gt 1}
\end{array} \right.$

#### 汉诺塔

###### 三柱汉诺塔

![image-20200324111847564](https://tva1.sinaimg.cn/large/007S8ZIlly1gjux2sfs5sj30ai05udgk.jpg)

规则：每次移动一个圆盘，任意时刻不允许大圆盘压在小圆盘上

问题：从A到B的移动次数 + 移动过程

解答：

若 $n=1$ , 则移动一次 $A \rightarrow B$ 即可

若 $n = k$，则将其分解成三个操作，一是将 $k-1$ 个盘借助 $B$ 移动到 $C$，二是将最大的盘从 $A$ 移到 $B$，三是借助 $A$ 将 $k-1$ 个盘从 $C$ 移到 $B$

故递归函数如下：

$T(n)=\left\{
\begin{array}{rcl}
1       &      & {n=1}\\
2 \times T(n-1)+1     &      & {n \gt 1}\\
\end{array} \right.$

故 $T(n) = 2^{n} - 1$

Python 实现如下：

```python
from dataclasses import dataclass

@dataclass
class Hanoi:
    name: str
    count: int

def move(n, A, B):
    print('第{}个块从{}移到{}'.format(n, A.name, B.name))

def hanoi(n, A, B, C):
    if n > 0:
        hanoi(n-1, A, C, B)
        move(n, A, B)
        hanoi(n-1, C, B, A)

n = int(input('个数：'))
A = Hanoi('A', n)
B = Hanoi('B', 0)
C = Hanoi('C', 0)

hanoi(n, A, B, C)
```

###### 四柱汉诺塔

算法：1941 Frame

1、将A柱上部分的n-r个碟子通过C柱和D柱移到B柱上 ($F(n-r)$ 步)

2、将A柱上剩余的n个碟子通过C柱移到D柱上 ($2^{r}-1$ 步)

3、将B柱上的n-r个碟子通过A柱和C柱移到D柱上 ($F(n-r)$ 步)

递归方程如下： 

$F(n) = min (2 \times F(n-r) + 2^{r} - 1) \ \ \ s.t. \ \ 1 \leq r \leq n$

2004年的一篇[论文](http://www.wanfangdata.com.cn/details/detail.do?_type=perio&id=bjdxxb200401014)证明了 $r = \lfloor \frac{\sqrt{8n+1}-1}{2} \rfloor$ 时，取到最小值

###### 多柱汉诺塔

留坑

#### 大整数乘法

![image-20200324121753654](https://tva1.sinaimg.cn/large/007S8ZIlly1gjux2wa2axj30hc036aab.jpg)

$XY = AC * 2^n + ((A-B)(D-C) + AC + BD) 2^{n/2} + BD$

上式可知进行了 3次n/2位整数的乘法（AC，BD，(A-B)(D-C)），6次加减法 和 2次移位，故有递推式如下：

$T(n)=\left\{
\begin{array}{rcl}
O(1)       &      & {n=1}\\
3T(n/2) + O(n)     &      & {n \gt 1}\\
\end{array} \right.$

解得 $T(n) = O(n^{\log 3})$， 与传统乘法的 $O(n^2)$ 相比，有了较大提升

#### Strassen矩阵乘法

考虑n阶方阵的乘法运算 $C_{n} = A_{n} * B_{n}$； 传统方法使用 $c_{ij} = \sum\limits_{k=1}^{n}a_{ik}b_{kj}$，算法复杂度为 $O(n^3)$

考虑 $n$ 是 $2$ 的幂，重写矩阵乘法为：$\begin{bmatrix} C_{11} & C_{12} \\ C_{21} & C_{22} \end{bmatrix}  = \begin{bmatrix} A_{11} & A_{12} \\ A_{21} & A_{22} \end{bmatrix} \quad \begin{bmatrix} B_{11} & B_{12} \\ B_{21} & B_{22} \end{bmatrix}$

下面的传统分治策略使用了8次乘法4次加法

$\begin{gathered} C_{11} = A_{11}B_{11}+A_{12}B_{21} \quad C_{12} = A_{11}B_{12}+A_{12}B_{22} \quad C_{21} = A_{21}B_{11}+A_{22}B_{21} \quad C_{22} = A_{21}B_{12}+A_{22}B_{22} \\ \\ T(n)=\left\{
\begin{array}{rcl}
O(1)       &      & {n=2}\\
8T(n/2) + O(n^2)     &      & {n \gt 2}\\
\end{array} \right.\end{gathered}$        

递归下去还是$O(n^3)$的复杂度，没有改进

Strassen提出了7次乘法的方法， 得到 $T(n) = O(n^{\log 7})$， 有很大改进

$M_1 = A_{11}(B_{12}-B_{22}) \\ M_2 = (A_{11}+A_{12})B_{22} \\ M_3 = (A_{21}+A_{22})B_{11} \\ M_4 = A_{22}(B_{21}-B_{11}) \\ M_5=(A_{11}+A_{22})(B_{11}+B_{22}) \\ M_6 = (A_{12}-A_{22})(B_{21}+B_{22}) \\ M_7 = (A_{11} - A_{21})(B_{11}+B_{12}) \\ C_{11} = M_5 + M_4 - M_2 + M_6 \\ C_{12} = M_1 + M_2 \\ C_{21} = M_3 + M_4 \\ C_{22} = M_5 + M_1 - M_3 - M_7$

目前最好的计算时间上界是 $O(n^{2.376})$,最好下界是它的平凡上界 $\Omega(n^2)$

#### 棋盘覆盖

在 $2^k \times 2^k$个方格的棋盘中，缺失一个方格，使用L型骨牌覆盖棋盘，求解一种覆盖方式

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gjux30ubbuj30kq0kcabo.jpg" style="zoom:50%;" />

考虑在中间放置一块L型牌，将一个$2^k$ 边长的缺失棋盘分割成4个$2^{k-1}$的缺失棋盘

递归方程为：$T(k)=\left\{
\begin{array}{rcl}
O(1)       &      & {k=0}\\
4T(k-1) + O(1)     &      & {k \gt 0}\\
\end{array} \right.$，解得 $T(k) = O(4^k)$，为渐进意义下的最优算法

#### 线性时间选择

给定线性序集中 $n$ 个元素和整数 $k$ ， $1 \leq k \leq n$ ，要求找出 $n$ 个元素中第 $k$ 小的元素

当 k = 1 或 k = n 时，即为找最大最小值，可以在 $O(n)$ 时间内找出

当 $k \geq n - \frac{n}{\log n}$ 和 $k \leq \frac{n}{\log n}$ 时，通过最大堆或最小堆排序算法，能在 $O(n +k \log n) = O(n)$时间内找出

考虑一般情况，使用快排中的切分法，每次找正确的一半，也能在 $O(n)$ 中的时间给出正确答案

```python
def partition(a, start, end):
  '使第j个位置拥有正确的数'
  i = start
  j = end + 1
  x = a[start]
  while True:
    while a[++i] < x
    while a[--j] > x
    if i >= j:
      break
    a[i], a[j] = a[j], a[i]
  a[start] = a[j]
  a[j] = x
  return j

def quicksort(a, start, end):
  '先搞定第j个位置，再处理前面和后面的位置'
  if start < end:
    q = partition(a, start, end)
    quicksort(a, start, q-1)
    quicksort(a, q+1, end)


def randomizedPartition(a, start, end):
  i = Random(start, end)
  a[i], a[start] = a[start], a[i]
  return partition(a, start, end)

def randomizedSelect(a, start, end, k):
  if start == end:
    return a[start]
  i = randomizedPartition(a, start, end)
  j = i - start + 1
  if k <= j:
    return randomizedSelect(a, start, i, k)
  else:
    return randomizedSelect(a, i+1, end, k)
 
# 计算第k小的数
randomizedSelect(a, 0, n-1, k)
```

#### 最接近点对问题

设有 $n$ 个点，若两两计算距离，则时间复杂度为$O(n^2)$ 

考虑  $n$ 个点的横坐标中位数是 $x_m$, 用垂线 $l: x=x_m$ 将点集分割为大小大致相等的两个子集 $S_1 = \{p \in S \  \vert \  x(p) \leq m\}$和 $S_2 = \{p \in S \ \vert \ x(p) \gt m\}$ 

递归处理 $S_1$ 和 $S_2$ ，分别得到 $S_1$ 和 $S_2$ 中的最小距离 $d_1$ 和 $d_2$ ，$d = \min(d_1,d_2)$

若 $S$ 的最近点对 $(p,q)$ 之间的距离小于 $d$ ，则 $ p, q$ 不在同一点集中，给定 $p$ ,则 $q$ 必定落在一个$d \times 2d$ 矩形 $R$ 中

![image-20200324173204453](https://tva1.sinaimg.cn/large/007S8ZIlly1gjux354mylj30ue0bw400.jpg)

由 $d$ 的意义可知，$ P_2$中任何两个 $S$ 中的点的距离都不小于 $d$，我们将矩形 $R$ 的长边三等份，短边二等分，形成6个小区域，若矩形 $R$  中有多于 6个 $S$ 中的点，则根据抽屉原理，必定存在一个抽屉，有两个点，而同一抽屉中最大距离为对角线，长度为 $\frac{5}{6}d$ ，矛盾，故最多只有6个点需要检验。在分治法的合并中，我们最多需要检查 $6 \times \frac{n}{2} = 3n$ 个候选者，而不是 $\frac{n}{2} \times \frac{n}{2} = \frac{n^2}{4}$个 ，故时间复杂度递推式为 $T(n)=\left\{
\begin{array}{rcl}
O(1)       &      & {n \lt 4}\\
2T(n/2) + O(n)     &      & {n \geq 4}\\
\end{array} \right.$

易得 $T(n) = O(n\log n)$， 为渐进意义下的最优算法

