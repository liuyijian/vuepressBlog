(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{451:function(v,_,t){"use strict";t.r(_);var e=t(15),d=Object(e.a)({},(function(){var v=this,_=v.$createElement,t=v._self._c||_;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("h1",{attrs:{id:"chap-2-知识存储"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#chap-2-知识存储"}},[v._v("#")]),v._v(" Chap 2 知识存储")]),v._v(" "),t("ul",[t("li",[v._v("基于关系数据库的存储方案")])]),v._v(" "),t("table",[t("thead",[t("tr",[t("th",[v._v("存储方法")]),v._v(" "),t("th",[v._v("描述")]),v._v(" "),t("th",[v._v("优点")]),v._v(" "),t("th",[v._v("缺点")]),v._v(" "),t("th",[v._v("代表产品")])])]),v._v(" "),t("tbody",[t("tr",[t("td",[v._v("三元组表")]),v._v(" "),t("td",[v._v("每行记录存储一个三元组")]),v._v(" "),t("td",[v._v("简单清晰")]),v._v(" "),t("td",[v._v("自连接效率低下")]),v._v(" "),t("td",[v._v("3store")])]),v._v(" "),t("tr",[t("td",[v._v("水平表")]),v._v(" "),t("td",[v._v("每行记录存储一个主语的所有谓语和宾语")]),v._v(" "),t("td",[v._v("简化查询操作")]),v._v(" "),t("td",[v._v("列数等于图谱的谓语总数，存在大量空值，无法满足一对多关系，改动成本大")]),v._v(" "),t("td",[v._v("DLDB")])]),v._v(" "),t("tr",[t("td",[v._v("属性表")]),v._v(" "),t("td",[v._v("对水平表的细化，根据主语类型分表，解决列数过多问题")]),v._v(" "),t("td",[v._v("克服了三元组表的自连接问题，解决了水平表中列数过多和空值问题")]),v._v(" "),t("td",[v._v("主语类别可能很多，表数到达上限，多表连接效率低")]),v._v(" "),t("td",[v._v("Jena")])]),v._v(" "),t("tr",[t("td",[v._v("垂直划分")]),v._v(" "),t("td",[v._v("以三元组谓语作为划分维度，将RDF划分为若干张仅包含主宾两列的表")]),v._v(" "),t("td",[v._v("解决空值多值问题，可用归并排序执行表连接操作")]),v._v(" "),t("td",[v._v("表数过多，改动成本大")]),v._v(" "),t("td",[v._v("SW-Store")])]),v._v(" "),t("tr",[t("td",[v._v("六重索引")]),v._v(" "),t("td",[v._v("三元组6种全排列对应建立6张表，空间换时间策略")]),v._v(" "),t("td",[v._v("前缀查找快速")]),v._v(" "),t("td",[v._v("改动成本大，6倍空间开销")]),v._v(" "),t("td",[v._v("RDF-3X，Hexastore")])]),v._v(" "),t("tr",[t("td",[v._v("DB2RDF")]),v._v(" "),t("td",[v._v("4张表组成，dph表的列作为谓语和宾语的存储位置，而并非将列与谓语绑定，插入数据时，使用散列函数将谓语动态映射到某列")]),v._v(" "),t("td"),v._v(" "),t("td"),v._v(" "),t("td")])])]),v._v(" "),t("ul",[t("li",[v._v("面向RDF的三元组数据库："),t("code",[v._v("RDF4J")]),v._v(", "),t("code",[v._v("RDF-3X")]),v._v(", "),t("code",[v._v("gStore")]),v._v(", "),t("code",[v._v("Virtuoso")]),v._v(", "),t("code",[v._v("AllegroGraph")]),v._v(", "),t("code",[v._v("GraphDB")]),v._v(", "),t("code",[v._v("BlazeGraph")])]),v._v(" "),t("li",[v._v("原生图数据库\n"),t("ul",[t("li",[t("code",[v._v("Neo4j")]),v._v(": 最流行，Java编写，通过每个节点存一份副本来实现伪分布式，具备ACID事务处理功能")]),v._v(" "),t("li",[t("code",[v._v("JanusGraph")]),v._v("：借助分布式索引库ElasticSearch，solr，Lucene实现数据检索，支持多用户并发访问和实时图遍历查询，具备基于MapReduce的图分析引擎")]),v._v(" "),t("li",[t("code",[v._v("OrientDB")]),v._v("：Java编写，支持无模式数据，支持Gremlin和Cypher查询")]),v._v(" "),t("li",[t("code",[v._v("Cayley")]),v._v("：Golang编写，提供RESTAPI，支持Gizmo，GraphQL，MQL等查询语言，支持Bolt，LevelDB，MongoDB，CouchDB，PouchDB，ElasticSearch，PostgreSQL，MySQL等存储后端，具有良好的模块化设计")]),v._v(" "),t("li",[t("code",[v._v("dGraph")]),v._v("：Golang编写，发展比Cayley好，真正的分布式，比较年轻，有望替代Neo4j")])])])])])}),[],!1,null,null,null);_.default=d.exports}}]);