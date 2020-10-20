# Chap2 基于邻域的推荐方法综述

## 简介

* 物品推荐方法
	* 个性化
		* 基于内容
		* 协同过滤
			* 基于邻域
				* 基于用户（我和你品味相似，我评A满分，你也会评A高分）
					* GroupLens
					* Bellcore video
					* Ringo 
				* 基于物品（物品A和B很像，我评A满分，则预测我评B也是高分）
			* 基于模型（使用评分信息来学习预测模型）
				* 贝叶斯聚类 （Bayesian Clustering）
				* 潜在语义分析（Latent Semantic Analysis）
				* 潜在狄利克雷分布（Latent Dirichlet Allocation）
				* 最大熵（Maximum Entropy）
				* 奇异值分解 （Singular Value Decomposition）
		* 混合推荐（基于内容 + 协同过滤 的 n种组合）
			* 鲁棒性提高  
	* 非个性化 

## 基于邻域方法的优势

#### 简单性
* 仅有一个参数（用于选取的近邻数目）需要调整

#### 合理性
* 近邻物品列表
* 被推荐用户给予这些物品的评分
* 数据作为交互系统的基础
* 数据能帮助用户理解推荐结果和其关联性

#### 高效性
* 基于模型的系统需要大量时间消耗在训练阶段
* 基于邻域的系统在推荐阶段需要更大的消耗，但可以离线计算
* 存储近邻消耗内存较少，适用于大量用户或物品的应用

#### 稳定性
* 增量式数据影响小
* 增量式计算消耗少

## 形式化定义

* 用户集合 $U$
  * 已经对物品i进行评分的用户集合：$U_i$
  * 已经对物品i和j进行评分的用户集合：$U_{ij} = U_i \cap U_j$
* 物品集合 $\tau$
  * 被用户u评分的物品集合：$\tau_u$
  * 被用户u和v评分的物品集合：$\tau_{uv} = \tau_u \cap \tau_v$
* 系统评分集合 $R$
  * 训练集： $R_{train}$
  * 测试集： $R_{test}$

* 用户 $u$ 对物品 $i$ 的评分
  * 真实值：$r_{ui}$
  * 预测值：$f(u,i)$

* 问题

  * 评分预测（存在评分值时）

    * 评估函数
      * 平均绝对误差：$MAE(f) = \frac{1}{\vert R_{test} \vert}\sum\limits_{r_{ui} \in R_{test}}{\vert f(u,i) - r_{ui} \vert}$
      * 均方根误差：$RMSE(f) = \sqrt{\frac{1}{\vert R_{test} \vert} \sum\limits_{r_{ui} \in R_{test}}{}{(f(u,i)- r_{ui})^2}}$

  * top-N（不存在评分值时）

    * 用户 $u$ 最感兴趣的N项物品：$L(u)$
    * 物品列表分为训练集和测试集：$\tau_{train}$、 $\tau_{test}$
    * 测试物品中用户 $u$ 认为相关的物品子集：$T(u) \subset \tau_u \cap \tau_{test}$

    * 评估函数

      * 准确率：$Precision(L) = \frac{1}{\vert U \vert} \sum\limits_{u \in U}{}{\frac{\vert L(u) \cap T(u) \vert}{\vert L(u)\vert}}$

      * 召回率：$Recall(L) = \frac{1}{\vert U \vert} \sum\limits_{u \in U}{}{\frac{\vert L(u) \cap T(u) \vert}{\vert T(u)\vert}}$

        $\operatorname{Recall}(L)=\frac{1}{|U|} \sum_{u \in U} \frac{|L(u) \cap T(u)|}{|T(u)|}$

      * 平均逆命中率：$ARHR(L) = \frac{1}{\vert U \vert} \sum\limits_{u \in U}{}{\frac{1}{rank(i_u, L(u))}}$

        * $i_u$在$L(u)$中的排名(若$i_u \notin L(u)$，则函数值为正无穷)： $rank(i_u, L(u))$
      
        * 此处的$L(u)$ 是有序列表，此法修正了用户对物品列表的兴趣不一的问题

## 基于邻域的推荐

#### 基于用户的评分预测

* 公式：$\hat{r_{ui}} = h^{-1}\left (\frac{\sum\limits_{v \in N_i(u)}{}{w_{uv}h(r_{vi})}}{\sum \limits_{v \in N_i(u)}{}{\vert w_{uv} \vert}}\right )$
  * $\hat {r_{ui}}$ ：用户 $u$ 对新物品 $i$ 的评分预测值
  * $w_{uv}$：用户 $u$ 和用户 $v$ 的兴趣相近程度
  * $N_i(u)$：$k$个和用户 $u$ 兴趣相近且对物品 $i$ 有评分的用户 （代替K近邻定义）
  * $h(r)$ : 评分的标准化转换函数，避免用户慷慨（不讨厌都高分）和挑剔（仅对最突出打高分）

#### 基于用户的分类预测

