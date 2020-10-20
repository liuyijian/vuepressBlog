# Chap9 成熟的媒体流

#### 简介

* Nginx 支持 MPEG-4 或 Flash Video 格式的流媒体
* Nginx Plus支持视频流限速传输，保证服务器性能能满足其他用户需求

#### MP4 and FLV

```nginx
http {
  server {
    ...
    # 告诉Nginx在videos目录下的文件是MP4格式的，可以用流传输来提供下载支持
    location /videos/ {
      	mp4;
    }
    # 告诉Nginx任意以.flv结尾的文件是flv文件格式的，可以用HTTP流传输
    location ~ \.flv$ {
      flv;
    }
  }
}
```

#### HLS

* Nginx Plus的HLS module支持HTTP Live Streaming，格式为 H.264/AAC 编码的MP4文件
* 若用户带宽够大，视频文件也大，则上调``hls_mp4_max_buffer_size``和``hls_fragment``

```nginx
location /hls/ {
  hls; 
  alias /var/www/video;
  hls_fragment 4s; # 将视频切割为4s一个片段
  hls_buffers 10 10m; # HLS有10个buffer，一个buffer 10M
  hls_mp4_buffer_size 1m; # 最初的MP4缓冲区大小设为1MB，最大为5MB
  hls_mp4_max_buffer_size 5m;
}
```

#### HDS

* 使用Nginx Plus的F4F模块，支持 Adobe's 的HTTP Dynamic Streaming

```nginx
location /video/ {
  alias /var/www/transformed_video;
  f4f;
  f4f_buffer_size 512k;
}
```

#### 带宽限制

* 使用Nginx Plus 的MP4 媒体文件限速模块，在不影响观影体验的情况下，限制下载带宽

```nginx
location {
	mp4;
	mp4_limit_rate_after 15s; # 下载15s后开始限速
	mp4_limit_rate 1.2; # 观影是一倍速，下载是1.2倍速
}
```