# syntax=docker/dockerfile:1

# HiWhale API（占位服务）镜像

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=4000
RUN addgroup -S nodejs && adduser -S api -G nodejs
COPY api/server.js ./server.js
USER api
EXPOSE 4000
CMD ["node", "server.js"]
