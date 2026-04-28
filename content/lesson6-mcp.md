# 第六节：MCP 工具集成

## 学习目标
- 理解 MCP (Model Context Protocol) 架构
- 安装和配置 MCP 服务器
- 创建自定义 MCP 工具

---

## MCP 架构

```
┌─────────────────────────────────────────────────────┐
│               MCP 架构图                           │
├─────────────────────────────────────────────────────┤
│                                               │
│   OpenClaw                                     │
│   ┌─────────────────────────────────────────┐   │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  │   │
│   │  │ Tools   │  │Memory   │  │ Search  │  │   │
│   │  └────┬────┘  └────┬────┘  └────┬────┘  │   │
│   │       │           │           │          │   │
│   │       └───────────┴───────────┘          │   │
│   │                   │                      │   │
│   │                   ▼                      │   │
│   │          ┌─────────────┐                  │   │
│   │          │  MCP Client │                  │   │
│   │          └──────┬──────┘                  │   │
│   └─────────────────┼─────────────────────────┘   │
│                     │                            │
│                     ▼                            │
│            ┌─────────────┐                     │
│            │ MCP Server  │ (本地/远程)          │
│            │ - 文件系统  │                     │
│            │ - 数据库    │                     │
│            │ - API 调用 │                     │
│            └─────────────┘                     │
│                                               │
└─────────────────────────────────────────────────────┘
```

---

## 动手实战

### 实战 6.1：查看内置 MCP

```bash
# 列出可用 MCP 服务器
openclaw mcp list

# 输出：
# ┌───────────────┬────────────┬─────────────────┐
# │ Server Name  │ Status     │ Tools           │
# ├───────────────┼────────────┼─────────────────┤
# │ filesystem   │ ✓ 内置     │ read, write...  │
# │ web-search   │ ✓ 内置     │ search, fetch  │
# │ tavily      │ ✓ 已配置    │ search, extract │
# └───────────────┴────────────┴─────────────────┘
```

### 实战 6.2：安装 MCP 服务器

#### 安装 Tavily (搜索)

```bash
# 方式1：使用 npm 安装
npx -y tavily-mcp@latest

# 方式2：添加到配置
openclaw config edit
```

```json
"mcp": {
  "servers": {
    "tavily": {
      "command": "npx",
      "args": ["-y", "tavily-mcp@latest"],
      "env": {
        "TAVILY_API_KEY": "tvly-your-api-key"
      }
    }
  }
}
```

#### 安装文件系统 MCP

```bash
openclaw mcp install filesystem --type local
```

### 实战 6.3：创建自定义 MCP 服务器

#### Step 1：初始化 MCP 项目

```bash
mkdir -p ~/mcp-servers/my-server
cd ~/mcp-servers/my-server
npm init -y
npm install @modelcontextprotocol/sdk
```

#### Step 2：编写 MCP 服务器

```bash
cat > ~/mcp-servers/my-server/index.ts << 'EOF'
import { McpServer } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";

const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
});

// 添加工具：获取当前时间
server.tool(
  "get_time",
  "获取当前时间",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: new Date().toISOString(),
        },
      ],
    };
  }
);

// 添加工具：格式化日期
server.tool(
  "format_date",
  "格式化日期",
  {
    timestamp: { type: "number", description: "Unix 时间戳" },
    format: { type: "string", description: "格式模式" },
  },
  async ({ timestamp, format }) => {
    const date = new Date(timestamp);
    return {
      content: [
        {
          type: "text",
          text: date.toLocaleDateString("zh-CN", { format }),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
server.run(transport);
EOF
```

#### Step 3：配置 MCP 服务器

```bash
openclaw config edit
```

```json
"mcp": {
  "servers": {
    "my-server": {
      "command": "npx",
      "args": ["tsx", "~/mcp-servers/my-server/index.ts"]
    }
  }
}
```

#### Step 4：测试 MCP 服务器

```bash
# 验证 MCP 服务器
openclaw mcp test my-server

# 输出：
# ✓ my-server connected
# ✓ get_time available
# ✓ format_date available
```

---

## 案例：集成 Notion MCP

### 需求
在 OpenClaw 中访问 Notion 数据库

### 实现步骤

```bash
# 1. 安装 Notion MCP
npm install -g @notionhq/notion-mcp

# 2. 获取 Notion API Key
# 访问 https://www.notion.so/my-integrations
# 创建集成，获取 Internal Integration Token

# 3. 配置 MCP
openclaw config edit
```

```json
"mcp": {
  "servers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp"],
      "env": {
        "NOTION_API_KEY": "secret_xxxxxxxxxxxx"
      }
    }
  }
}
```

### 4. 测试 Notion 集成

```bash
# 测试连接
openclaw mcp test notion

# 在对话中使用
# > 帮我查询 Notion 中 "项目任务" 数据库的内容
```

---

## 课后作业

1. [ ] 查看所有内置 MCP 服务器
2. [ ] 安装并配置 Tavily MCP
3. [ ] 创建自定义 MCP 服务器
4. [ ] 实现 2 个工具函数
5. [ ] 测试 MCP 服务器连接
6. [ ] 集成一个外部服务 MCP

---

## 知识卡片

```
┌─────────────────────────────────────────────────────┐
│  MCP 工具类型                                     │
├─────────────────────────────────────────────────────┤
│  tool      - 执行操作并返回结果                   │
│  resource  - 读取数据资源                        │
│  prompt    - 预定义提示模板                      │
└─────────────────────────────────────────────────────┘
```

---

## 下节预告

下一节我们将学习 **自定义工作流**，
如何编排 Agent 的行为和任务。
