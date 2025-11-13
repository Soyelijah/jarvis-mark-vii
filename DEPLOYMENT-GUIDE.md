# 🚀 JARVIS Enterprise - Complete Deployment Guide

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring & Observability](#monitoring--observability)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

### **System Components**
```
┌─────────────────────────────────────────────────────────┐
│                    JARVIS Architecture                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐       │
│  │  Ingress │────►│   Nginx  │────►│   Load   │       │
│  │          │     │  Proxy   │     │ Balancer │       │
│  └──────────┘     └──────────┘     └─────┬────┘       │
│                                           │             │
│        ┌──────────────────────────────────┴────┐       │
│        │                                        │       │
│   ┌────▼────┐                            ┌────▼────┐  │
│   │Frontend │                            │ Backend │  │
│   │  React  │◄──────WebSocket───────────│ Node.js │  │
│   │(3 pods) │                            │(3 pods) │  │
│   └─────────┘                            └────┬────┘  │
│                                                │        │
│        ┌───────────────────────────────────────┤       │
│        │              │              │         │       │
│   ┌────▼──┐    ┌────▼───┐    ┌────▼──┐  ┌───▼───┐  │
│   │Postgre│    │ Redis  │    │Elastic│  │Jaeger │  │
│   │  SQL  │    │ Cache  │    │Search │  │Tracing│  │
│   └───────┘    └────────┘    └───────┘  └───────┘  │
│                                                        │
│        ┌───────────────────────────────────┐         │
│        │      Monitoring Stack             │         │
│        │  Prometheus + Grafana + Kibana   │         │
│        └───────────────────────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 Local Development

### **Quick Start**
```bash
# 1. Install dependencies
npm install

# 2. Start development servers
npm run panel

# Access:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:7777
# - API: http://localhost:7777/api
```

### **Development with Hot Reload**
```bash
# Terminal 1: Backend
npm run protected

# Terminal 2: Frontend
cd web-interface/frontend
npm run dev
```

### **Run Advanced Tools**
```bash
# ML Code Analysis
node ml-code-analyzer.js

# Multi-Agent Orchestration
node advanced-orchestrator.js

# Quick API Test
node quick-test.js
```

---

## 🐳 Docker Deployment

### **Prerequisites**
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 20GB disk space

### **Single Command Deployment**
```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### **Services Deployed**
| Service | Port | Description |
|---------|------|-------------|
| Frontend | 5173 | React UI |
| Backend | 7777 | Node.js API |
| PostgreSQL | 5432 | Primary Database |
| Redis | 6379 | Cache & Sessions |
| Prometheus | 9090 | Metrics Collection |
| Grafana | 3000 | Metrics Visualization |
| Jaeger | 16686 | Distributed Tracing |
| Elasticsearch | 9200 | Log Aggregation |
| Kibana | 5601 | Log Visualization |

### **Production Build**
```bash
# Build optimized images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### **Health Checks**
```bash
# Backend health
curl http://localhost:7777/health

# Frontend health
curl http://localhost:5173/health

# All services
docker-compose ps
```

---

## ☸️ Kubernetes Deployment

### **Prerequisites**
- Kubernetes 1.24+
- kubectl configured
- Helm 3+ (optional)
- 8GB RAM cluster minimum
- Ingress controller installed

### **Deploy to K8s**
```bash
# 1. Create namespace
kubectl create namespace jarvis-production

# 2. Apply manifests
kubectl apply -f k8s/deployment.yml

# 3. Verify deployment
kubectl get pods -n jarvis-production
kubectl get services -n jarvis-production

# 4. Check rollout status
kubectl rollout status deployment/jarvis-backend -n jarvis-production
```

### **Using Deployment Script**
```bash
# Make script executable
chmod +x deploy.sh

# Deploy to staging
./deploy.sh staging v1.0.0

# Deploy to production
./deploy.sh production v1.0.0
```

### **Scaling**
```bash
# Manual scaling
kubectl scale deployment jarvis-backend --replicas=5 -n jarvis-production

# Auto-scaling (HPA already configured)
kubectl get hpa -n jarvis-production

# Scale based on custom metrics
kubectl autoscale deployment jarvis-backend \
  --cpu-percent=70 \
  --min=3 \
  --max=10 \
  -n jarvis-production
```

### **Zero-Downtime Updates**
```bash
# Update image
kubectl set image deployment/jarvis-backend \
  backend=ghcr.io/yourorg/jarvis-backend:v2.0.0 \
  -n jarvis-production

# Monitor rollout
kubectl rollout status deployment/jarvis-backend -n jarvis-production

# Rollback if needed
kubectl rollout undo deployment/jarvis-backend -n jarvis-production
```

---

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**

**Archivo:** `.github/workflows/jarvis-ci-cd.yml`

**Pipeline Stages:**
1. ✅ **Code Analysis** - ML analyzer + Orchestrator
2. 🔒 **Security Scan** - npm audit + Semgrep + SAST
3. 🧪 **Testing** - Unit + Integration + E2E
4. 🏗️ **Build** - Docker images + Artifacts
5. 📦 **Package** - Container registry push
6. 🚀 **Deploy** - Staging → Production
7. 📊 **Monitor** - Health checks + Metrics
8. 🔙 **Rollback** - Automatic on failure

**Trigger Events:**
- Push to main/master/develop
- Pull requests
- Daily schedule (2 AM)
- Manual trigger

### **Local CI Simulation**
```bash
# Run full CI pipeline locally
npm run ci

# Or step by step:
npm run lint
npm test
node ml-code-analyzer.js
node advanced-orchestrator.js
npm run build
```

### **Quality Gates**
```yaml
ML Analysis Score: > 70/100
Test Coverage: > 80%
Security Issues: 0 high/critical
Build: Success
Health Checks: All passing
```

---

## 📊 Monitoring & Observability

### **Metrics Dashboard (Grafana)**
```
URL: http://localhost:3000
Default credentials: admin / jarvis-grafana
```

**Dashboards Available:**
- System Overview
- Application Metrics
- Request Rate & Latency
- Error Rates
- Resource Usage
- Custom Business Metrics

### **Distributed Tracing (Jaeger)**
```
URL: http://localhost:16686
```

**Features:**
- Request flow visualization
- Service dependencies
- Performance bottlenecks
- Error tracking

### **Logs (Kibana)**
```
URL: http://localhost:5601
```

**Log Aggregation:**
- Structured JSON logs
- Full-text search
- Log filtering
- Alert creation

### **Application Metrics**
```bash
# Prometheus metrics endpoint
curl http://localhost:7777/metrics

# Custom metrics
curl http://localhost:7777/api/performance/metrics
```

### **Alerts Configuration**
```yaml
# prometheus-alerts.yml
groups:
  - name: jarvis-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status="500"}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"

      - alert: HighMemoryUsage
        expr: node_memory_Active_bytes / node_memory_MemTotal_bytes > 0.9
        for: 5m
        annotations:
          summary: "Memory usage above 90%"
