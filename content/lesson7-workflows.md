# 第七节：自定义工作流

## 学习目标
- 理解工作流编排概念
- 配置 Skill 工作流
- 使用子 Agent 任务

---

## 工作流编排架构

```
┌─────────────────────────────────────────────────────┐
│               工作流编排架构                       │
├─────────────────────────────────────────────────────┤
│                                               │
│   工作流定义 (YAML/JSON)                        │
│   ┌─────────────────────────────────────────┐   │
│   │ steps:                                 │   │
│   │   - name: research                    │   │
│   │     agent: researcher                  │   │
│   │   - name: implement                   │   │
│   │     agent: developer                   │   │
│   │   - name: review                      │   │
│   │     agent: reviewer                    │   │
│   └─────────────────────────────────────────┘   │
│                   │                            │
│                   ▼                            │
│            ┌─────────────┐                    │
│            │ Orchestrator│ (编排器)            │
│            └──────┬──────┘                    │
│                   │                            │
│         ┌─────────┼─────────┐                 │
│         ▼         ▼         ▼                │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│   │Research │ │Develop  │ │ Review  │       │
│   │ Subagent│ │ Subagent│ │ Subagent│       │
│   └─────────┘ └─────────┘ └─────────┘       │
│                                               │
└─────────────────────────────────────────────────────┘
```

---

## 动手实战

### 实战 7.1：创建简单工作流

#### Step 1：创建工作流目录

```bash
mkdir -p ~/.openclaw/flows/my-flow
```

#### Step 2：编写工作流定义

```bash
cat > ~/.openclaw/flows/my-flow/flow.yaml << 'EOF'
name: 代码开发工作流
description: 自动化代码开发流程

steps:
  - name: 需求分析
    agent: researcher
    prompt: "分析用户需求，提取关键信息"
    output: requirements.md

  - name: 代码实现
    agent: developer
    prompt: "根据需求实现代码"
    input: requirements.md
    output: src/

  - name: 代码审查
    agent: reviewer
    prompt: "审查代码质量和安全性"
    input: src/
    output: review-report.md
EOF
```

#### Step 3：执行工作流

```bash
openclaw flow run my-flow --input "实现一个用户登录API"
```

### 实战 7.2：配置并行任务

```bash
cat > ~/.openclaw/flows/parallel-flow/flow.yaml << 'EOF'
name: 并行开发工作流

steps:
  - name: 需求分析
    agent: researcher
    prompt: "分析需求"
    output: requirements.md

  - name: 并行开发  # 多个任务并行执行
    parallel: true
    tasks:
      - agent: frontend-dev
        prompt: "实现前端界面"
        output: src/frontend/

      - agent: backend-dev
        prompt: "实现后端API"
        output: src/backend/

      - agent: test-dev
        prompt: "编写测试用例"
        output: tests/

  - name: 集成测试
    agent: test-lead
    prompt: "集成测试和验收"
    input:
      - src/frontend/
      - src/backend/
      - tests/
EOF
```

### 实战 7.3：使用条件分支

```bash
cat > ~/.openclaw/flows/conditional-flow/flow.yaml << 'EOF'
name: 条件分支工作流

steps:
  - name: 初步分析
    agent: analyzer
    prompt: "分析问题类型"
    output: analysis.json

  - name: 条件判断
    type: condition
    conditions:
      - if: "analysis.type == 'bug'"
        then:
          - name: Bug修复
            agent: bug-fixer

      - if: "analysis.type == 'feature'"
        then:
          - name: 功能开发
            agent: feature-dev

          - name: 功能测试
            agent: test-dev

  - name: 最终审查
    agent: reviewer
    prompt: "最终审查"
EOF
```

### 实战 7.4：配置循环任务

```bash
cat > ~/.openclaw/flows/loop-flow/flow.yaml << 'EOF'
name: 迭代优化工作流

steps:
  - name: 初始实现
    agent: developer
    output: v1.0/

  - name: 测试迭代
    type: loop
    maxIterations: 3
    until: "testCoverage > 80%"
    tasks:
      - name: 运行测试
        agent: test-runner

      - name: 分析覆盖率
        agent: analyzer

      - name: 改进代码
        agent: improver
        condition: "testCoverage < 80%"
EOF
```

---

## 案例：构建自动化代码审查流程

### 场景需求
创建一个自动化流程：PR → 分析 → 审查 → 报告

### 实现步骤

```bash
mkdir -p ~/.openclaw/flows/pr-review
```

```bash
cat > ~/.openclaw/flows/pr-review/flow.yaml << 'EOF'
name: PR 自动化审查流程
description: 自动审查 Pull Request

steps:
  - name: 获取PR信息
    type: action
    command: "gh pr view {pr_number} --json title,body,files"

  - name: 代码分析
    agent: code-analyzer
    prompt: |
      分析以下代码变更：
      {pr_files}

      关注：
      1. 代码质量
      2. 安全漏洞
      3. 性能问题
      4. 测试覆盖

  - name: 生成审查报告
    type: action
    template: |
      ## PR 审查报告

      ### 代码质量: {quality_score}/10
      ### 安全性: {security_score}/10

      ### 发现的问题
      {issues}

      ### 建议
      {suggestions}
EOF
```

### 运行流程

```bash
openclaw flow run pr-review \
  --pr-number 123 \
  --output ./reviews/pr-123.md
```

---

## 课后作业

1. [ ] 创建第一个简单工作流
2. [ ] 配置并行任务流
3. [ ] 实现条件分支工作流
4. [ ] 创建自动化代码审查流程
5. [ ] 测试工作流执行和调试

---

## 知识卡片

```
┌─────────────────────────────────────────────────────┐
│  工作流步骤类型                                   │
├─────────────────────────────────────────────────────┤
│  agent    - 调用子 Agent                    │
│  action  - 执行命令/脚本                  │
│  condition- 条件判断                      │
│  loop     - 循环迭代                     │
│  parallel- 并行执行                     │
│  template- 模板渲染                      │
└─────────────────────────────────────────────────────┘
```

---

## 下节预告

下一节我们将学习 **生产部署与运维**，
包括监控、日志、高可用等。
