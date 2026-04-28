# 第一节：OpenClaw 基础与环境搭建

## 学习目标
- 理解 OpenClaw 架构与核心概念
- 完成开发环境安装
- 运行第一个 Agent

## 核心概念

![OpenClaw 架构图](/images/openclaw-architecture.png)

> 架构图源文件：`/docs/openclaw-architecture.drawio`（可用 draw.io 编辑）

**核心概念说明：**

| 概念 | 说明 |
|--------|------|
| **Agent** | AI 代理实例，拥有独立的 workspace、memory、配置 |
| **Channel** | 接入渠道（飞书、Telegram、微信等） |
| **Plugin** | 渠道插件，实现 Channel 协议 |
| **Skill** | 可复用技能模块 |
| **MCP** | Model Context Protocol，扩展工具协议 |
| **Workspace** | Agent 的工作目录 |

---

## 动手实战

### 实战 1.1：安装 OpenClaw

```bash
# 检查环境
node --version  # 要求 v18+
npm --version

# 安装 OpenClaw CLI
npm install -g openclaw-cli

# 验证安装
openclaw --version

# 初始化配置目录
openclaw init
```

### 实战 1.2：查看配置结构

```bash
# 查看主配置文件
cat ~/.openclaw/openclaw.json

# 查看 Agent 目录
ls -la ~/.openclaw/agents/

# 查看插件目录
ls -la ~/.openclaw/extensions/
```

**配置文件结构解析：**

```json
{
  "meta": { "version": "2026.4.11" },
  "models": {
    "providers": { ... },      // 模型提供商
    "defaults": { ... }       // 默认模型配置
  },
  "agents": {
    "list": [ ... ],          // Agent 列表
    "defaults": { ... }       // 默认配置
  },
  "channels": { ... },        // 渠道配置
  "plugins": { ... },         // 插件配置
  "mcp": { servers: {} }     // MCP 服务器
}
```

### 实战 1.3：运行 Doctor 检查

```bash
# 运行健康检查
openclaw doctor

# 输出示例：
# ✓ Node.js v18.x.x
# ✓ CLI installed
# ✓ Config file exists
# ✓ 3 agents configured
# ✓ 2 channels enabled
```

### 实战 1.4：配置第一个模型（使用免费模型）

```bash
# 编辑配置文件
openclaw config edit

# 添加免费模型提供商
# 在 models.providers 中添加：
```

```json
"opencode-zen": {
  "baseUrl": "https://opencode.ai/zen/v1",
  "apiKey": "YOUR_API_KEY",
  "api": "openai-completions",
  "models": [{
    "id": "minimax-m2.5-free",
    "name": "MiniMax-2.5-Free",
    "input": ["text"],
    "contextWindow": 32000,
    "maxTokens": 4096
  }]
}
```

---

## 案例：运行你的第一个对话 Agent

```bash
# 启动交互式会话
openclaw chat

# 输入测试消息
> 你好，请介绍一下你自己
```

**预期输出：**
```
你好！我是 OpenClaw Agent，
我可以帮你完成代码开发、文件操作、
搜索研究等各种任务。有什么可以帮你的吗？
```

---

## 课后作业

1. - [ ] 完成 OpenClaw 安装
2. - [ ] 运行 `openclaw doctor` 通过所有检查
3. - [ ] 找到并阅读你的 `openclaw.json` 配置文件
4. - [ ] 配置一个免费模型提供商
5. - [ ] 成功运行 `openclaw chat` 并完成一次对话

---

## 知识卡片

```
┌─────────────────────────────────────────┐
│  OpenClaw 核心文件位置                  │
├─────────────────────────────────────────┤
│  主配置:  ~/.openclaw/openclaw.json      │
│  Agent配置: ~/.openclaw/agents/<name>/  │
│  插件:   ~/.openclaw/extensions/        │
│  日志:   ~/.openclaw/logs/             │
│  Memory: ~/.openclaw/memory/           │
│  Workspace: ~/.openclaw/workspace/     │
└─────────────────────────────────────────┘
```

---

## 下节预告

下一节我们将学习 **Agent 的创建与管理**，
包括多 Agent 架构设计和配置。
