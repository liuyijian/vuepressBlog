# 《低维模型分析高维数据：理论、计算与应用》读书笔记



## Preface

### 假设、论据与目标

假设1：数据 = 信息 + 不相关数据

论据1：对于人脸识别而言，图像中有效信息，仅限于人脸所在区域；且该区域像素可以进一步通过像素压缩，特征提取等方式获取少量有效信息表示

假设2：不完整数据 $\approx$ 完整信息

论据2：从群体观影评分记录（个体看过少量影片，特定影片被少量个体看过）中获取用户偏好并进行观影推荐和广告分发的理论基础是用户偏好是具有结构性而非随机的，可以使用低维结构表示这个高维的用户偏好表格

目标1：研发能从高维数据获取有效信息的，运行时间可接受的、数据规模可扩展的、准确度可保证的算法

假设3：理论和应用之间的桥梁是计算

论据3：过去二十年很多理论成果已经用于数据科学和信号处理的实践当中，是时候写个分类总结了

目标2：用理论建模且明白其优劣，用算法高效解决系统性问题，将领域知识或其他非线性因素融合

### 内容分布

* 第一部分：理论，介绍稀疏性、低秩表示、通用低维模型
* 第二部分：计算，介绍凸/非凸优化用于低维模型恢复，提高算法准确率、降低计算复杂性的系统流程
* 第三部分：应用，介绍理论计算如何结合解决真实世界问题，如何自定义扩展模型并融合领域知识

## Chap1 引言

### 1.1 通用任务：寻找低维结构

* 真实世界的信号或数据是特定生成式机制作用在物理过程中得到的观察结果

#### 1.1.1 识别动态系统和时序数据

