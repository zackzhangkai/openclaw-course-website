# 第八节：生产部署与运维

## 学习目标
- 配置生产环境
- 设置监控和日志
- 实现高可用部署
- 故障排查

---

## 生产部署架构

```
┌─────────────────────────────────────────────────────┐
│               生产部署架构                        │
├─────────────────────────────────────────────────────┤
│                                               │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐   │
│   │ Load    │───▶│ OpenClaw│───▶│ Agent   │   │
│   │Balancer │    │ Node 1  │    │ Pool    │   │
│   └─────────┘    └─────────┘    └─────────┘   │
│                       │                        │
│        ┌──────────────┴──────────────┐        │
│        ▼                            ▼        │
│   ┌─────────┐                  ┌─────────┐   │
│   │ Redis   │                  │  MongoDB│   │
│   │ Cluster │                  │ Cluster │   │
│   └─────────┘                  └─────────┘   │
│                                               │
└─────────────────────────────────────────────────────┘
```

---

## 动手实战

### 实战 8.1：生产配置

```bash
# 创建生产配置文件
cat > ~/.openclaw/openclaw.prod.json << 'EOF'
{
  "meta": {
    "version": "2026.4.11",
    "mode": "production"
  },
  "models": {
    "defaults": {
      "model": "production-model",
      "fallbacks": ["backup-model-1", "backup-model-2"]
    }
  },
  "agents": {
    "defaults": {
      "maxConcurrent": 8,
      "compaction": {
        "mode": "aggressive",
        "reserveTokensFloor": 30000
      }
    }
  },
  "logging": {
    "level": "info",
    "output": "/var/log/openclaw/app.log",
    "rotation": {
      "maxSize": "100M",
      "maxFiles": 10
    }
  }
}
EOF
```

### 实战 8.2：配置日志

```bash
openclaw config edit
```

```json
{
  "logging": {
    "level": "info",
    "output": {
      "file": "~/.openclaw/logs/app.log",
      "console": false
    },
    "rotation": {
      "enabled": true,
      "maxSize": "100MB",
      "maxFiles": 10,
      "compress": true
    },
    "accessLog": "~/.openclaw/logs/access.log",
    "errorLog": "~/.openclaw/logs/error.log"
  }
}
```

### 实战 8.3：设置监控

```bash
# 安装监控插件
npm install -g @openclaw/monitor

# 查看监控指标
curl http://localhost:9090/health
curl http://localhost:9090/metrics
```

### 实战 8.4：配置告警

```bash
cat > ~/.openclaw/alerts.yaml << 'EOF'
alerts:
  - name: high_error_rate
    condition: "error_rate > 0.05"
    duration: "5m"
    action:
      type: webhook
      url: "https://your-webhook.com/alert"

  - name: agent_down
    condition: "agent_active == 0"
    duration: "1m"
    action:
      type: email
      to: "ops@example.com"
EOF
```

### 实战 8.5：高可用配置

```bash
# 启动多个 OpenClaw 实例
openclaw start --port 3001 --name instance-1
openclaw start --port 3002 --name instance-2
openclaw start --port 3003 --name instance-3
```

---

## 故障排查

```bash
# 1. 查看日志
openclaw logs --tail 100

# 2. 查看错误日志
openclaw logs --level error --tail 50

# 3. 查看 Agent 状态
openclaw agent status

# 4. 检查配置
openclaw doctor

# 5. 测试连接
openclaw channel test feishu

# 6. 重启服务
openclaw restart
```

---

## 课程总结

恭喜！你已经完成了 OpenClaw 实战课程的全部 8 节内容。

### 下一步建议

1. **实践项目**：为一个真实项目配置 OpenClaw
2. **深入研究**：阅读 OpenClaw 官方文档
3. **社区交流**：加入 OpenClaw 用户群
4. **贡献代码**：参与 OpenClaw 开源项目
