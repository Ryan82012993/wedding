# 婚礼答谢宴邀请函系统

一个基于 React + Spring Boot 的婚礼答谢宴邀请函 Web 应用，包含精美的前端展示和宾客 RSVP（回复出席）功能。

## 项目结构

```
wedding/
├── wedding-frontend-app/    # 前端应用 (React + Vite)
├── wedding-backend/         # 后端应用 (Spring Boot)
└── README.md               # 项目文档
```

## 技术栈

### 前端
- **React 19** - UI 框架
- **Vite** - 构建工具
- **Material-UI** - UI 组件库
- **Axios** - HTTP 客户端

### 后端
- **Spring Boot** - Java Web 框架
- **H2 Database** - 内存数据库
- **Maven** - 项目构建工具

## 功能特性

- 🌸 精美的花瓣飘落动画效果
- 📱 响应式设计，支持移动端和桌面端
- 📝 宾客 RSVP 表单（姓名、赴宴人数）
- 💌 婚礼信息展示（时间、地点）
- 📊 后端数据持久化存储

## 快速开始

### 环境要求

- **Node.js** >= 18.x
- **Java** >= 17
- **Maven** >= 3.8

### 安装与启动

#### 1. 启动后端服务

```bash
cd wedding-backend
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动。

#### 2. 启动前端服务

打开新的终端窗口：

```bash
cd wedding-frontend-app
npm install
npm run dev
```

前端服务将在 `http://localhost:8081` 启动。

### 生产环境部署

#### 前端构建

```bash
cd wedding-frontend-app
npm run build
```

构建产物将直接输出到 `wedding-backend/src/main/resources/static/` 目录，由 Spring Boot 统一提供访问。

#### 后端打包

```bash
cd wedding-backend
mvn package
```

打包后的 JAR 文件位于 `target/` 目录。

## 配置说明

### 后端配置

后端配置文件位于 `wedding-backend/src/main/resources/application.properties`：

```properties
# 应用名称
spring.application.name=wedding-backend

# H2 数据库配置
spring.datasource.url=jdbc:h2:mem:weddingdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# H2 控制台（开发环境可用）
spring.h2.console.enabled=true

# 服务端口
server.port=8080
```

### 前端配置

前端代理配置位于 `wedding-frontend-app/vite.config.js`：

- 开发模式：前端运行在 `http://localhost:8081`
- `/api` 请求代理到后端 `http://127.0.0.1:8080`
- 构建模式：静态文件输出到后端 `static` 目录

## API 接口

### RSVP 相关接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/rsvps` | 提交宾客 RSVP 信息 |
| GET | `/api/rsvps` | 获取所有 RSVP 记录 |

### 请求示例

```json
POST /api/rsvps
{
  "name": "张三",
  "numberOfGuests": 2
}
```

## 自定义内容

### 修改婚礼信息

编辑 `wedding-frontend-app/src/App.jsx` 文件，找到以下内容进行修改：

```jsx
// 时间信息
<strong>时间：</strong> 9 月 12 日 晚上 18 点

// 地点信息
<strong>地点：</strong> 新福彩海鲜酒家
```

### 更换照片

将您的照片放入 `wedding-frontend-app/src/assets/` 目录，然后在 `App.jsx` 中替换照片预留位的 `<img>` 标签。

### 修改主题颜色

编辑 `wedding-frontend-app/src/App.jsx` 中的主题配置：

```jsx
const theme = createTheme({
  palette: {
    primary: {
      main: "#d32f2f", // 主色调（喜庆红）
    },
    secondary: {
      main: "#ffb300", // 辅助色（金色）
    },
    // ...
  },
});
```

## 开发注意事项

1. **跨域问题**：前端开发时通过 Vite 代理解决跨域，确保后端服务已启动。
2. **数据持久化**：当前使用 H2 内存数据库，重启后端服务后数据会清空。如需持久化，可修改为 MySQL 等数据库。
3. **热更新**：前端和后端都支持热更新，修改代码后会自动刷新。

## 常见问题

### 前端无法连接后端

1. 确认后端服务已启动（`http://localhost:8080` 可访问）
2. 检查 `vite.config.js` 中的代理配置