* 动态过程通常使用微分方程建模
  * $\left\{
    \begin{array}{lcl}
    \dot{\mathbf{x}}(t) = f(\mathbf{x}(t),\mathbf{u}(t)) \\
    \mathbf{y}(t)=g(\mathbf{x}(t),\mathbf{u}(t))
    \end{array} \right.$        状态：$\mathbf{x} \in \mathbb{R}^n$  ，输入：$\mathbf{u} \in \mathbb{R}^{n_i}$ ，观测输出：$\mathbf{y} \in \mathbb{R}^{n_o}$ 

* 考虑上述方程的简化版本，假设系统线性时不变（linear time invariant）
  * $\left\{
    \begin{array}{lcl}
    \mathbf{x}(t+1) = \mathbf{A} \mathbf{x}(t) + \mathbf{B} \mathbf{u}(t) \\
    \mathbf{y}(t)=\mathbf{C} \mathbf{x}(t) + \mathbf{D} \mathbf{u}(t)
    \end{array} \right.$
* 根据系统辨识理论，线性系统的观测输出和输入在不大于状态维度的子空间中相关
  * 将 $\mathbf{y}$ 和 $\mathbf{u}$ 写成汉克尔矩阵的形式，有 $\boldsymbol{Y}=\boldsymbol{G}\boldsymbol{X}+\boldsymbol{H}\boldsymbol{U}$，即 $\boldsymbol{Y} \boldsymbol{U}^{\perp}=\boldsymbol{G} \boldsymbol{X} \boldsymbol{U}^{\perp}$， $\operatorname{rank}\left(\boldsymbol{Y} \boldsymbol{U}^{\perp}\right) \leq n$
    * $\boldsymbol{Y} \doteq\left[\begin{array}{cccc}\boldsymbol{y}(1) & \boldsymbol{y}(2) & \cdots & \boldsymbol{y}(N) \\ \boldsymbol{y}(2) & \boldsymbol{y}(3) & \cdots & \boldsymbol{y}(N+1) \\ \vdots & \vdots & \ddots & \vdots \\ \boldsymbol{y}(N) & \boldsymbol{y}(N+1) & \cdots & \boldsymbol{y}(2 N-1)\end{array}\right] \in \mathbb{R}^{n_{o} N \times N}$ 
    * $\boldsymbol{U} \doteq\left[\begin{array}{cccc}\boldsymbol{u}(1) & \boldsymbol{u}(2) & \cdots & \boldsymbol{u}(N) \\ \boldsymbol{u}(2) & \boldsymbol{u}(3) & \cdots & \boldsymbol{u}(N+1) \\ \vdots & \vdots & \ddots & \vdots \\ \boldsymbol{u}(N) & \boldsymbol{u}(N+1) & \cdots & \boldsymbol{u}(2N-1)\end{array}\right] \in \mathbb{R}^{n_{i} N \times N}$
    * $\boldsymbol{X}=[\boldsymbol{x}(1), \boldsymbol{x}(2), \ldots, \boldsymbol{x}(N)] \in \mathbb{R}^{n \times N}$
    * $\boldsymbol{G}=[\boldsymbol{CA^0}, \boldsymbol{CA^1},\ldots, \boldsymbol{CA^N}]$
    * $\boldsymbol{H}=[\boldsymbol{CA^0B}, \boldsymbol{CA^1B},\ldots, \boldsymbol{CA^NB}]$
  * 利用输入输出重建n维状态空间是识别系统未知参数的关键
* 现代RNN也参考了状态方程的设计，使用了非线性的激活函数
  * $\left\{\begin{aligned} \boldsymbol{x}(t+1) &=\sigma_{\boldsymbol{x}}(\boldsymbol{A} \boldsymbol{x}(t)+\boldsymbol{B} \boldsymbol{u}(t)+\boldsymbol{b}) \\ \boldsymbol{y}(t) &=\sigma_{\boldsymbol{y}}(\boldsymbol{C x}(t)+\boldsymbol{d}) \end{aligned}\right.$

#### 1.1.2 人造世界中的模式和秩序

![image-20220420152849519](https://tva1.sinaimg.cn/large/e6c9d24ely1h1g7xzoqqrj20k203wdgd.jpg)

* 以上这些二维图片，图像行（列）向量是高度线性相关的，故能寻找其低秩表示

#### 1.1.3 高效数据获取和处理

* 香农采样定理：对于带限信号进行离散采样时，只有**采样频率高于其最高频率的2倍**，(即一个周期内，至少采2个点)，我们才能从采样信号中惟一正确地恢复原始带限信号
  * 参考证明：https://zhuanlan.zhihu.com/p/437364577
  * 应用场景：JPEG图像的获取和压缩存储

#### 1.1.4 图模型解释数据

* 一个图，仅能观察到特定点以及这些点的连接关系，如何获取整图的关系分布矩阵

### 1.2 历史概览

#### 1.2.1 神经科学：稀疏编码

* 现状与启示：看似复杂的现实数据存在待挖掘的良好的内生结构，用于压缩和高效表示；而这样的表示在生物体内已经被学得很好了
* 模型：给定充足的观测值 $\boldsymbol{Y}=\left[\boldsymbol{y}_{1}, \boldsymbol{y}_{2}, \ldots, \boldsymbol{y}_{N}\right]$，寻找稀疏表示 $\boldsymbol{x} \in \mathbb{R}^{n}$ ，使得 $\boldsymbol{Y}=\boldsymbol{A X}$

#### 1.2.2 信号处理：稀疏错误纠正

* 现状：由于测量误差，并没有精确满足 $\boldsymbol{Y}=\boldsymbol{A X}$ 的稀疏编码，而是 $y_{i}=\boldsymbol{a}_{i}^{*} \boldsymbol{x}+\varepsilon_{i}, \quad i=1,2, \ldots, m$
* 模型：使用误差最小化的方法
  * 适用于拉普拉斯分布：$\min _{\boldsymbol{x}}\|\boldsymbol{y}-\boldsymbol{A} \boldsymbol{x}\|_{1}=\sum_{i=1}^{m}\left|y_{i}-\boldsymbol{a}_{i}^{*} \boldsymbol{x}\right|$
  * 适用于高斯分布：$\min _{\boldsymbol{x}}\|\boldsymbol{y}-\boldsymbol{A} \boldsymbol{x}\|_{2}^{2}=\sum_{i=1}^{m}\left(y_{i}-\boldsymbol{a}_{i}^{*} \boldsymbol{x}\right)^{2}$

#### 1.2.3 经典统计：稀疏回归分析

* 最优子集选取：数据分析中，很多变量和预测对象是无关的，我们先要做变量选择，这就涉及选取特征集合的最优子集，$\min _{\boldsymbol{x}}\|\boldsymbol{y}-\boldsymbol{A} \boldsymbol{x}\|_{2}^{2} \quad$ subject to $\quad\|\boldsymbol{x}\|_{0} \leq k$，即向量中非零元素要小于k
* 岭回归：$\min _{\boldsymbol{x}}\|\boldsymbol{y}-\boldsymbol{A} \boldsymbol{x}\|_{2}^{2}+\lambda\|\boldsymbol{x}\|_{1}$

#### 1.2.4 数据分析：PCA

* 原理：
  * PCA的工作就是从原始的空间中顺序地找一组相互正交的坐标轴
  * 第一个新坐标轴选择是原始数据中方差最大的方向
  * 第二个新坐标轴选取是与第一个坐标轴正交的平面中使得方差最大的
  * 第三个轴是与第1,2个轴正交的平面中方差最大的
  * 依次类推，可以得到n个这样的坐标轴。通过这种方式获得的新的坐标轴，我们发现，大部分方差都包含在前面k个坐标轴中，后面的坐标轴所含的方差几乎为0
  * 于是，我们可以忽略余下的坐标轴，只保留前面k个含有绝大部分方差的坐标轴，从而实现数据降维。
* 应用：
  * scikit-learn的PCA是通过SVD分解来计算协方差矩阵的特征值和特征向量的
  * PCA可用于图像有损压缩

## Chap2 稀疏信号模型

### 2.1 稀疏信号建模应用

#### 2.1.1 核磁共振

* 核磁共振图像：每个像素反映脑子里某个空间的质子密度 $\boldsymbol{I(v)}$，根据这个特征，能排查颅内积水，以及揭示多种生物学结构，用于疾病诊断和病情监控
* 核磁共振原理：
  * <img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h1hsqfnhztj205g0eft91.jpg" alt="image-20220422001341707" style="zoom:50%;" />
  * 观测到的值实际上是经过二维傅立叶变换后的值：$y=\int_{\boldsymbol{v}} I(\boldsymbol{v}) \exp \left(-\mathrm{i} 2 \pi \boldsymbol{u}^{*} \boldsymbol{v}\right) d \boldsymbol{v}$
  * 使用不同的磁场，能有不同的 $u^{*}=\left[u_{1}, u_{2}\right] \in \mathbb{R}^{2}$
  * 于是能得到多组观测值 $\boldsymbol{y}=\left[\begin{array}{c}y_{1} \\ \vdots \\ y_{m}\end{array}\right]=\left[\begin{array}{c}\mathcal{F}[I]\left(\boldsymbol{u}_{1}\right) \\ \vdots \\ \mathcal{F}[I]\left(\boldsymbol{u}_{m}\right)\end{array}\right] \doteq \mathcal{F}_{U}[I]$
  * 通过求解一个大规模线性方程，能反推出质子密度
  * 解这个方程依赖于一些假设，即 $\boldsymbol{I}$ 是基本信号$\Psi=\left\{\psi_{1}, \ldots, \psi_{N^{2}}\right\}$的线性组合，可以保留相关系数最大的k个基本信号，作为对$\boldsymbol{I}$的估计，$\tilde{I}_{k}=\sum_{i=1}^{k} \psi_{i} x_{i}$
  * $\begin{aligned} \underset{y}{\boldsymbol{y}} &=\mathcal{F}_{\mathrm{U}}[I] \\ &=\mathcal{F}_{\mathrm{U}}\left[\psi_{1} x_{1}+\cdots+\psi_{N^{2}} x_{N^{2}}\right] \\=& \mathcal{F}_{\mathrm{U}}\left[\boldsymbol{\psi}_{1}\right] x_{1}+\cdots+\mathcal{F}_{\mathrm{U}}\left[\boldsymbol{\psi}_{N^{2}}\right] x_{N^{2}} \\=& {\left[\mathcal{F}_{\mathrm{U}}\left[\psi_{1}\right]|\cdots| \mathcal{F}_{\mathrm{U}}\left[\psi_{N^{2}}\right]\right] \boldsymbol{x} } \\ & \operatorname{matrix} A \in \mathbb{R}^{m \times N^{2}}, m \ll N^{2} \\=& \boldsymbol{A} \boldsymbol{x} . \end{aligned}$

## Chap3 稀疏信号恢复的凸方法



## Chap4 低秩矩阵恢复的凸方法



## Chap5 分解低秩矩阵和稀疏矩阵



## Chap6 恢复通用低维模型



## Chap7 低维模型的非凸方法



## Chap8 结构信号恢复的凸优化



## Chap9 高维问题的非凸优化



## Chap10 核磁共振成像



## Chap11 宽带频谱感知



## Chap12 高分辨率成像



## Chap13 鲁棒人脸识别



## Chap14 光度立体三维重建



## Chap15 结构纹理恢复



## Chap16 用于分类的深度神经网络







## 附录A 线性代数和矩阵分析

### A.1 向量空间、线性无关、基、维度

* 向量 $\mathbf{x} \equiv \begin{bmatrix}x_1 \\ \vdots \\ x_n \end{bmatrix} \in \mathbb{R}^n $
* 转置向量 $\mathbf{x}^* \equiv \begin{bmatrix}x_1, \cdots, x_n \end{bmatrix} \in \mathbb{R}^n $
* 向量空间：设 $\mathbb{F}$是一个域，一个$\mathbb{F}$上的向量空间是一个集合$\mathbb{V}$的两个运算
  * 向量加法：$\mathbf{v} \in \mathbb{V} , \mathbf{w} \in \mathbb{V} \Rightarrow \mathbf{v} + \mathbf{w} \in \mathbb{V}$
  * 向量乘法：$\mathbf{\alpha} \in \mathbb{F} , \mathbf{v} \in \mathbb{V} \Rightarrow \mathbf{\alpha} \mathbf{v} \in \mathbb{V}$
* 线性无关：若 $\sum\limits_{i=1}^{k}\alpha_i \mathbf{v}_i = 0 \Rightarrow \alpha_1=0,\cdots,\alpha_k=0$，则称向量$\mathbf{v_1}, \cdots, \mathbf{v_k}$线性无关

* 向量空间的基：向量空间中的一组线性无关向量$\mathbf{B}$，使得$\forall \mathbf{v} \in \mathbb{V}, \exists \mathbf{b_1}, \cdots, \mathbf{b_k} \in \mathbf{B}, \alpha_1, \cdots, \alpha_k \in \mathbb{F}, \mathbf{v} = \sum\limits_{i=1}^{k} \alpha_i \mathbf{b_i}$，则称 $\mathbf{B}$是向量空间的一组基，所有这样的 $\mathbf{B}$ 都具有相同的基数，称为向量空间的维度，$card(\mathbf{B}) = dim(\mathbb{V})$
* 向量子空间：向量空间$\mathbb{V}$的一个线性子空间$\mathbf{S}$满足两个条件，一是一个向量空间，二是$\mathbf{S} \subseteq \mathbb{V}$，三维空间的子空间可以是一个过原点的平面，或是过原点的直线

### A.2 内积

* 内积：若函数$ \mathbb{V} \times \mathbb{V} \rightarrow \mathbb{F}$，满足以下三个性质，则该函数是向量空间上的一个内积
  * 线性性：$ \langle \alpha\mathbf{v} + \beta\mathbf{w}, \mathbf{x} \rangle = \alpha \langle \mathbf{v}, \mathbf{x} \rangle + \beta \langle \mathbf{w},\mathbf{x} \rangle$
  * 对称性：$\langle \mathbf{v},\mathbf{w} \rangle = \overline{\langle \mathbf{w},\mathbf{v} \rangle}$
  * 正定性：$\langle \mathbf{v},\mathbf{v} \rangle \ge 0$，仅当 $\mathbf{v} = 0$时取等

* 正交：若$\langle \mathbf{v},\mathbf{w} \rangle = 0$，则称 $\mathbf{v}$ 和  $\mathbf{w}$ 正交，记作$\mathbf{v} \perp \mathbf{w}$

* 正交补：对于 $S \subseteq \mathbb{V}$，$S^{\perp} = \{ \mathbf{v} \in \mathbb{V} \vert \langle\mathbf{v}, \mathbf{s} \rangle = 0 \ \  \forall \mathbf{s} \in S \}$

* 内积扩展：
  * 矩阵内积：$\langle \mathbf{X},\mathbf{Z} \rangle = \sum\limits_{i=1}^{m}\sum\limits_{j=1}^{n} X_{ij}Z_{ij}$

* 迹：$\mathbf{M} \in \mathbb{R}^{n \times n}, trace(\mathbf{M}) = \sum\limits_{i=1}^{n}M_{ii}$

  * 内积和迹的关系：$\langle \mathbf{X},\mathbf{Z} \rangle = trace(\mathbf{X^*}\mathbf{Z}) = trace(\mathbf{X}\mathbf{Z^*})$

  * 迹的性质：若$\pi$ 是一个 $\{1, \cdots, n\}$ 的一个排列，则一系列方阵$A_1, \dots A_n$ 满足$trace(A_1A_2\dots A_n) = trace(A_{\pi(1)}A_{\pi(2)}\dots A_{\pi(n)})$

### A.3 线性变换和矩阵

* 线性变换：一个函数 $\mathcal{L}: \mathbb{V} \rightarrow \mathbb{V'}$ 若满足$\forall \alpha, \beta \in \mathbb{F}, \forall \mathbf{v}, \mathbf{w} \in \mathbb{V}, \mathcal{L}[\alpha \mathbf{v}+\beta\mathbf{w}] = \alpha \mathcal{L}[\mathbf{v}]+\beta \mathcal{L}[\mathbf{w}]$，则称其为线性变换
* 线性算子：一个 $\mathbb{V} = \mathbb{V'}$ 的线性变换
* 线性变换与矩阵乘法：对于每个线性变换$\mathcal{L}: \mathbb{R^n} \rightarrow \mathbb{R^m}$，存在唯一矩阵 $\mathbf{A} \in \mathbb{R}^{m \times n}$，使得任意$\mathbf{x}$，都有 $\mathbb{L}[\mathbf{x}] = \mathbf{A}\mathbf{x}$
* 伴随变换：
* 行列式： $det(\mathbf{A}) = \sum\limits_{ \pi \ a \ permuation \ on \{1,\dots,n\}} sgn(\pi) \times \prod\limits_{i=1}^{n}A_{i,\pi(i)}$
* 矩阵的逆：

## 附录B 凸集合和凸函数



## 附录C 优化问题和优化条件



## 附录D 优化方法



## 附录E 高维统计的事实

