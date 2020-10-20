# Chap3 协同过滤方法进阶

## 形式化定义

* $r_{ui}$ 代表用户 $u$ 对物品 $i$ 的真实评分（1～5），评分的时间为 $t_{ui}$，表示从早期某一时间点到现在的天数
* 集合 $R(u)$ 表示用户 $u$ 显式评价过的所有物品
* 集合 $N(u)$ 表示用户 $u$ 隐式评价过的所有物品
* 集合 $R(i)$ 表示评价过物品 $i$ 的用户集合

* 预测结果的评估使用均方根误差来度量
  * $RMSE=\sqrt{\sum\limits_{(u,i) \in TestSet}{\frac{(r_{ui}-{\hat{r_{ui}}})^2}{\vert TestSet \vert}}}$

## 基准预测

##### 公式

$b_{ui} = \mu + b_u + b_i$

##### 参数解释

* $\mu$ 表示所有评分的均值

* $b_u$ 表示用户 $u$ 的评分与平均值的偏差

* $b_i$ 表示物品 $i$ 的评分与平均值的偏差

##### 参数寻找

* 最小二乘估计法
  * $\min\limits_{b_*}{{\sum\limits_{(u,i) \in \Kappa}{(r_{ui}-\mu-b_u-b_i)^2}} + \lambda_1(\sum\limits_{u}{{b_u}^2} + \sum\limits_{i}{{b_i}^2})}$
  * 第二项为惩罚性质的正则项，避免过拟合，可通过随机梯度下降求解

* 简单起见，使用一种简单的参数估计方法，但准确度不高

  * $b_i = \frac{\sum\limits_{u \in R(i)}(r_{ui}-\mu)}{\lambda_2 + \vert R(i) \vert}$

  * $b_u = \frac{\sum\limits_{i \in R(u)}(r_{ui}-\mu-b_i)}{\lambda_3 + \vert R(u) \vert}$

  * 参数$\lambda_2,\lambda_3$由交叉验证决定

## 矩阵分解模型

### SVD

##### 原理

* 矩阵分解模型把用户和物品两方面的信息映射到 $f$ 维的联合隐语义空间中
* 每个物品 $i$ 与一个 $f$ 维向量 $q_i$ 关联，向量每维度的值的大小代表物品具备这些因子的程度（如搞笑因子，恐怖因子，无法解释的因子等等）
* 每个用户 $u$ 与一个 $f$ 维向量 $p_u$ 关联，向量每维度的值的大小代表用户对这些因子的偏好程度（如偏好搞笑0.5，偏好恐怖0.1）
* 点积 $q_i^Tp_u$ 反应了用户对物品的总体兴趣度

##### 公式

$b_{ui} = \mu + b_u + b_i + q_i^Tp_u$

##### 约束条件

$\min\limits_{b_*, q_*,p_*}{{\sum\limits_{(u,i) \in \kappa}{(r_{ui}-\mu-b_u-b_i-q_i^Tp_u)^2} + \lambda_4(b_i^2+b_u^2+\Vert q_i \Vert ^2 + \Vert p_u \Vert ^2)}}$

##### 学习过程

$e_{ui} \xlongequal{def} r_{ui} - \hat{r_{ui}}$

${b_u}' \leftarrow b_u + \gamma \cdot (e_{ui}-\lambda_4 \cdot b_u)$

${b_i}' \leftarrow b_i + \gamma \cdot (e_{ui}-\lambda_4 \cdot b_i)$

${q_i}' \leftarrow q_i + \gamma \cdot (e_{ui} \cdot p_u -\lambda_4 \cdot q_i)$

${p_u}' \leftarrow p_u + \gamma \cdot (e_{ui} \cdot q_i -\lambda_4 \cdot p_u)$

选用合适的学习率 $\gamma$ 和正则化因子 $\lambda_4$ 来提高准确度

### SVD++

##### 原理

