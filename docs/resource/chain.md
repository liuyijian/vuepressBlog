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

