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
                  }
                ]
              }
            ]
          },
          {
            text: '投资心得',
            ariaLabel: 'InvestNote',
            link: '/investNote/'
          },
          {
            text: '资源聚合',
            ariaLabel: 'Resource',
            link: '/resource/'
          },
          {
            text: '代码仓库',
            ariaLabel: 'Github',
            link: 'https://www.github.com/liuyijian'
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
          "/investNote/": [{
            title: '投资心得',
            collapsable: false,
            children: [
              ''
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