# OpenClaw 7 Days 在线课程网站设计

## 1. 项目概述

- **项目名称**: OpenClaw 7 Days 课程网站
- **项目类型**: 静态内容展示网站
- **核心功能**: 展示 OpenClaw 8 课实战课程内容，支持目录导航和章节阅读
- **目标用户**: 开发者学习 OpenClaw

## 2. 技术方案

| 项目 | 选择 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 内容格式 | MDX (Markdown + React) |
| 样式 | Tailwind CSS |
| 部署 | Vercel |

## 3. 页面结构

```
/
├── 首页 (/)
│   └── 课程介绍 + 8课目录列表
├── 课程详情 (/courses/[slug])
│   └── 课程标题 + 章节内容
```

## 4. UI/UX 设计

### 布局
- 顶部导航栏：网站标题 + GitHub 链接
- 首页：Hero 区 + 课程卡片列表
- 课程页：返回按钮 + 标题 + Markdown 内容渲染

### 视觉风格
- 简洁现代的开发者风格
- 深色/浅色主题支持
- 响应式设计（手机/平板/桌面）

### 颜色
- 主色：OpenClaw 品牌色（蓝色系）
- 背景：浅灰/深灰
- 文字：深灰/白色

## 5. 数据结构

课程内容从 `/Users/zack/Documents/OpenClaw课程/` 读取：

```typescript
type Course = {
  slug: string;        // lesson1-openclaw-basics
  title: string;       // Lesson 1: OpenClaw 基础与环境搭建
  description: string; // 简短描述
  content: string;     // Markdown 内容
}
```

## 6. 功能列表

- [x] 首页展示 8 课课程列表
- [x] 点击课程卡片进入课程详情
- [x] 渲染 Markdown 内容（标题、代码块、列表等）
- [x] 响应式布局
- [x] 返回首页导航

## 7. 部署流程

1. 构建 Next.js 项目
2. 推送到 GitHub 仓库
3. Vercel 自动部署（已有仓库，已配置）

## 8. 验收标准

- [ ] 首页显示 8 课课程卡片
- [ ] 点击卡片可进入课程详情页
- [ ] Markdown 内容正确渲染（标题、代码、列表）
- [ ] 移动端正常显示
- [ ] 部署后可通过 https://openclaw-7-days.vercel.app 访问
