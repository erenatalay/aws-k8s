# Hetzner Cloud k3s Cluster - Basit Kurulum

Load balancer olmadan, sadece NodePort ile çalışan basit bir k3s cluster kurulumu.

## 🚀 Hızlı Başlangıç

### 1. Token Al
```bash
# Hetzner Console'dan API token al
export HCLOUD_TOKEN="your-token-here"
```

### 2. SSH Key Oluştur (Opsiyonel)
```bash
ssh-keygen -t ed25519 -f ~/.ssh/hetzner_k8s
```

### 3. Cluster Kur

```bash
cd terraform

# Basit versiyonu kullan
terraform init

# Plan kontrol et
terraform plan \
  -var="hcloud_token=$HCLOUD_TOKEN" \
  -var-file="terraform-simple.tfvars"

# Cluster'ı kur
terraform apply \
  -var="hcloud_token=$HCLOUD_TOKEN" \
  -var-file="terraform-simple.tfvars"
```

### 4. Kubeconfig Ayarla

```bash
# Terraform output'tan kubeconfig path'i al
export KUBECONFIG=$(terraform output -raw kubeconfig_path)

# Cluster'ı kontrol et
kubectl get nodes
```

## 📊 Mimari

```
┌─────────────────────────────────────┐
│         Hetzner Cloud               │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Master Node (cpx11)         │  │
│  │   - k3s server                │  │
│  │   - 10.0.1.10                 │  │
│  │   Public IP: xxx.xxx.xxx.xxx  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Worker 1 (cpx21)            │  │
│  │   - k3s agent                 │  │
│  │   - 10.0.1.20                 │  │
│  │   Public IP: xxx.xxx.xxx.xxx  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Worker 2 (cpx21)            │  │
│  │   - k3s agent                 │  │
│  │   - 10.0.1.21                 │  │
│  │   Public IP: xxx.xxx.xxx.xxx  │  │
│  └───────────────────────────────┘  │
│                                     │
│  Private Network: 10.0.0.0/8       │
└─────────────────────────────────────┘
```

## 💰 Maliyet

```
Master:  1x cpx11 = €4.85/ay
Worker:  2x cpx21 = €17.96/ay
Network: €3/ay
─────────────────────────────
TOPLAM:  ~€26/ay
```

## 🔌 Servislere Erişim

Load balancer olmadığı için NodePort kullanacaksın:

```yaml
# service.yaml örneği
apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 3000
      nodePort: 30080  # 30000-32767 arası
  selector:
    app: my-app
```

Erişim:
```bash
# Herhangi bir worker IP kullan
http://WORKER_IP:30080
```

## 📝 Helm Deployment

```bash
# Namespace oluştur
kubectl create namespace production

# Helm install
cd ../aws-k8s-helm
helm dependency update
helm install my-app . \
  --namespace production \
  --values values-local.yaml
```

## 🛠️ Yararlı Komutlar

```bash
# Node'ları görüntüle
kubectl get nodes -o wide

# Pod'ları görüntüle
kubectl get pods -A

# Servisleri görüntüle
kubectl get svc -A

# Master'a SSH
terraform output -raw ssh_command_master

# Worker IP'lerini al
terraform output -json worker_ips | jq -r '.[]'
```

## 🔄 Cluster'ı Güncelle

```bash
# Worker sayısını artır
terraform apply \
  -var="worker_node_count=3" \
  -var="hcloud_token=$HCLOUD_TOKEN" \
  -var-file="terraform-simple.tfvars"
```

## 🗑️ Cluster'ı Sil

```bash
terraform destroy \
  -var="hcloud_token=$HCLOUD_TOKEN" \
  -var-file="terraform-simple.tfvars"
```

## 📚 Dosyalar

- `main-simple.tf` - Ana Terraform konfigürasyonu
- `variables-simple.tf` - Değişken tanımları
- `versions-simple.tf` - Provider versiyonları
- `terraform-simple.tfvars` - Environment ayarları
- `cloud-init-master.sh` - Master node kurulum script
- `cloud-init-worker.sh` - Worker node kurulum script
