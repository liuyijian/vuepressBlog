# Chap 2  动态规划

 #### 矩阵连乘

考虑 $A = A_1A_2 \dots A_n$

设 计算 $A[i:j] = A_iA_{i+1}\dots A_j$所需的最少数乘次数为 $m[i][j]$

$ m[i,j]=\left\{
\begin{array}{rcl}
0       &      & {i=j}\\
\min\limits_{i \leq k \leq j} \{m[i][k] + m[k+1][j] + p_{i-1}p_kp_j\}     &      & {i \lt j}\\
\end{array} \right. $

依据递归式自底向上的方式进行计算，计算过程中，使用备忘录算法，保存已解决的子问题答案，避免递归重复。

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gjux1xo19tj30vs0bmjtp.jpg" alt="image-20200324184026685" style="zoom:50%;" /> 

```python
def matrixChain(p, n, m, s):
  '''
  从1开始计数
  m为n*n的矩阵，m[i,j]记录A_i* ... * A_j 的最小总数乘次数；
  s为n*n矩阵，s[i,j]记录最佳切分位置
  p为n维向量，p[i]记录A_i和A_j的连接维数
  '''
  
  for i in range(1,n+1):
    m[i][i] = 0
  for r in range(2, n+1):
    for i in range(1, n-r):
      j = i + r - 1
      m[i][j] = m[i+1][j] + p[i-1]*p[i]*p[j]
      s[i][j] = i
      for k in range(i+1, j):
        t = m[i][k] + m[k+1][j] + p[i-1]*p[k]* p[j]
        if t < m[i][j]:
          m[i][j] = t
          s[i][j] = k

def traceback(i, j, s):
  '输出最优次序，带括号'
  if i < j:
    print('(')
    traceback(i, s[i][j], s)
    print(')(')
    traceback(s[i,j]+1, j, s)
    print(')')
  elif i == j:
    print('A_{}'.format(i))
  else:
    pass
```

#### 最长公共子序列

* 给定序列 $X = \{x_1,x_2, \dots x_m\}$，$Z = \{z_1,z_2, \dots z_k\}$ ，称$Z$ 是 $X$ 的子序列，即存在一个严格递增下标序列 $\{i_1,i_2, \dots i_k\}$ 使得对于所有 $j = 1, 2, \dots k$， 有 $z_j = x_{i_j}$

* 当序列 $Z$ 既是 $X$ 的子序列，也是 $Y$ 的子序列，则 $Z$ 是 $X$ 和 $Y$ 的公共子序列
* 最长公共子序列具有最优子结构性质



设序列 $X = \{ x_1, x_2, \dots x_m\}$ 和 $Y = \{y_1, y_2, \dots y_n\}$ 的最长公共子序列为 $Z=\{z_1,z_2, \dots z_k\}$，则有以下性质：

* 若 $x_m = y_n$，则 $z_k = x_m = y_n$ ，且 $Z_{k-1}$ 是 $X_{m-1}$ 和 $Y_{n-1}$ 的最长公共子序列
* 若 $x_m \neq y_n$，且 $z_k \neq x_m$ ，则 Z 是 $X_{m-1}$ 和 $Y$ 的最长公共子序列
* 若 $x_m \neq y_n$，且 $z_k \neq y_n$ ，且  Z 是 $X$ 和 $Y_{n-1}$ 的最长公共子序列

记 $c[i][j]$ 为 $X_i$ 和 $Y_j$ 的最长公共子序列的长度，有递归关系如下：

$ c[i][j]=\left\{
\begin{array}{rcl}
0       &      & {i=0,j=0}\\ c[i-1][j-1]+1    &      & {i, j > 0; x_i = y_j}\\ \max\{c[i][j-1], c[i-1][j]\} & & i,j \gt 0; x_i \neq y_j \end{array} \right. $

```python
def LCSLength(m, n, X, Y, c, b):
  '''
  b记录路径，c记录长度
  此算法时间复杂度为 O(mn)
  '''
  for i in range(1, m+1):
    c[i][0] = 0
  for i in range(1, n+1):
    c[0][i] = 0
  for i in range(1, m+1):
    for j in range(1, n+1):
      if x[i] == y[j]:
        c[i][j] = c[i-1][j-1] + 1
        b[i][j] = 'leftup'
      elif c[i-1][j] >= c[i][j-1]:
        c[i][j] = c[i-1][j]
        b[i][j] = 'up'
      else:
        c[i][j] = c[i][j-1]
        b[i][j] = 'left'

def LCS(i, j, X, b):
  '''
  打印最长公共子序列，时间复杂度为 O(m+n)
  '''
  if i == 0 or j == 0:
    return
  if b[i][j] == 'leftup':
    LCS(i-1, j-1, X, b)
    print(X[i])
  elif b[i][j] == 'top':
    LCS(i-1, j, X, b)
  else:
    LCS(i, j-1, X, b)
```

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gjux1t3kygj30l60gm40o.jpg" alt="image-20200324225847774" style="zoom:50%;" />

* 若仅考虑长度，则可以省去数组 $b$ ，且用两行的数组空间就可以计算，再进一步分析，可以将空间需求减到 $O(\min \{m, n\})$

#### 最长递增子序列

```python
def LIS(li):
  'O(n^2), 只给长度，不给序列本身'
  if len(li) == 0:
    return 0
  else:
    dp = [0] * len(li)
    dp[0] = 1
    for i in range(1, len(li)):
      tmax = 1
      for j in range(0,i):
        if li[i] > li[j]:
          tmax = max(tmax, dp[j]+1)
      dp[i] = tmax
    print(dp)
    print('最长递增子序列的长度为' + str(max(dp)))
    return max(dp)

def LIS(li):
  'O(nlogn), 只给长度，不给序列本身'
  if li:
    tmpList = [li[0]]
    for item in li:
      if item > tmpList[-1]:
        tmpList.append(item)
      else:
        pos = bisect.bisect_left(tmpList, item)
        tmpList[pos] = item
    return len(tmpList)
  return 0
```



#### 最大子段和

给定 $n$ 个整数组成的序列 $a_1, a_2, \dots, a_n$ ，求该序列形如 $\sum\limits_{k=i}^{j}a_k$ 的子段和的最大值，即 $\max \{0, \max \limits_{1 \leq i \leq j \leq n}{\sum\limits_{k=i}^{j}{a_k}}\}$ 

计算所有可能性将使时间复杂度达到 $O(n^3)$ ，稍微的优化可以将其达到 $O(n^2)$ ,如下：

```python
def maxSum(n, a, best_i, best_j):
  sum = 0
  for i in range(1, n+1):
    thisSum = 0
    for j in range(i, n+1):
      thisSum += a[j]
      if thisSum > sum:
        sum = thisSum
        best_i = i
        best_j = j
  return sum
```

考虑时间复杂度为 $T(n) = O(n\log n)$的分治算法对应的三种情形

* $a[1:n]$的最大子段和与 $a[1:\frac{n}{2}]$ 的最大子段和相同
* $a[1:n]$的最大子段和与 $a[\frac{n}{2}+1:n]$ 的最大子段和相同

* $a[1:n]$的最大子段和为 $a[i:j]$，满足 $1 \leq i \leq \frac{n}{2}, \  \frac{n}{2}+1 \leq j \leq n$

前两种情况可递归求得，第三种情形中，最大子段和等于两边最大子段和的和，即 $s = s_1+s_2$

考虑时间复杂度为 $T(n) = O(n)$ 的动态规划算法

记 $b[j] = \max \limits_{1 \leq i \leq j}\{\sum\limits_{k=i}^{j}a[k]\} \quad s.t. 1 \leq j\leq n$，有最优子结构 $b[j] = \max \{a[j], \ b[j-1]+a[j] \}$，初始的最大子段和默认为 $sum = b[0] = 0$，每次有新的 $b[j]$，都拿去比一比，把较大的存起来，代码如下：

```python
def maxSum(n, a):
    _sum = 0
    b = 0
    for i in range(1, n+1):
        b = b + a[i] if b > 0 else a[i]
        _sum = max(_sum, b)
    return _sum
```

#### 最大子矩阵和问题

给定整数矩阵 $A_{m \times n}$，求一个子矩阵，使其各元素之和最大，即 $\max \limits_{1 \leq i_1 \leq i_2 \leq m \\ 1 \leq j_1 \leq j_2 \leq n} s(i_1,i_2,j_1,j_2) = \sum\limits_{i=i_1}^{i_2} \sum \limits_{j=j_1}^{j_2}a[i][j]$

直接枚举的时间复杂度是$O(m^2n^2)$，可以借助一维情形的最大子段和问题来优化，时间复杂度为 $O(mn^2)$

```python
import numpy as np
def maxSum2(a):
  _sum = 0
  b = np.zeros(n+1)
  for i in range(1, m+1):
    for k in range(1, n+1):
      b[k] = 0
    for j in range(i, m+1):
      for k in range(1, n+1):
        b[k] += a[j][k]
      # 调用上题写好的函数,本质是将特定范围的列先按行求和聚合成一列，再转化为一维情形
      _max = maxSum(n, b) 
      if _max > _sum:
        _sum = _max
  return _sum
```

上述算法在按行求和聚合的时候，出现了大量的重复计算，可以用下述方法将时间复杂度优化优化成 $O(mn)$ ：

* $a = [1, 3, 2, 4, 6]$
* 先用 $O(n)$ 时间累加一次结果 $b = [1, 4, 6, 10, 16]$
* 只需 $O(1)$ 时间即可计算 $\sum\limits_{k = i}^{j}a[k] = b[j] - b[i]$

#### 电路连线

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gjux25lldyj30hc05kq3t.jpg" alt="image-20200325163633881" style="zoom:50%;" />

导线 $(i, \pi (i))$ 将上端接线柱 $i$ 与 下端接线柱 $\pi(i)$ 相连

两条导线相交的充要条件是 $(i-j)(\pi(i)-\pi(j))> 0 \quad s.t. \quad 1 \leq i \lt j \leq n$

求导线集的最大不相交子集



记 $N(i,j) = \{t \vert (t,\pi(t)) \in Nets, t \leq i, \pi(t) \leq j\}$ 的最大不相交子集为 $MNS(i,j)$，其大小记为 $S(i,j)$

当 $i=1$时， $ MNS(i,j)= N(i,j) = \left\{
\begin{array}{rcl}
\varnothing       &      & {j \lt \pi(1)}\\
\{(1,\pi(1))\}     &      & {j \geq \pi(1)}\\
\end{array} \right. $

当 $i \gt 1$时:

* $j \lt \pi(i)$ ，此时 $(i, \pi(i)) \notin N(i,j)$，故此时 $N(i,j) = N(i-1, j)$，$S(i,j) = S(i-1,j)$

* $j \geq \pi(i)$ 

  * 若 $(i, \pi(i)) \in MNS(i,j)$ ，则对任意 $(t, \pi(t)) \in MNS(i,j)$ ，有 $t \lt i$ 且 $\pi(t) \lt \pi(i)$ ，否则会相交；所以 $MNS(i,j) - \{(i,\pi(i))\}  = MNS(i-1, \pi(i)-1)$ 

  * 若 $(i, \pi(i)) \notin MNS(i,j)$ ，则对任意 $(t, \pi(t)) \in MNS(i,j)$ ，有 $t \lt i$ 且 $\pi(t) \lt \pi(i)$ ，从而 $MNS(i,j) \subseteq N(i-1,j)$ , $S(i,j) \leq S(i-1,j)$，另一方面，$MNS(i-1,j) \subseteq N(i,j)$ ，$S(i-1,j) \leq S(i-1,j)$，结合二者可得 $S(i,j) = S(i-1,j)$ 

故有最优子结构如下：

当 $i=1$时， $ S(i,j)= \left\{
\begin{array}{rcl}
0       &      & {j \lt \pi(1)}\\
1     &      & {j \geq \pi(1)}\\
\end{array} \right. $

当 $i \gt 1$时， $ S(i,j)= \left\{
\begin{array}{rcl}
S(i-1,j)       &      & {j \lt \pi(i)}\\
\max \{S(i-1,j), \quad S(i-1,\pi(i)-1)+1 \}     &      & {j \geq \pi(i)}\\
\end{array} \right. $

计算最大不相交子集的基数的时间复杂度为 $O(n^2) $，回溯求具体解再会用$O(n)$的时间

思考：最少可以切分为几个子集，使得每个子集的线均不交叉？

#### 流水作业调度

作业集 $T_m = \{t_1,t_2, \dots, t_m\}$ 需要依次经历工序集 $M_n = \{m_1, m_2, \dots, m_n \}$ ，时间成本矩阵 $C_{m \times n}$ 中，其中$c_{ij}$表示作业 $t_i$ 在工序 $m_j$ 中的耗时，注意，每道工序同时只能运行一个作业，当某工序处理完作业但下一个作业仍处于上一道工序时，将会出现闲置的情况。求作业集的最优调度顺序，使得总耗时最少。



考虑 n = 2 的简单情况

从直观上讲，一个最优调度应该使$m_1$没有空闲时间，$m_2$ 空闲时间最少，考虑 S 是 N的作业子集，在一般情况下，机器 $m_1$ 开始加工 $S$ 中的作业时，机器 $m_2$  还在加工其他作业，需要等时间 $t$ 后才能利用，记该情况下完成 $S$ 中作业所需的最短时间为 $T(S,t)$，流水作业调度问题的最优值为 $T(T_m, 0)$

设 $\pi = \{\pi_1, \pi_2, \dots, \pi_m\}$ 是作业集 $T_m$ 的一个最优调度，它所需的加工时间为 $c_{\pi_1,1}+T'$，其中 $T'$是工序 $m_2$ 的等待时间为$c_{\pi_1, 2}$ 时，安排作业 $\pi_2, \dots, \pi_m$所需的时间，记 $S=T_m-\{\pi_1\}$，则有 $T'=T(S,c_{\pi_1,2 })$ 

流水作业问题具有最优子结构：$T(T_m,0) = \min\limits_{1 \leq i \leq m}\{c_{i,1}+T(T_m-\{i\}, \ \  c_{i,2})\}$

推广到一般情形：$T(S,t) = \min \limits_{i \in S}{\{c_{i,1}+T(S-\{i\},c_{i,2}+\max\{t-c_{i,1},0\}\}}$

其中，$\max\{t-c_{i,1},0\}$ 这一项是由于在机器$m_2$上，作业 $i$ 必须在 $\max\{t,c_{i,1}\}$ 后才能开工，故在机器$m_1$ 完成作业 $i$ 之后，机器还需 $c_{i,2}+\max\{t-c_{i,1},0\}\}$ 才能完成对作业 $i$ 的加工

考虑一个最优调度中，前两个任务是 $i,j$，由动态递归可知：

$T(S,t)=c_{i,1}+T(S-\{i\}, c_{i,2}+\max\{t-c_{i,1},0\}) = c_{i,1}+c_{j,1}+T(S-\{i,j\}, t_{ij})$

$\begin{align} t_{ij} &= c_{j,2} + \max\{c_{i,2} + \max \{t-c_{i,1},0\}-c_{j,1}, \  0\} \\ &= c_{j,2}+ c_{i,2} - c_{j,1} + \max\{\max\{t-c_{i,1}, \ 0\}, \ 0\}, \ c_{j,1}-c_{i,2} \}\\ &= c_{j,2}+ c_{i,2} - c_{j,1} -c_{i,1} + \max\{t, \ c_{i,1}+c_{j,1}-c_{i,2},c_{i,1}\}\\ \end{align}$

观察式子，若作业 $i, j$满足Johnson不等式： $\min \{c_{i,2}, c_{j,1}\} \geq \min \{c_{j,2}, c_{i,1}\}$，则有推理过程如下

$c_{i,1}+c_{j,1}+\max\{-c_{i,2}, -c_{j,1}\} \leq c_{i,1}+c_{j,1}+\max\{-c_{j,2}, -c_{i,1}\}$ 

$\max\{t, \ c_{i,1}+c_{j,1}-c_{i,2},c_{i,1}\} \leq \max\{t, \ c_{j,1}+c_{i,1}-c_{j,2},c_{j,1}\}$

$t_{ij} \leq t_{ji}$

$T(S,t) \leq T(S',t)$

这意味着当作业 $i, j$ 不满足Johnson不等式时，通过交换它们的加工顺序，使其满足Johnson不等式，且不增加加工时间，故对于流水作业调度问题，必存在一个最优调度为满足 Johnson法则的调度，进一步可以证明，调度满足Johnson法则等价于 $\min \{c_{\pi(i),2}, c_{\pi(j),1}\} \geq \min \{c_{\pi(j),2}, c_{\pi(i),1}\}  \quad s.t. \forall i \lt j$，故任意两个满足Johnson法则的调度具有相同的加工时间。

下面时间复杂度为$O(n\log n)$的算法用于构造一个满足Johnson法则的调度

* 令 $N_1 = \{i \ \vert \  c_{i,1} \lt c_{i,2}\}$，$N_2 = \{i \ \vert \ c_{i,1} \geq c_{i,2}\}$

* 将 $N_1$ 中作业依照 $c_{i,1}$增序排列，将 $N_2$ 中作业依照 $c_{i,2}$减序排列
* $N_1$ 中作业接上 $N_2$ 中作业即为满足Johnson法则的最优调度

下面给出一个两阶段的python求解程序

```python
def schedule(a, b, n):
  'Johnson算法生成最优排列'
  N1 = []
  N2 = []
  for i in range(n):
    if a[i] < b[i]:
      N1.append((i,a[i],b[i]))
    else:
      N2.append((i,a[i],b[i]))
  N1.sort(key=lambda x: x[1])
  N2.sort(key=lambda x: x[2], reverse=True)
  N = N1 + N2
  bestorder = [i[0] for i in N]
  besttime = schedule_time(N, 0)
  return bestorder, besttime

def schedule_time(N, remaining):
    '根据特定排序计算总时间'
    if len(N) == 0:
        return remaining
    else:
        return N[0][1] + schedule_time(N[1:], N[0][2]+ max(remaining-N[0][1], 0))

def schedule_test():
  n = 3 # 作业数
  a = [1,3,2] # 第一阶段耗时
  b = [2,3,1] # 第二阶段耗时
  bestorder, besttime = schedule(a, b, n)
  print('最佳调度顺序：' , bestorder)
  print('最佳调度时间：' , besttime)

schedule_test()
```

#### 0-1背包问题

给定 $n$ 种物品和一个容量为 $c$ 的背包，其中，物品$i$ 的重量是 $w_i$ ，其价值为 $v_i$，应选择装入哪些物品使价值最大

记 $m(i,j)$ 是背包容量为 $j$ ，可选择物品为 $1, 2, \dots ,i$ 时0-1背包问题的最优值，由其最优子结构性质计算递归，实质是求 $m(n,c)$的最大值，下面给出了Python实现的 $O(nc)$ 时间复杂度的算法（有一个改进算法可以时间复杂度到 $O(2^n)$, 此处不讲，建议了解）

$ m(i,j)=\left\{
\begin{array}{rcl}
\max\{m(i-1,j), m(i-1, j-w_i)+v_i\}      &      & {j \geq w_i}\\
m(i-1,j)     &      & {j \lt w_i}\\ 0 & & i=0 \ or \ j=0
\end{array} \right. $

```python
import numpy as np
n = 5
c = 10
w = [2, 2, 6, 5, 4]
v = [3, 6, 5, 4, 6]

def bag_0_1(w, v, n, c):
  'Time Complexity O(nc)'
  w.insert(0, 0)
  v.insert(0, 0)
  m = np.zeros((n+1,c+1), dtype=np.int32)
  for i in range(1, n+1):
    for j in range(1, c+1):
      if w[i] <= j:
        m[i][j] = max(m[i-1][j], m[i-1][j-w[i]]+v[i])
      else:
        m[i][j] = m[i-1][j]
  x = show(m, n, w, c)
  print('Selection is ' + str(x))
  print('maxValue is ' + str(m[n][c]))

def show(m, n, w, c):
  x = [False for i in range(n)]
  j = c
  for i in range(n, 0, -1):
    if m[i][j] > m[i-1][j]:
      x[i-1] = True
      j -= w[i-1]
  return x  

bag_0_1(w,v,n,c)
```

