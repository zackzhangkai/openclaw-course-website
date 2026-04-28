# 第四节：Skills 技能系统

## 学习目标
- 理解 Skills 架构
- 使用内置 Skills
- 创建自定义 Skill

---

## Skills 架构

```
┌─────────────────────────────────────────────────────┐
│               Skills 系统架构                    │
├─────────────────────────────────────────────────────┤
│                                               │
│   Skill Folder                                 │
│   ┌─────────────────────────────────────┐     │
│   │ SKILL.md        - 技能定义           │     │
│   │ scripts/       - 脚本目录           │     │
│   │ .env.example   - 配置示例           │     │
│   │ .gitignore    - Git忽略配置         │     │
│   └─────────────────────────────────────┘     │
│                                               │
│   技能加载路径                                 │
│   ~/.opencode/skills/<name>/                  │
│   ~/.claude/skills/<name>/                    │
│   <project>/.opencode/skills/<name>/         │
│                                               │
└─────────────────────────────────────────────────────┘
```

---

## 动手实战

### 实战 4.1：查看可用 Skills

```bash
# 列出所有可用 Skills
openclaw skill list

# 输出：
# ┌──────────────────┬─────────────────────────────────────┐
# │ Skill Name       │ Description                        │
# ├──────────────────┼─────────────────────────────────────┤
# │ workspace-guide │ 工作区引导                         │
# │ command-creator │ 创建自定义命令                      │
# │ agent-creator   │ 创建 OpenCode Agent                 │
# │ skill-creator   │ 创建新 Skill                        │
# │ git-master     │ Git 操作专家                        │
# │ playwright    │ 浏览器自动化                         │
# └──────────────────┴─────────────────────────────────────┘
```

### 实战 4.2：使用内置 Skill

```bash
# 使用 git-master skill
openclaw skill use git-master

# 示例：在对话中使用
# > 请帮我创建一个 git commit，message 是 "feat: 添加用户登录功能"
```

### 实战 4.3：创建自定义 Skill

#### Step 1：创建 Skill 目录结构

```bash
mkdir -p ~/.opencode/skills/my-skill/scripts
```

#### Step 2：编写 SKILL.md

```bash
cat > ~/.opencode/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: |
  我的自定义技能

  Triggers when user mentions:
  - "执行我的技能"
  - "使用自定义技能"
  - "运行 my-skill"
---

## Quick Usage

### 执行技能
```bash
./scripts/run.sh
```

## Common Gotchas

- 首次使用需要配置 .env

## First-Time Setup

1. 复制配置模板：`cp .env.example .env`
2. 编辑配置：`vim .env`
3. 执行验证：`./scripts/run.sh --test`
EOF
```

#### Step 3：创建配置文件

```bash
cat > ~/.opencode/skills/my-skill/.env.example << 'EOF'
# My Skill Configuration
API_KEY=your_api_key_here
API_ENDPOINT=https://api.example.com
EOF
```

#### Step 4：创建执行脚本

```bash
cat > ~/.opencode/skills/my-skill/scripts/run.sh << 'EOF'
#!/bin/bash
set -e

# 加载配置
source "$(dirname "$0")/../.env"

# 执行逻辑
echo "Running my-skill..."
echo "API Endpoint: $API_ENDPOINT"

# 你的技能逻辑
curl -s "$API_ENDPOINT/health" | jq .
EOF

chmod +x ~/.opencode/skills/my-skill/scripts/run.sh
```

#### Step 5：创建 .gitignore

```bash
cat > ~/.opencode/skills/my-skill/.gitignore << 'EOF'
.env
*.log
node_modules/
EOF
```

### 实战 4.4：加载自定义 Skill

```bash
# 在 openclaw.json 中配置技能加载路径
openclaw config edit
```

```json
"skills": {
  "load": {
    "extraDirs": [
      "/Users/zack/.opencode/skills",
      "/Users/zack/.claude/skills"
    ]
  }
}
```

### 实战 4.5：测试 Skill

```bash
# 测试脚本
./scripts/run.sh

# 验证 Skill 被加载
openclaw skill list | grep my-skill
```

---

## 案例：创建一个 API 文档生成 Skill

### 场景需求
帮助用户根据代码自动生成 API 文档

### 实现步骤

```bash
# 1. 创建 Skill 目录
mkdir -p ~/.opencode/skills/api-doc/scripts

# 2. 编写 SKILL.md
cat > ~/.opencode/skills/api-doc/SKILL.md << 'EOF'
---
name: api-doc
description: |
  自动生成 API 文档

  Triggers when user mentions:
  - "生成API文档"
  - "生成文档"
  - "create API docs"
---

## Quick Usage

### 生成 API 文档
```bash
./scripts/generate.sh <api-directory>
```

## Common Gotchas

- 需要先安装 api-doc-cli 工具
- API 目录需要有 package.json
EOF
```

### 3. 创建生成脚本

```bash
cat > ~/.opencode/skills/api-doc/scripts/generate.sh << 'EOF'
#!/bin/bash
API_DIR=${1:-"./src/api"}

echo "Generating API documentation..."
echo "Source: $API_DIR"

# 扫描 API 文件
find "$API_DIR" -name "*.ts" -o -name "*.js" | while read file; do
  echo "Processing: $file"
  # 生成文档逻辑
done

echo "✓ Documentation generated at ./docs/api.md"
EOF

chmod +x ~/.opencode/skills/api-doc/scripts/generate.sh
```

### 4. 测试 Skill

```bash
./scripts/generate.sh ./src/api
```

---

## 课后作业

1. [ ] 查看所有内置 Skills
2. [ ] 创建一个简单的自定义 Skill
3. [ ] 编写 SKILL.md 文档
4. [ ] 创建可执行脚本
5. [ ] 测试 Skill 加载和执行

---

## 知识卡片

```
┌─────────────────────────────────────────────────┐
│  Skill 触发词设置                              │
├─────────────────────────────────────────────────┤
│  在 description 中添加 "Triggers when":        │
│                                                 │
│  "Triggers when user mentions:                  │
│  - "执行技能"                                   │
│  - "运行 my-skill"                             │
│  - "使用自定义技能"                            │
└─────────────────────────────────────────────────┘
```

---

## 下节预告

下一节我们将学习 **记忆与上下文管理**，
如何让 Agent 记住对话历史和知识。