```

---

## 🔧 Troubleshooting

### **Common Issues**

#### **Port Already in Use**
```bash
# Find process using port
netstat -ano | findstr :7777
netstat -ano | findstr :5173

# Kill process (Windows)
taskkill /PID <pid> /F

# Kill process (Linux/Mac)
kill -9 <pid>
```

#### **Docker Build Fails**
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### **Pod CrashLoopBackOff**
```bash
# Check logs
kubectl logs <pod-name> -n jarvis-production

# Describe pod
kubectl describe pod <pod-name> -n jarvis-production

# Check events
kubectl get events -n jarvis-production --sort-by='.lastTimestamp'
```

#### **Health Check Failures**
```bash
# Check backend health
curl -v http://localhost:7777/health

# Check service status
kubectl get svc -n jarvis-production

# Port forward for debugging
kubectl port-forward svc/jarvis-backend-service 7777:7777 -n jarvis-production
```

### **Debugging Tools**

#### **K8s Debug Pod**
```bash
# Launch debug pod
kubectl run debug --image=busybox -it --rm -n jarvis-production -- sh

# Test connectivity
wget -O- http://jarvis-backend-service:7777/health
```

#### **Database Connection**
```bash
# Connect to PostgreSQL
kubectl exec -it <postgres-pod> -n jarvis-production -- psql -U jarvis

# Connect to Redis
kubectl exec -it <redis-pod> -n jarvis-production -- redis-cli
```

### **Performance Issues**

#### **High CPU Usage**
```bash
# Check pod resources
kubectl top pods -n jarvis-production

# Increase resources
kubectl set resources deployment jarvis-backend \
  --limits=cpu=2000m,memory=2Gi \
  -n jarvis-production
```

#### **Memory Leaks**
```bash
# Take heap snapshot
node --expose-gc --inspect advanced-orchestrator.js

# Analyze with Chrome DevTools
# chrome://inspect
```

---

## 📚 Additional Resources

### **Documentation**
- [ENTERPRISE-CAPABILITIES.md](./ENTERPRISE-CAPABILITIES.md) - Full capabilities guide
- [QUICK-START-GUIDE.md](./QUICK-START-GUIDE.md) - Getting started
- [API Documentation](./docs/api.md) - API reference

### **Scripts**
- `deploy.sh` - Automated deployment
- `ml-code-analyzer.js` - Code analysis
- `advanced-orchestrator.js` - Multi-agent orchestration
- `quick-test.js` - Quick system test

### **Monitoring URLs**
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090
- Jaeger: http://localhost:16686
- Kibana: http://localhost:5601

---

## 🎯 Best Practices

### **Development**
- ✅ Always run tests before commit
- ✅ Use feature branches
- ✅ Keep commits atomic
- ✅ Write meaningful commit messages
- ✅ Run ML analyzer regularly

### **Deployment**
- ✅ Always deploy to staging first
- ✅ Run smoke tests after deployment
- ✅ Monitor metrics for 30 minutes
- ✅ Have rollback plan ready
- ✅ Document all changes

### **Monitoring**
- ✅ Set up alerts for critical metrics
- ✅ Review dashboards daily
- ✅ Investigate anomalies immediately
- ✅ Keep metrics retention for 30+ days
- ✅ Regular log analysis

---

## 🆘 Support

**Issues:** https://github.com/yourorg/jarvis/issues
**Docs:** https://docs.jarvis.example.com
**Status:** https://status.jarvis.example.com

---

**Version:** 1.0.0
**Last Updated:** 2025-11-12
**Maintained by:** JARVIS Enterprise Team