### 后端启动失败

1. 确认 Java 版本 >= 17
2. 检查 8080 端口是否被占用

### 花瓣动画不流畅

1. 减少花瓣数量（修改 `App.jsx` 中的计算逻辑）
2. 检查浏览器性能

## 部署指南：让不同网络的人都能访问

### 方案一：使用内网穿透工具（推荐，简单快捷）

当前项目推荐使用单地址部署：

1. 前端先构建到后端静态目录
2. 启动 Spring Boot
3. natapp 只暴露后端 `8080`

这样外网访问同一个公网地址时：

- 页面由 Spring Boot 返回
- `/api/rsvps` 也由同一个 Spring Boot 处理

不需要再为前端和后端分别开两个隧道

#### 使用 Ngrok

1. **安装 Ngrok**
   - 访问 [https://ngrok.com](https://ngrok.com) 注册并下载客户端
   - 或使用国内替代品如 [natapp](https://natapp.cn)

2. **构建前端并启动后端**
   ```bash
   cd wedding-frontend-app
   npm install
   npm run build

   cd ../wedding-backend
   mvn spring-boot:run
   ```

3. **启动后端穿透**
   ```bash
   # 启动后端后，在新终端运行
   ngrok http 8080
   ```
   记下生成的公网 URL（如 `https://abc123.ngrok.io`）

4. **修改后端配置**
   
   编辑 `wedding-backend/src/main/resources/application.properties`，添加：
   ```properties
   # 允许跨域访问
   server.address=0.0.0.0
   ```

### 方案二：部署到云服务器（适合长期使用）

#### 1. 准备云服务器

- 阿里云/腾讯云 ECS（最低配置 1 核 2G 即可）
- 确保开放端口：80（HTTP）、443（HTTPS）、8080（后端 API）

#### 2. 安装环境

```bash
# 安装 Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 安装 Java
sudo yum install -y java-17-openjdk

# 安装 Nginx
sudo yum install -y nginx
```

#### 3. 部署后端

```bash
# 上传 JAR 包到服务器
scp wedding-backend/target/wedding-backend-0.0.1-SNAPSHOT.jar user@your-server:/opt/wedding/

# 创建 systemd 服务
sudo nano /etc/systemd/system/wedding-backend.service
```

服务配置：
```ini
[Unit]
Description=Wedding Backend Service
After=syslog.target network.target

[Service]
User=root
ExecStart=/usr/bin/java -jar /opt/wedding/wedding-backend-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable wedding-backend
sudo systemctl start wedding-backend
```

#### 4. 部署前端

```bash
# 构建前端
cd wedding-frontend-app
npm run build

# 上传 dist 到服务器 Nginx 目录
scp -r dist/* user@your-server:/usr/share/nginx/html/
```

#### 5. 配置 Nginx

```bash
sudo nano /etc/nginx/conf.d/wedding.conf
```

Nginx 配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 你的域名或服务器 IP

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

启动 Nginx：
```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 方案三：使用 Docker 容器化部署

#### 1. 创建 Dockerfile

**后端 Dockerfile** (`wedding-backend/Dockerfile`)：
```dockerfile
FROM openjdk:17-slim
WORKDIR /app
COPY target/wedding-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**前端 Dockerfile** (`wedding-frontend-app/Dockerfile`)：
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 Docker Compose 配置

在项目根目录创建 `docker-compose.yml`：
```yaml
version: '3.8'
services:
  backend:
    build: ./wedding-backend
    ports:
      - "8080:8080"
    networks:
      - wedding-network

  frontend:
    build: ./wedding-frontend-app
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - wedding-network

networks:
  wedding-network:
    driver: bridge
```

#### 3. 启动容器

```bash
docker-compose up -d
```

现在可以通过服务器 IP 访问应用。

---

## 安全建议

1. **启用 HTTPS**：使用 Let's Encrypt 免费证书
2. **数据库持久化**：将 H2 改为 MySQL/PostgreSQL
3. **API 限流**：防止恶意提交
4. **防火墙配置**：只开放必要端口

## 许可证

本项目仅供学习和个人使用。
