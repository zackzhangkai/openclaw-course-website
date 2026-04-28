# 第三节：渠道集成配置

## 学习目标
- 理解 OpenClaw 渠道机制
- 配置飞书渠道
- 配置 Telegram 渠道
- 配置微信渠道

---

## 渠道架构

```
┌────────────────────────────────────────────────────┐
│                   渠道层架构                      │
├────────────────────────────────────────────────────┤
│                                                    │
│   用户 ──► 渠道Server ──► OpenClaw ──► Agent      │
│           (飞书/Telegram/微信)                     │
│                                                    │
│   Plugin = 渠道协议实现                            │
│   @openclaw/feishu                                │
│   @openclaw/telegram                              │
│   @openclaw/weixin                                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 动手实战

### 实战 3.1：配置飞书渠道

#### Step 1：创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/app)
2. 创建企业自建应用
3. 获取 `App ID` 和 `App Secret`

#### Step 2：配置消息事件

在飞书应用后台，添加以下权限：
- `im:message:receive_v1` - 接收消息
- `im:message:send_as_bot` - 发送消息
- `im:chat.member:bot` - 机器人设置

#### Step 3：配置 Webhook

```
飞书应用 → 事件与回调 → 添加 Webhook 地址：
https://your-domain.com/feishu/webhook
```

#### Step 4：编辑 OpenClaw 配置

```bash
openclaw config edit
```

```json
"channels": {
  "feishu": {
    "enabled": true,
    "accounts": {
      "main": {
        "enabled": true,
        "appId": "cli_xxxxxxxx",
        "appSecret": "xxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### 实战 3.2：配置 Telegram 渠道

#### Step 1：创建 Telegram Bot

1. 在 Telegram 搜索 `@BotFather`
2. 发送 `/newbot`
3. 设置 Bot 名称和用户名
4. 获取 Bot Token：`123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`

#### Step 2：配置 OpenClaw

```bash
openclaw config edit
```

```json
"channels": {
  "telegram": {
    "enabled": true,
    "dmPolicy": "pairing",
    "accounts": {
      "my-bot": {
        "enabled": true,
        "botToken": "123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
      }
    }
  }
}
```

#### Step 3：测试 Telegram Bot

```bash
# 发送测试消息
openclaw channel test telegram --account my-bot

# 在 Telegram 向 Bot 发送消息
/start
```

### 实战 3.3：配置微信渠道

```bash
# 安装微信插件
openclaw plugin install @tencent-weixin/openclaw-weixin

# 配置微信渠道
openclaw config edit
```

```json
"plugins": {
  "entries": {
    "openclaw-weixin": {
      "enabled": true
    }
  }
},
"channels": {
  "openclaw-weixin": {
    "enabled": true,
    "accounts": {
      "my-weixin": {
        "enabled": true,
        "appId": "wx1234567890",
        "appSecret": "xxxxxxxx"
      }
    }
  }
}
```

---

## 案例：配置多渠道路由

### 场景：不同渠道绑定不同 Agent

```bash
cat > ~/.openclaw/openclaw.json << 'EOF'
{
  "bindings": [
    {
      "agentId": "main",
      "match": {
        "channel": "feishu",
        "accountId": "main"
      }
    },
    {
      "agentId": "agent-telegram",
      "match": {
        "channel": "telegram",
        "accountId": "my-bot"
      }
    },
    {
      "agentId": "agent-weixin",
      "match": {
        "channel": "openclaw-weixin",
        "accountId": "my-weixin"
      }
    }
  ]
}
EOF
```

### 验证配置

```bash
# 查看渠道状态
openclaw channel list

# 输出：
# ┌─────────────┬──────────┬──────────┐
# │ Channel    │ Account  │ Status  │
# ├─────────────┼──────────┼──────────┤
# │ feishu     │ main     │ ✓       │
# │ telegram  │ my-bot   │ ✓       │
# │ weixin    │ my-weixin│ ✓       │
# └─────────────┴──────────┴──────────┘
```

---

## 课后作业

1. [ ] 创建并配置飞书自建应用
2. [ ] 配置飞书渠道到 OpenClaw
3. [ ] 创建 Telegram Bot
4. [ ] 配置 Telegram 渠道
5. [ ] 配置多渠道路由（飞书 + Telegram）
6. [ ] 测试跨渠道消息接收

---

## 知识卡片

```
┌───────────────────────────────────────────────────┐
│  渠道配置参数说明                              │
├───────────────────────────────────────────────────┤
│  enabled       - 是否启用                     │
│  dmPolicy      - 私信策略 (pairing/accept_all) │
│  accounts      - 账号列表                      │
│  appId         - 应用ID（飞书/微信）           │
│  appSecret     - 应用密钥                      │
│  botToken      - Bot Token（Telegram）        │
└───────────────────────────────────────────────────┘
```

---

## 下节预告

下一节我们将学习 **Skills 技能系统**，
如何创建和使用可复用技能。