# 工具链

## 一、远程操控 && 内网穿透

1、下载[frp](https://github.com/fatedier/frp/releases)，注意和操作系统对应，macOS，linux，windows；将其中的 frpc 拷贝到内网服务所在的机器上，将 frps 拷贝到具有公网 IP 的机器上，放置在任意目录。

2、编写服务端配置文件`frps.ini`, 设置了 frp 服务器用户接收客户端连接的端口

```ini
[common]
bind_port = 7000
```

3、编写客户端配置文件``frpc.ini``，其中`local_ip` 和 `local_port` 配置为本地需要暴露到公网的服务地址和端口。`remote_port` 表示在 frp 服务端监听的端口，访问此端口的流量将会被转发到本地服务对应的端口

```ini
[common]
server_addr = xxx.xxx.xxx.xxx
server_port = 7000

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 5900
remote_port = 6000
```

4、在公网机器上通过 `./frps -c ./frps.ini` 启动服务端，若无权限则```sudo chmod -R 777 .```

5、在内网机器上通过 `./frpc -c ./frpc.ini` 启动客户端，注意，公网服务器安全组要放开6000和7000端口，否则连接不上

6、如果需要在后台长期运行，建议结合其他工具使用，例如 `systemd` 和 `supervisor`

7、内网机器装好vncserver，菜单Options的Security选择 VNC Password，User & Permissions中点击用户user，设置密码

8、任意机器装好vncviewer，连接 xxx.xxx.xxx.xxx:6000，输入7中设置的用户的账号密码即能远程操控内网机器

## 二、Python环境配置（Linux）

### 1、安装Anaconda或Miniconda

#### 下载地址

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

### 2、深度学习环境搭建

#### 安装Nvidia显卡驱动

* 从 https://www.nvidia.cn/Download/index.aspx?lang=cn中选择合适的驱动
* 下载如``NVIDIA-Linux-x86_64-470.82.01.run`` 文件并执行安装
* 输入``nvidia-smi``验证安装

#### 安装Cuda驱动

* 从https://developer.nvidia.com/cuda-toolkit-archive中选择合适的驱动

* 下载本地安装器如``cuda_11.4.4_470.82.01_linux.run``文件并执行安装，不用勾选driver

* 配置环境变量

  * ```bash
    echo "export PATH=/usr/local/cuda-11.4/bin:$PATH" >> ~/.bashrc
    echo "export LD_LIBRARY_PATH=/usr/local/cuda-11.4/lib64:$LD_LIBRARY_PATH" >> ~/.bashrc
    source ~/.bashrc
    ```

* 参考链接： https://blog.csdn.net/weixin_42656358/article/details/108772841?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_default&utm_relevant_index=1

#### 安装cuDNN

* 从https://developer.nvidia.com/rdp/cudnn-archive中选择合适的版本，输入``arch``命令查看架构类型

* 下载本地安装器，因为有权限控制，只能网页下载

* ```bash
  tar -xzvf cudnn-11.4-linux-x64-v8.2.4.15.tgz
  cp cuda/include/cudnn.h /usr/local/cuda-11.4/include
  cp cuda/lib64/libcudnn* /usr/local/cuda-11.4/lib64
  chmod a+r /usr/local/cuda-11.4/include/cudnn.h /usr/local/cuda-11.4/lib64/libcudnn*
  # 查询cuDNN版本（不太行）
  cat /usr/local/cuda-11.4/include/cudnn.h | grep CUDNN_MAJOR -A 2 
  ```

参考链接：https://zhuanlan.zhihu.com/p/91334380

### 3、Open-mmlab开发

```bash
conda create -n mmlab python=3.9
conda activate mmlab
python -m pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu113
# 注意版本问题 https://github.com/open-mmlab/mmcv/blob/master/README_zh-CN.md
python -m pip install mmcv-full -f https://download.openmmlab.com/mmcv/dist/cu113/torch1.11.0/index.html
python -m pip install mmdet
```

