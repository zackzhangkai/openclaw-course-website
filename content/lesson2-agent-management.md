# 第二节：Agent 创建与管理

## 学习目标
- 理解 Agent 的配置结构
- 创建新的 Agent
- 配置多 Agent 路由

---

## Agent 配置结构

```yaml
# Agent 配置文件
id: agent-xxx
name: Agent显示名称
workspace: ~/.openclaw/workspace-xxx    # 工作目录
agentDir: ~/.openclaw/agents/xxx/agent  # Agent目录

# 可选配置
memorySearch:
  enabled: true
  provider: local
  store:
    path: ~/.openclaw/agents/xxx/memory/{agentId}.sqlite
  query:
    maxResults: 50
    minScore: 0.15
```

---

## 动手实战

### 实战 2.1：创建新 Agent（CLI 方式）

```bash
# 方式1：使用 CLI 创建
openclaw agent create my-agent
# ? 选择范围: project / global
# ? 输入描述: 我的第一个自定义Agent
# ✓ Agent 创建成功

# 方式2：手动创建
mkdir -p ~/.openclaw/agents/my-agent/agent
```

### 实战 2.2：编写 Agent 配置文件

```bash
cat > ~/.openclaw/agents/my-agent/agent/agent.md << 'EOF'
---
name: my-agent
description: 我的自定义AI助手
mode: primary
model: opencode-zen/minimax-m2.5-free
tools:
  read: true
  write: true
  bash: true
---

你是一个专业的技术助手。
专注于帮助用户完成代码开发任务。
```

### 实战 2.3：注册 Agent 到主配置

```bash
# 编辑 openclaw.json，在 agents.list 中添加：
```

```json
{
  "id": "my-agent",
  "name": "我的助手",
  "workspace": "~/.openclaw/workspace-my-agent"
}
```

### 实战 2.4：查看所有 Agent

```bash
# 列出所有配置的 Agent
openclaw agent list

# 输出：
# ┌──────────┬──────────┬────────────────┐
# │ ID       │ Name    │ Status         │
# ├──────────┼──────────┼────────────────┤
# │ main     │ main    │ ✓ Running      │
# │ agent-2  │ agent-2 │ ✓ Running      │
# │ my-agent │ 我的助手 │ ✓ Running      │
# └──────────┴──────────┴────────────────┘
```

---

## 多 Agent 路由配置

### 实战 2.5：配置渠道绑定

在 `openclaw.json` 中配置不同渠道使用不同 Agent：

```json
"bindings": [
  {
    "agentId": "main",
    "match": {
      "channel": "feishu",
      "accountId": "main"
    }
  },
  {
    "agentId": "agent-2",
    "match": {
      "channel": "feishu",
      "accountId": "agent-2"
    }
  }
]
```

### 实战 2.6：Agent 专用 Workspace

```bash
# 为不同 Agent 配置不同工作目录
mkdir -p ~/.openclaw/workspace-project-a
mkdir -p ~/.openclaw/workspace-project-b

# 在 agent 配置中指定
openclaw config set agents.list[0].workspace "~/project-a"
```

---

## 案例：为不同场景创建专用 Agent

### 场景：创建一个代码审查 Agent

```bash
# 1. 创建目录
mkdir -p ~/.openclaw/agents/code-reviewer/agent

# 2. 编写 Agent 配置
cat > ~/.openclaw/agents/code-reviewer/agent/agent.md << 'EOF'
---
name: code-reviewer
description: 专业代码审查助手
mode: subagent
model: opencode-zen/minimax-m2.5-free
tools:
  read: true
  write: false
  bash: true
---

你是一个专业的代码审查员。
请从以下角度审查代码：
1. 代码质量与风格
2. 潜在Bug与安全问题
3. 性能优化建议
4. 可读性与维护性
```

### 场景：创建一个文档助手 Agent

```bash
cat > ~/.openclaw/agents/docs-writer/agent/agent.md << 'EOF'
---
name: docs-writer
description: 技术文档写作助手
mode: subagent
model: opencode-zen/minimax-m2.5-free
tools:
  read: true
  write: true
  bash: false
---

你是一个专业的技术文档撰写助手。
擅长：
- API 文档编写
- README 文档
- 开发指南
- 使用教程
```

---

## 课后作业

1. [ ] 使用 `openclaw agent create` 创建一个新 Agent
2. [ ] 为 Agent 配置独立的工作目录
3. [ ] 配置一个渠道绑定
4. [ ] 创建两个专用场景 Agent（代码审查 + 文档助手）
5. [ ] 测试切换不同 Agent

---

## 知识卡片

```
┌─────────────────────────────────────────┐
│  Agent 工具权限矩阵                    │
├─────────────────────────────────────────┤
│  read       - 读取文件                  │
│  write      - 写入文件                 │
│  bash       - 执行命令                 │
│  edit       - 编辑文件（read+write）   │
│  task       - 启动子任务               │
│  web        - 网页搜索/获取            │
│  memory     - 记忆读写                │
└─────────────────────────────────────────┘
```

---

## 下节预告

下一节我们将学习 **渠道集成配置**，
包括飞书、Telegram、微信等渠道的接入。
