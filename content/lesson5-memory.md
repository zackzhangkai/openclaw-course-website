# 第五节：记忆与上下文管理

## 学习目标
- 理解 OpenClaw 记忆系统
- 配置 Memory 存储
- 使用搜索功能

---

## 记忆系统架构

```
┌─────────────────────────────────────────────────────┐
│               Memory 系统架构                       │
├─────────────────────────────────────────────────────┤
│                                               │
│   用户对话                                     │
│       │                                        │
│       ▼                                        │
│   ┌─────────────────┐                         │
│   │  Memory Writer  │                         │
│   │  - 实体存储     │                         │
│   │  - 关系建立     │                         │
│   └────────┬────────┘                         │
│            │                                   │
│            ▼                                   │
│   ┌─────────────────┐                         │
│   │  Memory Store   │                         │
│   │  (SQLite)       │                         │
│   └────────┬────────┘                         │
│            │                                   │
│            ▼                                   │
│   ┌─────────────────┐                         │
│   │  Memory Search  │                         │
│   │  - 向量检索     │                         │
│   │  - 混合检索     │                         │
│   └─────────────────┘                         │
│                                               │
└─────────────────────────────────────────────────────┘
```

---

## 动手实战

### 实战 5.1：查看记忆存储

```bash
# 查看记忆数据库位置
ls -la ~/.openclaw/memory/

# 查看记忆数据
openclaw memory list --limit 10
```

### 实战 5.2：手动添加记忆

```bash
# 添加项目上下文
openclaw memory add --entity "project-x" --type "project" --observation "电商项目，采用微服务架构"

# 添加技术栈信息
openclaw memory add --entity "tech-stack" --type "technology" --observation "使用 Python/FastAPI + PostgreSQL"

# 添加团队信息
openclaw memory add --entity "team-alpha" --type "team" --observation "5人小组，采用Scrum开发"
```

### 实战 5.3：搜索记忆

```bash
# 搜索相关记忆
openclaw memory search "电商项目"

# 输出：
# ┌─────────────────────────────────────────────────────────┐
# │ Entity        │ Type        │ Score  │ Relevance        │
# ├──────────────┼────────────┼────────┼──────────────────┤
# │ project-x    │ project   │ 0.95   │ 电商项目...      │
# │ orders-api   │ api       │ 0.72   │ 订单API文档...   │
# └──────────────┴────────────┴────────┴──────────────────┘
```

### 实战 5.4：配置混合搜索

```bash
openclaw config edit
```

```json
"agents": {
  "defaults": {
    "memorySearch": {
      "enabled": true,
      "provider": "local",
      "query": {
        "hybrid": {
          "enabled": true,
          "vectorWeight": 0.7,
          "textWeight": 0.3
        },
        "maxResults": 30,
        "minScore": 0.15
      }
    }
  }
}
```

### 实战 5.5：创建实体关系

```bash
# 创建实体
openclaw memory entity create \
  --name "用户服务" \
  --type "microservice" \
  --observations "处理用户注册登录，认证授权"

# 创建关系
openclaw memory relation create \
  --from "用户服务" \
  --type "depends_on" \
  --to "Redis缓存"

# 查看关系图
openclaw memory graph
```

---

## 案例：配置项目专属记忆

### 场景：为一个新项目配置上下文

```bash
# 1. 创建项目专属 Agent
mkdir -p ~/.openclaw/agents/project-alpha/agent

# 2. 配置专属 Memory
cat > ~/.openclaw/agents/project-alpha/agent/agent.md << 'EOF'
---
name: project-alpha
description: Project Alpha 专用助手
memorySearch:
  enabled: true
  provider: local
  store:
    path: ~/.openclaw/agents/project-alpha/memory/{agentId}.sqlite
  query:
    maxResults: 50
    minScore: 0.2
---

你是一个专注于 Project Alpha 的助手。
你会记住项目的所有上下文。
EOF
```

### 场景：导入项目文档到记忆

```bash
# 1. 提取文档内容
openclaw memory import \
  --file ./docs/project-spec.md \
  --entity "项目规格" \
  --type "specification"

# 2. 提取架构图描述
openclaw memory import \
  --file ./docs/architecture.md \
  --entity "系统架构" \
  --type "architecture"

# 3. 导入 API 列表
openclaw memory import \
  --file ./docs/api-list.md \
  --entity "API列表" \
  --type "documentation"
```

---

## 上下文压缩与精简

### 实战 5.6：配置上下文管理

```bash
openclaw config edit
```

```json
"agents": {
  "defaults": {
    "compaction": {
      "mode": "safeguard",
      "reserveTokensFloor": 20000,
      "memoryFlush": {
        "enabled": true
      }
    },
    "contextPruning": {
      "mode": "cache-ttl",
      "ttl": "24h",
      "keepLastAssistants": 100
    }
  }
}
```

### 实战 5.7：手动触发记忆整理

```bash
# 整理当前会话记忆
openclaw memory compact

# 强制刷新到存储
openclaw memory flush

# 清理过期记忆
openclaw memory cleanup --older-than 7d
```

---

## 课后作业

1. [ ] 查看记忆数据库结构
2. [ ] 添加 3 个自定义实体
3. [ ] 创建实体间关系
4. [ ] 配置混合搜索参数
5. [ ] 为一个项目创建专属记忆
6. [ ] 导入文档到记忆系统

---

## 知识卡片

```
┌─────────────────────────────────────────────────────┐
│  Memory 命令速查                                  │
├─────────────────────────────────────────────────────┤
│  openclaw memory list        - 列出记忆            │
│  openclaw memory add        - 添加记忆            │
│  openclaw memory search     - 搜索记忆            │
│  openclaw memory entity     - 管理实体            │
│  openclaw memory relation - 管理关系              │
│  openclaw memory compact   - 整理记忆            │
│  openclaw memory flush     - 刷新存储            │
│  openclaw memory cleanup   - 清理过期            │
└─────────────────────────────────────────────────────┘
```

---

## 下节预告

下一节我们将学习 **MCP 工具集成**，
如何扩展 Agent 的工具能力。
