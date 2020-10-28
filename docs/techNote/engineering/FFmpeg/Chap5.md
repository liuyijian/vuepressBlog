# Chap5 FFmpeg 流媒体

## FFmpeg发布与录制RTMP流

* RTMP是最常见的实时直播，为了防止错过精彩画面，考虑将RTMP流录制下来

#### RTMP参数说明

* ![image-20201027123227994](https://tva1.sinaimg.cn/large/0081Kckwly1gk3s81ulooj311m0u0h2g.jpg)

#### RTMP参数举例

* rtmp_app和rtmp_playpath参数（设置推流发布点和流名称）

  * 录制命令：``ffmpeg -rtmp_app live -rtmp_playpath class -i rtmp://publish.chinaffmpeg.com -c copy -f flv output.flv``

  * 发布命令：``ffmpeg -re -i input.mp4 -c copy -f flv -rtmp_app live -rtmp_playpath class rtmp://publish.chinaffmpeg.com``

  * 等价的简洁命令：``ffmpeg -i input.mp4 -c copy -f flv rtmp://publish.chinaffmeg.com/live/class``

* rtmp_pageurl参数（在RTMP服务器中可以根据这个消息进行referer防盗链操作）

  * ``-rtmp_pageurl "http://www.chinaffmpeg.com"``

  * 同理还有swfUrl和tcUrl参数，具体可以看文档了解

## FFmpeg录制RTSP流

* RTSP曾经是主流直播方式，互联网已大多转向RTMP、HTTP+FLV、HLS、DASH等方式，但RTSP在安防领域仍常见
* 使用RTSP拉流时，常因采用UDP方式导致丢包异常，所以在实时性与可靠性适中时，考虑采用TCP方式拉流

#### RTSP参数说明

* ![image-20201027124539872](https://tva1.sinaimg.cn/large/0081Kckwly1gk3slstmmbj311o0t2qf3.jpg)

#### RTSP参数使用举例

* TCP方式录制RTSP直播流：``ffmpeg -rtsp_transport tcp -i rtsp://47.90.47.25/test.ts -c copy -f mp4 output.mp4``

* User-Agent设置参数（服务器端区分是否自己访问）：``-user-agent "ChinaFFmpeg-Player"``

## FFmpeg录制HTTP流

* 在流媒体点播中，HTTP服务最为常见，可以使用HTTP传输FLV直播流、TS直播流或M3U8文件等
* FFmpeg的HTTP可以作为客户端使用（场景更多、重点说明）、服务端使用

#### HTTP参数说明

* ![image-20201027125521653](https://tva1.sinaimg.cn/large/0081Kckwly1gk3svuuumcj310q0ogk2l.jpg)

#### HTTP参数使用举例

* seekable参数（若起始位置不为0，不设定此参数会导致阻塞）：
  * ``ffmpeg -ss 300 -seekable 1 -i http://bbs.chinaffmpeg.com/test.ts -c copy -y output.mp4``

* headers参数
  * 设置referer的例子：``ffmpeg -headers "referer: http://bbs.chinaffmpeg.com/index.html" -i http://play.chinaffmeg.com/live/class.flv -c copy -f flv -y output.flv``

* user_agent参数
  * FFmpeg连接HTTP时采用的默认User-Agent为``Lavf``，常见的User-Agent包括FireFox、Chrome、IE以及安卓的StageFright、IOS的QuickTIme等，可自定义设置，如``-user_agent "lyj"``

#### HTTP拉流录制

* 可对HTTP服务器中的流媒体进行录制，还可以转封装，如FLV直播可录制为HLS、MP4、FLV等（编码支持即可）
* 例子：``ffmpeg -i http://bbs.chinaffmpeg.com/live.ts -c copy -f flv output.flv``

## FFmpeg录制和发布UDP/TCP流

* FFmpeg的TCP与UDP传输常见于网络裸传输场景，

#### TCP与UDP参数说明

* ![image-20201027130718186](https://tva1.sinaimg.cn/large/0081Kckwly1gk3ta83d1xj31090u0tj1.jpg)

#### TCP与UDP参数使用举例

* TCP监听接收流（等待客户端连接本地1234端口）
  * ``ffmpeg -listen 1 -f flv -i tcp://127.0.0.1:1234/live/stream -c copy -f flv output.flv``

* TCP请求发布流（服务端监听格式和客户端发布格式相同才能正常运行！）
  * ``ffmpeg -re -i input.mp4 -c copy -f flv tcp://127.0.0.1:1234/live/stream``

* 监听端口超时 (5秒内未收到请求则自动退出监听)
  * ``ffmpeg -listen_timeout 5000 -listen 1 -f flv -i tcp://127.0.0.1:1234/live/stream -c copy -f flv output.flv``

* 拉流超时（20秒无数据则退出，解放客户端）
  * ``ffmpeg -timeout 20000000 -i tcp://192.168.100.179:1935/live/stream -c copy -f flv output.flv``

* TCP传输buffer设置（send_buffer_size/recv_buffer_size 参数；buffer越小，传输越频繁，网络开销越大）
  * ``ffmpeg -re -i input.mp4 -c copy -send_buffer_size 265 -f flv tcp://192.168.100.179:1234/live/stream``

* 绑定本地UDP端口localport（不绑定的话系统默认分配）
  * ``ffmpeg -re -i input.mp4 -c copy -localport 23456 -f flv udp://192.168.100.179:1234/live/stream``

## FFmpeg推多路流

* 编码消耗的资源较转封装多，但很多时候只需要一次转码并且输出多个封装，这就衍生出了需求

#### 管道方式输出多路流

* 系统管道方式
  * ``ffmpeg -i input -acodec aac -vcodec libx264 -f flv - | ffmpeg -f mpegts -i - -c copy output1 -c copy output2 -c copy output3``

#### tee封装格式输出多路流

* tee封装格式
  * ``ffmpeg -re -i input.mp4 -vcodec libx264 -acodec aac -map 0 -f tee "[f=flv]rtmp://publish.chinaffmpeg.com/live/stream1 | [f=flv]rtmp:// publish.chinaffmpeg.com/live/stream2"``

#### tee协议输出多路流

* tee协议格式(3.1.3版本后支持)
  * ``ffmpeg -re -i input.mp4 -vcodec libx264 -acodec aac -f flv "tee:rtmp://publish.chinaffmpeg.com/live/stream1|rtmp://publish.chinaffmpeg.com/live/stream2"``

## FFmpeg生成HDS流

#### HDS参数说明

![image-20201027141445544](https://tva1.sinaimg.cn/large/0081Kckwly1gk3v6gnieej30yc08s77v.jpg)

#### HDS使用举例

* 生成output目录中的文件说明

```bash
output
-- index.f4m  (索引文件，主要为F4M参考标准中mainfest相关、Metadata信息等)
-- stream0.abst （文件流相关描述信息）
-- stream0Seg1-Frag1 （相似规则文件切片，文件切片中均为mdat信息）
-- stream0Seg1-Frag2
```

* window_size参数控制文件列表大小（只存4个文件）
  * ``ffmpeg -re -i input -c copy -f hds -window_size 4 output``
* extra_window_size参数控制文件列表大小（9个文件）
  * ``ffmpeg -re -input.mp4 -c copy -f hds -window_size 4 -extra_window_size 5 output``

## FFmpeg生成DASH流

#### DASH参数说明

![image-20201027143456633](https://tva1.sinaimg.cn/large/0081Kckwly1gk3vrgyr8rj30w00gowlh.jpg)

#### DASH参数使用举例

* 生成文件格式

```sh
-- index.mpd (索引文件)
-- init-stream0.m4s （初始化信息切片）
-- init-stream1.m4s
-- chunk-stream0-00204.m4s （视频切片）
-- chunk-stream0-00205.m4s
-- chunk-stream1-00204.m4s （音频切片）
-- chunk-stream1-00205.m4s
```

* 若使用 ``-single_file 1``参数，则得到文件列表如下

```sh
-- index-stream0.m4s
-- index-stream1.m4s
-- index.mpd
```