* 在SVD的基础上考虑隐式反馈的信息
* $y_j$为隐藏的"评价了电影$j$"中反映出的个人喜好偏置

##### 公式

* $\hat{r_{ui}} = \mu + b_u + b_i + q_i^T \left( p_u + \vert R(u) \vert ^{-\frac{1}{2}} \sum\limits_{j \in R(u)}{y_j}\right)$

##### 学习过程

$e_{ui} \xlongequal{def} r_{ui} - \hat{r_{ui}}$

${b_u}' \leftarrow b_u + \gamma \cdot (e_{ui}-\lambda_5 \cdot b_u)$

${b_i}' \leftarrow b_i + \gamma \cdot (e_{ui}-\lambda_5 \cdot b_i)$

${q_i}' \leftarrow q_i + \gamma \cdot \left( e_{ui} \cdot \left( p_u + {\vert R(u) \vert}^{-\frac{1}{2}} \sum\limits_{j \in R(u)}{y_j} \right) - \lambda_6 \cdot q_i  \right)$

${p_u}' \leftarrow p_u + \gamma \cdot (e_{ui} \cdot q_i -\lambda_6 \cdot p_u)$

$\forall_j \in R(u): {y_j}' \leftarrow y_j + \gamma \cdot \left( e_{ui} \cdot {\vert R(u) \vert}^{-\frac{1}{2}} \cdot q_i - \lambda_6 \cdot y_j \right)$

选用合适的学习率 $\gamma$ 和正则化因子 $\lambda_5, \lambda_6$ 来提高准确度

最好每次迭代后将 $\gamma$ 乘一个收缩因子，在Netflix实践中，因子为0.9

### timeSVD++

##### 原理

* 假定用户偏置 $b_u(t)$，物品偏置 $b_i(t)$， 用户爱好 $p_u(t)$ 三者是随时间变化的
* 假定物品特征 $q_i$ 是静态的

##### 公式

$dev_u(t) = sign(t-t_u) \cdot {\vert t-t_u \vert}^\beta$

$b_u(t) = b_u + \alpha_u \cdot dev_u(t) + b_{u,t}$

$b_i(t) = b_i + b_{i,Bin}(t)$

$p_{uk}(t) = p_{uk} + \alpha_{uk} \cdot dev_u(t) + p_{uk,t}\ \ \ \ k=1 \dots f \\  \ \ \ s.t. \ \ \ \  {p_u(t)}^T = (p_{u1}(t), \dots , p_{uf}(t))$

$\hat{r_{ui}} = \mu + b_u(t_{ui}) + b_i(t_{ui}) + q_i^T \left( p_u(t_{ui}) + \vert R(u) \vert ^{-\frac{1}{2}} \sum\limits_{j \in R(u)}{y_j}\right)$

### 比较

* SVD++ 在 SVD 上整合一种隐式反馈， timeSVD++进一步考虑了时间效应，提高了预测准确度
* 三种方法的预测准确度随着因子维度数目 $f$ 的增加而提高

## 基于邻域的模型

### 相似度度量

* 使用基准预测： $b_{ui} = \mu + b_u + b_i$

* 由于基于更大用户支持的相关系数估计值更加可靠，基于贝叶斯角度出发，使用收缩值 $s_{ij}$ 来修正相关系数 
  *  $\rho_{ij} = \frac{\sum\limits_{u \in U_{ij}}{}(r_{ui}-b_{ui})(r_{uj}-b_{uj})}{\sqrt{\sum\limits_{u \in U_{ij}}{(r_{ui}-b_{ui})^2}\sum\limits_{u \in U_{ij}}{(r_{uj}-b_{uj})^2}}}$
  * $s_{ij} \xlongequal{def} \frac{\vert U_{ij} \vert-1}{\vert U_{ij} \vert-1+\lambda_8} \rho_{ij}$

### 基于相似度的插值

##### 说明

* 本质是在基准预测器$b_{ui} = \mu + b_u + b_i$的基础上作一点调整
* 流行，直观，可解释

