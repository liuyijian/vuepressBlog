module.exports = {
    base: '/vuepressBlog/',
    title: 'lyj Blog',
    description: '我来到，我看见，我记录',
    head: [
        ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css' }],
        ['link', { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" }]
    ],
    themeConfig: {
        nav: [
          {
            text: '首页',
            ariaLabel: 'Homepage',
            link: '/'
          },
          {
            text: '技术笔记',
            ariaLabel: 'TechNote',
            items: [
              {
                text: '算法原理',
                ariaLabel: 'algorithms',
                items: [
                  {
                    text: '基础算法',
                    link: '/techNote/algorithms/basic/'
                  },
                  {
                    text: '推荐系统',
                    link: '/techNote/algorithms/recommendation_system/'
                  },
                  {
                    text: '知识图谱',
                    link: '/techNote/algorithms/knowledge_graph/'
                  }
                ]
              },
              {
                text: '工程实践',
                ariaLabel: 'engineering',
                items: [
                  {
                    text: 'Redis',
                    link: '/techNote/engineering/Redis/'
                  },
                  {
                    text: 'Nginx',
                    link: '/techNote/engineering/Nginx/'
                  },
                  {
                    text: 'FFmpeg',
                    link: '/techNote/engineering/FFmpeg/'
                  },
                  {
                    text: 'Python',
                    link: '/techNote/engineering/Python/'
                  },
                  {
                    text: 'JavaScript',
                    link: '/techNote/engineering/JavaScript'
                  }
                ]
              }
            ]
          },
          {
            text: '投资心得',
            ariaLabel: 'InvestNote',
            items:[
              {
                text: '经济',
                link: '/investNote/economic/'
              },
              {
                text: '缠论',
                link: '/investNote/chan/'
              },
              {
                text: '期权',
                link: '/investNote/options/'
              },
            ]
          },
          {
            text: '资源聚合',
            ariaLabel: 'Resource',
            link: '/resource/'
          }
        ],
        sidebar: {
          "/techNote/algorithms/basic/": [{
            title: '基础算法',
            collapsable: false,
            children: [
                {title: 'Chap1 递归与分治', path:'Chap1'},
                {title: 'Chap2 动态规划', path:'Chap2'},
                {title: 'Chap3 贪心', path:'Chap3'},
              ]
          }],
          "/techNote/algorithms/recommendation_system/": [{
            title: '推荐系统',
            collapsable: false,
            children: [
                {title: 'Chap1 简介', path:'Chap1'},
                {title: 'Chap2 基于邻域的推荐方法综述', path:'Chap2'},
                {title: 'Chap3 协同过滤方法进阶', path:'Chap3'},
                {title: 'Chap4 基于内容的语义感知系统', path:'Chap4'},
                {title: 'Chap5 基于约束的推荐系统', path:'Chap5'},
                {title: 'Chap6 情境感知推荐系统', path:'Chap6'},
                {title: 'Chap7 推荐系统中的数据挖掘方法', path:'Chap7'},
                {title: 'Chap8 推荐系统的评估', path:'Chap8'},
              ]
          }],
          "/techNote/algorithms/knowledge_graph/": [{
            title: '知识图谱',
            collapsable: false,
            children: [
                {title: 'Chap1 知识图谱表示与建模', path:'Chap1'},
                {title: 'Chap2 知识存储', path:'Chap2'},
                {title: 'Chap3 知识抽取和知识挖掘', path:'Chap3'},
                {title: 'Chap4 知识图谱融合', path:'Chap4'},
                {title: 'Chap5 知识图谱推理', path:'Chap5'},
                {title: 'Chap6 语义搜索', path:'Chap6'},
                {title: 'Chap7 知识问答', path:'Chap7'},
                {title: 'Chap8 知识图谱应用实例', path:'Chap8'},
              ]
          }],
          "/techNote/engineering/Redis/": [{
            title: 'Redis 学习笔记',
            collapsable: false,
            children: [
              {title: 'Chap1 基础和应用', path:'Chap1'},
              {title: 'Chap2 原理', path:'Chap2'},
              {title: 'Chap3 集群', path:'Chap3'},
              {title: 'Chap4 拓展', path:'Chap4'},
              {title: 'Chap5 源码', path:'Chap5'},
            ]
          }],
          "/techNote/engineering/Nginx/": [{
            title: 'Nginx 学习笔记',
            collapsable: false,
            children: [
              {title: 'Chap1 基础和应用', path:'Chap1'},
              {title: 'Chap2 高性能负载均衡', path:'Chap2'},
              {title: 'Chap3 流量管理', path:'Chap3'},
              {title: 'Chap4 大规模可扩展的内容缓存', path:'Chap4'},
              {title: 'Chap5 可编程和自动化', path:'Chap5'},
              {title: 'Chap6 认证', path:'Chap6'},
              {title: 'Chap7 安全控制', path:'Chap7'},
              {title: 'Chap8 HTTP2', path:'Chap8'},
              {title: 'Chap9 成熟的媒体流', path:'Chap9'},
              {title: 'Chap10 云部署', path:'Chap10'},
              {title: 'Chap11 容器和微服务', path:'Chap11'},
              {title: 'Chap12 高可用部署模式', path:'Chap12'},
              {title: 'Chap13 进阶活动监控', path:'Chap13'},
              {title: 'Chap14 调试、错误定位、请求追踪', path:'Chap14'},
              {title: 'Chap15 性能调优', path:'Chap15'},
              {title: 'Chap16 实用操作建议和总结', path:'Chap16'},
            ]
          }],
          "/techNote/engineering/FFmpeg/":[{
            title: 'FFmpeg 学习笔记',
            collapsable: false,
            children: [
              {title: 'Chap1 FFmpeg简介', path: 'Chap1'},
              {title: 'Chap2 FFmpeg工具使用基础 ', path: 'Chap2'},
              {title: 'Chap3 FFmpeg转封装', path: 'Chap3'},
              {title: 'Chap4 FFmpeg转码', path: 'Chap4'},
              {title: 'Chap5 FFmpeg流媒体', path: 'Chap5'},
              {title: 'Chap6 FFmpeg滤镜使用', path: 'Chap6'},
              {title: 'Chap7 FFmpeg采集设备', path: 'Chap7'},
            ]
          }],
          "/techNote/engineering/JavaScript/":[{
            title: 'JavaScript 学习笔记',
            collapsable: false,
            children: [
              {title: 'Chap1 什么是JavaScript', path: 'Chap1'},
              {title: 'Chap2 HTML中的JavaScript ', path: 'Chap2'},
              {title: 'Chap3 语言基础', path: 'Chap3'},
              {title: 'Chap4 变量、作用域与内存', path: 'Chap4'},
              {title: 'Chap5 基本引用类型', path: 'Chap5'},
              {title: 'Chap6 集合引用类型', path: 'Chap6'},
              {title: 'Chap7 迭代器与生成器', path: 'Chap7'},
              {title: 'Chap8 对象、类与面向对象编程', path: 'Chap8'},
              {title: 'Chap9 代理与反射', path: 'Chap9'},
              {title: 'Chap10 函数', path: 'Chap10'},
              {title: 'Chap11 期约与异步函数', path: 'Chap11'},
              {title: 'Chap12 BOM', path: 'Chap12'},
              {title: 'Chap13 客户端检测', path: 'Chap13'},
              {title: 'Chap14 DOM', path: 'Chap14'},
              {title: 'Chap15 DOM扩展', path: 'Chap15'},
              {title: 'Chap16 DOM2 和 DOM3', path: 'Chap16'},
              {title: 'Chap17 事件', path: 'Chap17'},
              {title: 'Chap18 动画与Canvas图形', path: 'Chap18'},
              {title: 'Chap19 表单脚本', path: 'Chap19'},
              {title: 'Chap20 JavaScript API', path: 'Chap20'},
              {title: 'Chap21 错误处理与调试', path: 'Chap21'},
              {title: 'Chap22 处理XML', path: 'Chap22'},
              {title: 'Chap23 JSON', path: 'Chap23'},
              {title: 'Chap24 网络请求与远程资源', path: 'Chap24'},
              {title: 'Chap25 客户端存储', path: 'Chap25'},
              {title: 'Chap26 模块', path: 'Chap26'},
              {title: 'Chap27 工作者线程', path: 'Chap27'},
              {title: 'Chap28 最佳实践', path: 'Chap28'},
              {title: 'Chap29 附录', path: 'Chap29'},
            ]
          }],
          "/techNote/engineering/Python/":[{
            title: 'Python 学习笔记',
            collapsable: false,
            children: [
              {title: 'Python环境配置', path: 'environment'},
              {title: 'Python标准库 ', path: 'stl'},
            ]
          }],
          "/investNote/economic/": [{
            title: '经济学',
            collapsable: false,
            children: [
              {title: '《结构性改革》读书笔记', path:'structural_reform'}
            ]
          }],
          "/investNote/chan/": [{
            title: '缠论',
            collapsable: false,
            children: [
            ]
          }],
          "/investNote/options/": [{
            title: '期权',
            collapsable: false,
            children: [
              {title: '《三小时快学期权》读书笔记', path:'three_hours_to_learn_options'}
            ]
          }],
          "/resource/": [{
            title: '资源聚合',
            collapsable: false,
            children: [
              {title: '电子书籍', path:'ebook'},
              {title: '官方文档', path:'officialdoc'},
              {title: '开源项目', path:'openproject'},
              {title: '技术文章', path:'article'},
            ]
          }],
        },
        repo: 'liuyijian/vuepressBlog',
        repoLabel: 'Github',
        docsDir: 'docs',
        docsBranch: 'main',
        lastUpdated: '最后更新',
        smoothScroll: true,
        displayAllHeaders: true
    },
    markdown: {
      extractHeaders: ['h1','h2']
    },
    plugins: {
      'vuepress-plugin-mathjax': {target: 'svg',},
      '@maginapp/vuepress-plugin-katex':{},
      '@vuepress/back-to-top': {},
      'vuepress-plugin-helper-live2d': {model: 'epsilon2_1'},
    },
}