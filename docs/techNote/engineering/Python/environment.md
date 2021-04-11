# 环境配置



#### 1、安装Anaconda或Miniconda

##### 下载地址

* Anaconda(附带常用数据分析库，约500MB)：https://www.anaconda.com/products/individual
* Miniconda(精简版，约50MB)：https://docs.conda.io/en/latest/miniconda.html

#### 常用命令

* 进入conda环境（看到base则证明成功）：``conda``
* 展示已安装的包：``conda list``
* 安装一个新的包：``conda install [package]``
* 搜索一个包： ``conda search [package]``

* 添加清华源和conda-forge源

  * ``conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/``

  * ``conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/``
  * ``conda config --add channels conda-forge``

  * ``conda config --set show_channel_urls yes``

* 若报错 ``Solving environment: failed with initial frozen solve. Retrying with flexible solve``
  * ``conda config --set channel_priority flexible``

* 若报错 ``JSON.decode error``
  * ``conda clean –i``

* 虚拟环境
  * 新建环境：``conda create -n webcrawler python=3.8``
  * 进入环境：``conda activate webcrawler``
  * 退出环境：``conda deactivate``

* 配置文件导入导出
  * 通过配置文件安装：``conda env from [xxx.yml]``
  * 导出当前配置：``conda env export > [xxx.yml]``

#### 2、安装Jupyterlab3交互式代码编辑器

* 安装jupyterlab3：``conda install jupyterlab=3``

* 安装汉化包：
  * ``pip install jupyterlab_language_pack_zh_CN-0.0.1.dev0-py2.py3-none-any.whl ``
  * ``jupyter-lab``
  * 进入网页环境，菜单settings-language中切换成中文
* 安装代码自动提示插件
  * 网页环境的extensions中搜索kite并安装，需要预先配置nodejs环境