##### 公式

$\hat{r_{ui}} = b_{ui} + \frac{\sum\limits_{j \in S^k(i;u)}{s_{ij}(r_{uj}-b_{uj})}}{\sum\limits_{j \in S^k(i;u)}{s_{ij}}}$

$S^k(i;u)$ : 用户$u$评价过的，与物品i最相似的$k$个物品

假如一个物品没有被某个特定用户评价过的有用的近邻，即  $S^k(i;u)$ 的物品可靠性不高的情况下，最好直接忽略掉邻域信息，添加惩罚因子 $\lambda$

$\hat{r_{ui}} = b_{ui} + \frac{\sum\limits_{j \in S^k(i;u)}{s_{ij}(r_{uj}-b_{uj})}}{\lambda + \sum\limits_{j \in S^k(i;u)}{s_{ij}}}$

### 联合派生插值权重

* 比上述模型更加精确

* 计算近邻集合 $S^k(i;u)$ 的插值权重 $\{\theta_{ij}^{u} \vert j \in S^k(i;u) \}$，近邻个数k取值范围一般为20～50

##### 公式

$\hat{r_{ui}} = b_{ui} + \sum\limits_{j \in S^k(i;u)}{\theta_{ij}^{u}(r_{uj}-b_{uj})}$

* 通过最小二乘法学习插值权重 $\theta_{ij}^u$ : $\min\limits_{\theta^u}{\sum\limits_{v \ne u}{(z_{vi} - \sum\limits_{j \in S^k(i;u)}{\theta_{ij}^u z_{vj}})^2}}$

* 给定 $z_{ui} \xlongequal{def} r_{ui}-b_{ui}$

##### 学习过程

* 求解最小二乘法等价于求解一个线性方程组 $A\omega=b$，其中，A是一个 $k*k$的矩阵，$\omega$是一个 $k$ 维向量，$\omega_j$ 就代表要寻找的系数  $\theta_{ij}^u$

* $A_{jl} = \sum\limits_{v \ne u}{z_{vj}z_{vl}}$

* $b_j = \sum\limits_{v \ne u}{z_{vj}z_{vi}}$
* P62 介绍了进一步调整参数估计方法以适应稀疏评分和用户评分集聚性带来的问题，此处略过

### 小结

* 邻域算法的特征：数据规范化，近邻的选择，插值权重的决定

* 规范化对一般意义上的协同过滤算法至关重要
* 邻域的选择与采用的相似度度量直接相关，通过收缩不可靠相似度的重要性，避免发现有低评分支持度的近邻
* 插值权重用来从已知评分的物品的近邻物品中估计未知的评分，然而大多数方法缺少权重推导的严谨数学证明，我们可以将权重的求解转化为最优化问题的全局解来获得

## 增强的基于邻域的模型

### 全局化的邻域模型

#### 思想

* 大多数基于邻域的模型是局部性的，矩阵分解技术从全局角度描述用户和物品的特征，以此提高准确性
* 下面提出一种基于全局最优化的邻域模型，有以下额外优点
  * 不依赖任意的或启发式的基于物品的相似度，而仅表现为一个全局最优化问题的解
  * 固有的防止过拟合和风险控制的能力，应对稀疏评分仍然具有鲁棒性
  * 整合显式隐式输入
  * 高度可扩展性允许以线性的时间空间复杂度实现该模型
  * 数据随时间漂移能够整合到模型中

#### 演化过程

* 放弃使用特定用户的权重以实现全局最优化，而改为使用物品 $j$ 到物品 $i$ 的权重 $\omega_{ij}$

* 从基准预测器开始

$\hat{r_{ui}} = b_{ui} + \sum\limits_{j \in R(u)}{(r_{uj}-b_{uj})\omega_{ij}}$

* 加入隐式反馈，解耦 $b_{ui}$的定义

