# Hetzner Cloud Terraform Infrastructure

Bu klasör, Hetzner Cloud üzerinde production-ready Kubernetes altyapısı kurmak için Terraform modüllerini içerir.

## 🏗️ Mimari

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HETZNER CLOUD                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Load Balancer                            │    │
│  │                 (HTTP/HTTPS/K8s API)                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     Private Network                           │  │
│  │                      10.0.0.0/8                               │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │              Control Plane Nodes (3x)                │    │  │
│  │  │  • k3s Server                                        │    │  │
│  │  │  • etcd (embedded)                                   │    │  │
│  │  │  • API Server                                        │    │  │
│  │  │  • Scheduler, Controller Manager                     │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │              Worker Nodes (3-5x)                     │    │  │
│  │  │  • k3s Agent                                         │    │  │
│  │  │  • Application Pods                                  │    │  │
│  │  │  • Database Pods                                     │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │              Persistent Volumes                      │    │  │
│  │  │  • PostgreSQL Auth DB                                │    │  │
│  │  │  • PostgreSQL Product DB                             │    │  │
│  │  │  • Prometheus Data                                   │    │  │
│  │  │  • Grafana Data                                      │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      Firewalls                                │  │
│  │  • Control Plane: SSH, 6443, 2379-2380, 10250                │  │
│  │  • Workers: SSH, 80, 443, 30000-32767                        │  │
│  │  • Load Balancer: 80, 443                                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## 📁 Dosya Yapısı

```
terraform/
├── main.tf                      # Ana Terraform configuration
├── variables.tf                 # Değişken tanımlamaları
├── outputs.tf                   # Output değerleri
├── versions.tf                  # Provider versiyonları
├── .gitignore                   # Git ignore
├── environments/
│   ├── dev.tfvars              # Development ortamı
│   ├── staging.tfvars          # Staging ortamı
│   └── production.tfvars       # Production ortamı
└── modules/
    ├── network/                 # VPC, Subnet yapılandırması
    ├── kubernetes/              # k3s Cluster kurulumu
    ├── firewall/                # Güvenlik duvarı kuralları
    ├── load-balancer/           # Hetzner Load Balancer
    ├── volumes/                 # Persistent Volume'lar
    └── helm-deployments/        # Helm Chart deployment
```

## 🚀 Hızlı Başlangıç

### 1. Prerequisites

```bash
# Terraform kurulumu
brew install terraform

# Hetzner CLI (opsiyonel)
brew install hcloud

# kubectl
brew install kubectl

# helm
brew install helm
```

### 2. Hetzner API Token

1. [Hetzner Cloud Console](https://console.hetzner.cloud) adresine gidin
2. Bir proje seçin veya oluşturun
3. Security → API Tokens → Generate API Token
4. Token'ı kaydedin

```bash
export HCLOUD_TOKEN="your-api-token-here"
```

### 3. SSH Key Oluşturma

```bash
# Ed25519 key oluştur (önerilen)
ssh-keygen -t ed25519 -C "hetzner-k8s" -f ~/.ssh/hetzner_k8s

# Public key'i kopyala
cat ~/.ssh/hetzner_k8s.pub
```

### 4. Deployment

```bash
# Development ortamı
./scripts/terraform-deploy.sh dev plan
./scripts/terraform-deploy.sh dev apply

# Production ortamı
./scripts/terraform-deploy.sh production plan
./scripts/terraform-deploy.sh production apply
```

### 5. Kubeconfig Kurulumu

```bash
./scripts/setup-kubeconfig.sh production
export KUBECONFIG=~/.kube/config-hetzner-production
kubectl get nodes
```

## 💰 Maliyet Tahmini

### Development Ortamı (~€35/ay)
- 1x Control Plane (cpx11): €4.85
- 2x Worker Nodes (cpx21): €17.96
- 1x Load Balancer (lb11): €5.39
- Storage (60GB): ~€3
- Network: ~€3

### Staging Ortamı (~€75/ay)
- 1x Control Plane (cpx21): €8.98
- 3x Worker Nodes (cpx31): €44.94
- 1x Load Balancer (lb11): €5.39
- Storage (150GB): ~€7.50
- Network: ~€5

### Production Ortamı (~€300/ay)
- 3x Control Plane (cpx31): €44.94
- 5x Worker Nodes (cpx41): €119.85
- 2x Specialized Pools (4x cpx41/cpx51): ~€100
- 1x Load Balancer (lb21): €10.78
- Storage (500GB): ~€25
- Network: ~€10

## 🔧 Modül Detayları

### Network Module
- Private network (10.0.0.0/8)
- Kubernetes subnet (10.0.1.0/24)
- Pod network subnet (10.0.2.0/24)
- Service network subnet (10.0.3.0/24)

### Kubernetes Module
- k3s lightweight Kubernetes
- HA control plane (3 nodes)
- Spread placement groups
- Hetzner Cloud Controller Manager
- Hetzner CSI Driver

### Firewall Module
- Control plane rules (API, etcd, kubelet)
- Worker node rules (NodePort, HTTP/S)
- SSH access restriction

### Load Balancer Module
- HTTP/HTTPS termination
- Kubernetes API exposure
- Health checks
- Sticky sessions

### Helm Deployments Module
- NGINX Ingress Controller
- Cert-Manager (Let's Encrypt)
- Prometheus/Grafana monitoring
- Loki logging
- Application Helm chart

## 📊 Monitoring & Logging

### Prometheus Stack
- Kubernetes metrics
- Node metrics
- Application metrics
- Alertmanager

### Grafana
- Pre-built dashboards
- Custom dashboards
- Alert visualization

### Loki
- Log aggregation
- Log querying
- Grafana integration

## 🔐 Güvenlik

1. **Network Security**
   - Private network isolation
   - Firewall rules
   - SSH key authentication

2. **Kubernetes Security**
   - RBAC enabled
   - Pod Security Policies
   - Network Policies

3. **TLS/SSL**
   - Let's Encrypt certificates
   - Auto-renewal

## 🔄 Backup & Recovery

```bash
# etcd backup
kubectl exec -n kube-system etcd-pod -- \
  etcdctl snapshot save /backup/etcd-snapshot.db

# Volume backup (Hetzner'da snapshot)
hcloud volume create-snapshot VOLUME_ID
```

## 🛠️ Troubleshooting

### Cluster'a Bağlanamıyorum

```bash
# Kubeconfig kontrol
echo $KUBECONFIG

# API server erişimi
curl -k https://CONTROL_PLANE_IP:6443/healthz

# SSH ile kontrol
ssh root@CONTROL_PLANE_IP
k3s kubectl get nodes
```

### Pod'lar Başlamıyor

```bash
kubectl describe pod POD_NAME -n NAMESPACE
kubectl logs POD_NAME -n NAMESPACE
```

### Volume Mount Hatası

```bash
kubectl describe pvc PVC_NAME -n NAMESPACE
kubectl get events -n NAMESPACE
```

## 📚 Kaynaklar

- [Hetzner Cloud Docs](https://docs.hetzner.com/cloud)
- [k3s Documentation](https://docs.k3s.io/)
- [Terraform Hetzner Provider](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs)
- [Helm Documentation](https://helm.sh/docs/)
