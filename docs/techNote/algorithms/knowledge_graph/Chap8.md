# Chap 8 知识图谱应用案例

#### 电商知识图谱的构建与应用

* 核心是商品，整个商业活动中有品牌商、平台运营、消费者、国家机构、物流商等多角色参与
* 面对不同消费者和细分市场，不同角色、不同市场、不同平台对商品描述侧重都不同，使得对同一个实体描述时会有不同定义，知识融合变得很重要。
* 电商知识图谱有大量的国家标准，行业规则，法律法规约束商品描述，存在大量人为经验来描述商品做到跟消费者需求匹配，知识推理变得很重要
* 参考阿里巴巴知识图谱构建

#### 图情知识图谱的构建与应用

* 图情知识图谱聚焦某一特定细分行业，以整合行业内图情资源为目标的知识图谱
* 图情知识图谱的构建一般采用自顶向下的方式进行建模，通常从资源类型数据入手
* 上海图书馆借鉴美国国会书目框架BibFrame对家谱、名人、手稿等资源构建知识体系，打造家谱服务平台，为研究者提供古籍循证服务
* 中国农业科学院聚焦水稻细分领域，整合论文专利新闻等行业资源，构建水稻知识图谱，为科研工作者提供行业[专业知识服务平台](http://www.ricedata.cn)

#### 生活娱乐知识图谱的构建与应用

* 海量数据和大规模分布式计算催生了以深度学习为代表的新一代AI浪潮，但深度学习缺乏可解释性、常识缺失、缺乏语义理解、依赖大量样本数据（标注成本高、冷启动）
* 业务应用：智能搜索、ToB商业赋能、金融风险管理和反欺诈

#### 企业商业知识图谱的构建和应用

* [天眼查](http://www.tianyancha.com)、[启信宝](http://www.qixin.com)、[企查查](http://www.qichacha.com)
* 应用集中于金融反欺诈、辅助信贷审核等，通过异常关联挖掘、企业风险评估、关联搜索、最终控制人和战略发展等方式，为行业客户提供智能服务和风险管理

#### 创投知识图谱的构建和应用

* 2007，在美国旧金山创立的[Crunchbase](https://www.crunchbase.com)
* 国内人工智能股权投融资服务平台[因果树](https://www.innotree.cn)

#### 中医临床领域知识图谱的构建和应用

* 略

#### 金融证券行业知识图谱应用实践

* 金融证券行业面临着数据爆炸的问题，传统金融数据服务商历时数十年，收集整理了大量高质量的结构化数据，并分门别类地展示给用户，行研人员相当于脑子里有一个知识图谱，当某个数据变动时，可以分析推理出各种观点并进行预测
* 构建金融证券领域知识图谱作为金融证券文本语义理解和知识探索的关键基础技术，为未来金融证券领域文本分析、舆情监控、知识发现、模式挖掘、推理决策等提供坚实支撑
* 金融领域知识图谱常见实体包括：公司、产品、证券、人，实体间的关系有：
  * 公司-人关系：股权关系和任职关系（来源于工商局登记注册公开信息，结构化程度高，易获取）
  * 公司-公司关系：股权关系、供应商关系、竞争关系
  * 公司-产品关系：生产关系、采购关系
  * 产品-产品关系：上下游关系（碎片化，难以抽取）
* 应用实例
  * 关联关系推理：通过知识图谱路径查询或子图发现方法，帮助监管层发掘潜在违规行为
  * 产业链关系推理：模拟经济学的涟漪效应，判断节点变化如何影响全局