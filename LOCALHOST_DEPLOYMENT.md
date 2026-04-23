# Localhost Deployment Guide

## 目标

在不修改现有前端页面和数据库数据内容的前提下，将网站部署到本机 `localhost`。

## 一键启动

在仓库根目录执行：

```bash
bash scripts/start-local-web.sh
```

默认端口是 `8080`，启动后可访问：

- `http://localhost:8080/`（推荐，和当前发布站点结构一致）
- `http://localhost:8080/index.html`（与云端 GitHub Pages 界面一致）
- `http://localhost:8080/frontend/index.html`（开发页面）

## 自定义端口

```bash
PORT=9000 bash scripts/start-local-web.sh
```

访问：

- `http://localhost:9000/_site/index.html`

## 说明

- 部署仅新增本地服务层：`scripts/local-web-server.js`
- 每次启动会自动从 `.github/workflows/deploy-pages.yml` 同步云端同款页面文件到 `_site`
- 不会修改数据库内容（`backend/data`、`data`、`_site/data`）
- 不会修改前端样式和交互逻辑（`frontend`、`_site`）
- 本地服务兼容 `GET /api/materials` 查询接口，适配现有页面调用

## 如果网页打不开

- 端口被占用：

```bash
PORT=9000 bash scripts/start-local-web.sh
```

- 如果你在 Dev Container / Codespaces 中运行：

`localhost:8080` 只在容器内部可见，请使用 VS Code `Ports` 面板中转发后的 URL 访问。
