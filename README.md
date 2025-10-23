# ZL Date 项目

这是一个基于 Vue3 + JavaScript + Element Plus 的前端项目。

## 技术栈

- **Vue3**: 渐进式 JavaScript 框架
- **JavaScript**: 使用原生 JavaScript，无 TypeScript
- **Element Plus**: Vue3 UI 组件库
- **Vue Router**: 路由管理
- **Vite**: 构建工具

## 项目结构

```
zl-date/
├── src/
│   ├── components/     # 组件目录
│   ├── views/         # 页面组件
│   ├── router/        # 路由配置
│   ├── assets/        # 静态资源
│   ├── App.vue        # 根组件
│   └── main.js        # 入口文件
├── index.html         # HTML 模板
├── package.json       # 项目配置
└── vite.config.js     # Vite 配置
```

## 开发环境要求

- Node.js: 18.20.5
- npm: 10.8.2

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

4. 预览生产版本：
```bash
npm run preview
```

## 功能特性

- ✅ Vue3 Composition API
- ✅ Element Plus UI 组件库
- ✅ Vue Router 路由管理
- ✅ 响应式布局
- ✅ 组件化开发
- ✅ 热重载开发体验

## 页面说明

- **首页**: 展示项目介绍和 Element Plus 组件演示
- **关于**: 项目技术栈和特性介绍

## 开发说明

项目使用 Vue3 的 Composition API 进行开发，所有组件都使用 `<script setup>` 语法。Element Plus 组件库已全局注册，可以直接在组件中使用。
