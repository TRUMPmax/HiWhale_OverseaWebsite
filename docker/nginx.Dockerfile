# syntax=docker/dockerfile:1

# 反向代理镜像：nginx + 站点配置

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
