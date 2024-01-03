# 1、 need nginx

proxy to whitelist server API

location /whitelist-proxy/ {
  proxy_set_header host $host;
  proxy_set_header X-real-ip $remote_addr;
  proxy_set_header X-forward-for $proxy_add_x_forwarded_for;
  proxy_pass your server;
}
