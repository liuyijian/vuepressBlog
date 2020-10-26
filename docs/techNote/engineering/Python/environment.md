# 环境配置



## 项目虚拟环境配置

#### 基本用法

* 安装好pipenv:``pip3 install pipenv``

* 新建项目目录:``mkdir project`` ``cd project``

* 安装虚拟环境(先确保本地已经安装了python)(如果项目中有requirements.txt文件，pipenv会在安装的时候自动导入) ：``export PIPENV_VENV_IN_PROJECT=1`` ``pipenv --python 3.7``

* 换源以提高包下载速度：将pipfile文件的url属性的值替换为``url = "https://pypi.tuna.tsinghua.edu.cn/simple/"``

* 激活虚拟环境 ``pipenv shell``，退出虚拟环境``exit``

* 安装第三方包(若之前没安装)(先备好``requirements.txt``文件在项目目录下)：``pipenv install -r requirements.txt``

* 查看已安装包的依赖关系 ``pipenv graph``

* 导出已安装包的列表 `` pipenv lock -r  > requirements_out.txt``

* 仅导出开发使用的包 `` pipenv lock -r --dev  > requirements_out_dev.txt``

#### 参考资料

* [pipenv官方文档](https://pipenv.pypa.io/en/latest/)