$\hat{r_{ui}} = \mu + b_u + b_i + \sum\limits_{j \in R(u)}{[(r_{uj}-b_{uj})\omega_{ij}+c_{ij}]}$

* 规范化修正并通过相似度缩减计算的物品集

$\hat{r_{ui}} = \mu + b_u + b_i + \vert R^k(i;u) \vert ^ {-\frac{1}{2}}\sum\limits_{j \in R^k(i;u)}{[(r_{uj}-b_{uj})\omega_{ij}+c_{ij}]}$

$R^k(i;u) \xlongequal{def} R(u) \cap S^k(i)$

#### 学习过程

$\min\limits_{b_*,w_*,c_*}{\sum\limits_{(u,i) \in \kappa}(\hat{r_{ui}}-r_{ui})^2}+\lambda({b_u}^2+{b_i}^2+\sum\limits_{j \in R^k(i;u)}{{w_{ij}}^2}+{c_{ij}}^2)$

* $e_{ui} \xlongequal{def} r_{ui}-\hat{r_{ui}}$

* ${b_u}' = b_u + \gamma \cdot (e_{ui} - \lambda \cdot b_u)$
* ${b_i}' = b_i + \gamma \cdot (e_{ui}-\lambda \cdot b_i)$

* $\forall_j \in R^k(i;u): \\ \ \ \ \ \ {\omega_{ij}}' = \omega_{ij} + \gamma \cdot ({\vert R^k(i;u) \vert}^{-\frac{1}{2}} \cdot e_{ui} \cdot (r_{uj}-b_{uj}) - \lambda \cdot \omega_{ij}) \\ \ \ \ \ \ {c_{ij}}' = c_{ij} + \gamma \cdot ({\vert R^k(i;u) \vert}^{-\frac{1}{2}} \cdot e_{ui} - \lambda \cdot c_{ij})$

#### 模型评估

* 训练阶段总体时间复杂度为 $O(\sum\limits_{u}{{\vert R(u) \vert}^2})$

* 空间复杂度为 $O(m+n^2)$，$m$ 为用户数，$n$ 为物品数 

### 因式分解的邻域模型

#### 基于物品关系分解

##### 定义

* 在上一模型基础上，强制 $c_{ij} = {q_i}^Ty_j$ ，$\omega_{ij}={q_i}^Tx_i$  (given $q_i,x_i,y_i \in R^f$)
* 时间复杂度下降至 $O(f \cdot \sum\limits_{u}{\vert R(u) \vert})$，空间复杂度下降至 $O(m+nf)$

##### 公式

$\hat{r_{ui}} = \mu + b_u + b_i + {q_i}^T \left( \vert R(u) \vert ^ {-\frac{1}{2}}\sum\limits_{j \in R(u)}{(r_{uj}-b_{uj})x_j+y_j} \right)$

#### 基于用户关系分解

##### 定义

* 使用用户对的权重 $\omega_{uv}$ 来代替物品对的权重 $\omega_{ij}$
* 因式分解$\omega_{uv} = {p_u}^Tz_v$
* 时间复杂度下降至 $O(f \cdot \sum\limits_{i}{\vert R(i) \vert})$，空间复杂度下降至 $O(n+mf)$

##### 公式

$\hat{r_{ui}} = \mu + b_u + b_i + {p_u}^T  \vert R(i) \vert ^ {-\frac{1}{2}}\sum\limits_{v \in R(i)}{(r_{vi}-b_{vi})z_v})$

#### 物品与用户融合

##### 说明

* 组合二者提高准确度

##### 公式

$\hat{r_{ui}} = \mu + b_u + b_i + {q_i}^T \left( \vert R(u) \vert ^ {-\frac{1}{2}}\sum\limits_{j \in R(u)}{(r_{uj}-b_{uj})x_j+y_j} \right) + {p_u}^T  \vert R(i) \vert ^ {-\frac{1}{2}}\sum\limits_{v \in R(i)}{(r_{vi}-b_{vi})z_v})$