* 公式：$\hat{r_{ui}} = h^{-1}(\arg\max\limits_{r \in \delta'} \sum \limits_{v \in N_i(u)}\delta(h(r_{vi})=r)w_{uv})$
  * 通过用户 $u$ 的最近邻对于评分的投票，找出用户 $u$ 对物品 $i$ 最有可能的评分
  * 是一个分类问题

#### 回归与分类

* 取决于系统的评分刻度类型，连续则用回归，离散则用分类
* 假设所有近邻的相似度权重相同，随着近邻数增加
  * 回归方法预测值趋向物品 $i$ 评分的平均数——保险
  * 分类方法仍保留极端评价——冒险，惊喜

#### 基于物品的推荐

* 回归公式：$\hat{r_{ui}} = h^{-1} \left( \frac{\sum \limits_{j \in N_u(i) }{w_{ij}h(r_{uj})}}{\sum \limits_{j \in N_u(i)}{\vert w_{ij} \vert}} \right )$

* 分类公式：$\hat{r_{ui}} = h^{-1}(\arg\max\limits_{r \in \delta'} \sum \limits_{j \in N_u(i)} \delta(h(r_{uj})=r)w_{ij})$

  * $w_{ij}$：物品 $i$ 和物品 $j$ 的相似程度

  * $N_u(i)$：用户 $u$ 已经评分的且和物品 $i$ 评分相近的物品

  * 其他参数类似于基于用户的公式

#### 基于用户 VS 基于物品

##### 准确性

|          |                         近邻平均数量                         |          评分平均数量          |
| :------: | :----------------------------------------------------------: | :----------------------------: |
| 基于用户 | $(\vert U \vert-1)\left(1-\left(\frac{\vert\tau\vert-p}{\vert\tau\vert}\right)^p\right)$ | $\frac{p^2}{\vert \tau \vert}$ |
| 基于物品 | $(\vert \tau \vert-1)\left(1-\left(\frac{\vert U \vert-q}{\vert U \vert}\right)^q\right)$ |  $\frac{q^2}{\vert U \vert}$   |

* 假设评分是正态分布的（真实数据往往是偏态的）
* 每个用户的平均评分数量：$p = \frac{\vert R \vert}{\vert U \vert}$
* 每个物品的平均评分数量：$q = \frac{\vert R \vert}{\vert I \vert}$
* 用户数  >> 物品数
  * 如Amazon.com
  * 基于物品推荐更准确
* 用户数  <<  物品数
  * 如科研论文推荐系统
  * 基于用户推荐更准确

##### 效率

|          |          空间          |       时间（训练）        |      时间（在线）       |
| :------: | :--------------------: | :-----------------------: | :---------------------: |
| 基于用户 | $O(\vert U \vert ^2)$  |  $O(\vert U \vert ^2p)$   | $O(\vert \tau \vert k)$ |
| 基于物品 | $O(\vert\tau\vert ^2)$ | $O(\vert \tau \vert ^2q)$ | $O(\vert \tau \vert k)$ |

* 此表描述最坏复杂度，真实情况下，用户仅有效评价少量物品，仅需存储非零的相似权重
* 每个用户的评分数最大值： $p = \max\limits_{u}{\vert \tau_u \vert}$

* 每个物品的评分数最大值：$q = \max\limits_{i}{\vert U_i\vert}$

* 评分预测中用到的近邻个数最大值： $k$

##### 稳定性

* 物品，用户二者之间，哪个群体稳定，则基于此稳定群体的推荐方法也更稳定

##### 合理性

* 基于物品的推荐更显合理性

##### 惊喜度

* 基于用户的推荐更可能带来惊喜（当近邻数较小时）

## 基于邻域方法的要素

#### 评分标准化

##### 均值中心化

* 公式：$h(r_{ui}) = r_{ui} - \bar{r_u}$
* 也常用于基于物品的推荐
* 用户对物品的喜好倾向可以通过标准化后评分的正负得知

##### Z-score标准化

* 公式：$h(r_{ui}) = \frac{r_{ui}-\hat{r_u}}{\sigma_u}$

* 考虑到个人评分范围不同带来的差异性
* 适用于大范围离散评分或连续评分
* 敏感性较高

#### 相似权重的计算

##### 皮尔逊相关系数（最优）

* 用户u和v的相似度：$PC(u,v) = \frac{\sum\limits_{i \in \tau_{uv}}{}(r_{ui}-\bar{r_u})(r_{vi}-\bar{r_v})}{\sqrt{\sum\limits_{i \in \tau_{uv}}{(r_{ui}-\bar{r_u})^2}\sum\limits_{i \in \tau_{uv}}{(r_{vi}-\bar{r_v})^2}}}$

* 物品 i 和 j 的相似度：$PC(i,j) = \frac{\sum\limits_{u \in U_{ij}}{}(r_{ui}-\bar{r_i})(r_{ui}-\bar{r_j})}{\sqrt{\sum\limits_{u \in U_{ij}}{(r_{ui}-\bar{r_i})^2}\sum\limits_{u \in U_{ij}}{(r_{ui}-\bar{r_j})^2}}}$
* 除去均值和方差间差异的影响，但仅考虑用户评分交集的标准差，而不是全部

##### 均方差

* 公式：$MSD(u,v) = \frac{\vert \tau_{uv} \vert}{\sum\limits_{i \in \tau_{uv}}{(r_{ui}-r_{vi})^2}}$

* 可用于计算两组标准化评分的差异

* 不能表示用户偏好的负关联

##### 斯皮尔曼等级关联

* $SRC(u,v) = \frac{\sum\limits_{i \in \tau_{uv}}{}(k_{ui}-\bar{k_u})(k_{vi}-\bar{k_v})}{\sqrt{\sum\limits_{i \in \tau_{uv}}{(k_{ui}-\bar{k_u})^2}\sum\limits_{i \in \tau_{uv}}{(k_{vi}-\bar{k_v})^2}}}$
* $k_{ui}$  : 物品 $i$ 在用户 $u$ 所评分物品中的排位
* 考虑评分的排名而非绝对值，绕开标准化评分的问题
* 可能产生大量并列排名
* 计算消耗大于皮尔逊相关系数算法

#### 权重重要性修正策略

##### 背景

只有少量评分用于计算时，就会降低相似度重要性的权重

##### 方法一

* 用户相似度：${\omega_{uv}}' = \frac{\min{\{\vert \tau_{uv}\vert, \gamma}\}}{\gamma} * \omega_{uv}$
* 物品相似度：${\omega_{ij}}' = \frac{\min{\{\vert \tau_{ij}\vert, \gamma}\}}{\gamma} * \omega_{ij}$
* 当惩罚阈值$\gamma >= 25$，可以显著提高预测评分的准确性，$\gamma = 50$ 可以获得较好的结果，最优参数值依赖于数据本身，应该使用交叉验证方法来决定

##### 方法二

- 用户相似度：${\omega_{uv}}' = \frac{\vert \tau_{uv}\vert}{\vert \tau_{uv}\vert + \beta} * \omega_{uv}$
- 物品相似度：${\omega_{ij}}' = \frac{\vert U_{ij}\vert}{\vert U_{ij}\vert + \beta} * \omega_{ij}$
- 通常取$\beta=100$

##### 方法三

* 一个用户对物品以同样方式给予评分所提供的消息，要远远低于他对不同物品体现出不同偏好带来的信息

* 物品权重 $\lambda_i = log \frac{\vert U \vert}{\vert U_i \vert}$

* 加权的皮尔逊相关系数（用户）：$FWPC(u,v) = \frac{\sum\limits_{i \in \tau_{uv}}{}\lambda_i(r_{ui}-\bar{r_u})(r_{vi}-\bar{r_v})}{\sqrt{\sum\limits_{i \in \tau_{uv}}{\lambda_i(r_{ui}-\bar{r_u})^2}\sum\limits_{i \in \tau_{uv}}{\lambda_i(r_{vi}-\bar{r_v})^2}}}$
* 加权的皮尔逊相关系数（物品）：$WPC_j(u,v) = \frac{\sum\limits_{i \in \tau_{uv}}{}\omega_{ij}(r_{ui}-\bar{r_u})(r_{vi}-\bar{r_v})}{\sqrt{\sum\limits_{i \in \tau_{uv}}{\omega_{ij}(r_{ui}-\bar{r_u})^2}\sum\limits_{i \in \tau_{uv}}{\omega_{ij}(r_{vi}-\bar{r_v})^2}}}$

#### 近邻的选择

* 大型推荐系统中，可能包含巨量物品和用户信息，预选近邻数可以减少存储相似度权重数量，限制用于预测的近邻数目

* top-N过滤、阈值过滤、负值过滤

#### 解决覆盖受限和稀疏数据的问题（P38～P44）

##### 基于图的方法

* 基于路径的相似度：发掘用户集和物品集的联系而非精确预测评分

  * 令R是一个大小为$\vert U \vert * \vert I\vert$的评分矩阵，若用户 $u$ 对物品 $i$ 进行了评分，则$r_{ui}=1$，否则为0

  * 二分图的邻接矩阵通过 $R$ 来定义:  

    $$A=\begin{bmatrix}0 & R^T\\R&0\end{bmatrix}$$

  * 定义用户 $u$ 和物品 $i$ 的关联度：用户 $u$ 到物品 $i$ 的所有不同路径（长度小于K）的权重之和，

  * 为了减弱长距离路径的贡献度，设置关于长度K的权重 $\alpha^K$ ，$A^K$ 给出节点对间长度恰为K的路径数量

  * 用户-物品关联矩阵定义为：$S_K = \sum\limits_{k=1}^{K}{\alpha^kA^k}={(I-\alpha A)^{-1}(\alpha A-\alpha^KA^K)}$

* 基于随机游走的相似度

  * ItemRank算法
  * 平均首次通过/往返的次数

##### 基于学习的方法

* 基于分解的方法
* 基于邻域的学习方法

