#!/bin/bash
# ============================================================================
# BASİT HETZNER k3s KURULUM SCRIPTI
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

echo "============================================"
echo "  Hetzner Cloud k3s Cluster Kurulumu"
echo "============================================"
echo ""

# Token kontrolü
if [[ -z "${HCLOUD_TOKEN}" ]]; then
    log_error "HCLOUD_TOKEN environment variable bulunamadı!"
    echo ""
    echo "Hetzner API token'ınızı ayarlayın:"
    echo "  export HCLOUD_TOKEN='your-token-here'"
    echo ""
    echo "Token almak için: https://console.hetzner.cloud"
    exit 1
fi

log_success "Hetzner token bulundu"

# Terraform kontrolü
if ! command -v terraform &> /dev/null; then
    log_error "Terraform kurulu değil!"
    echo "Kurulum için: brew install terraform"
    exit 1
fi

log_success "Terraform bulundu: $(terraform version | head -n1)"

# Klasör kontrolü
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR"

cd "$TERRAFORM_DIR"

# Terraform init
log_info "Terraform başlatılıyor..."
terraform init -upgrade > /dev/null 2>&1
log_success "Terraform başlatıldı"

# Plan
log_info "Terraform plan oluşturuluyor..."
terraform plan \
    -var="hcloud_token=${HCLOUD_TOKEN}" \
    -var-file="terraform-simple.tfvars" \
    -out=tfplan

echo ""
read -p "Cluster'ı kurmak istiyor musunuz? (evet/hayır): " confirm

if [[ "$confirm" != "evet" ]]; then
    log_info "İşlem iptal edildi"
    exit 0
fi

# Apply
log_info "Cluster kuruluyor... (Bu 3-5 dakika sürebilir)"
terraform apply tfplan

echo ""
log_success "Cluster başarıyla kuruldu!"
echo ""

# Outputs
log_info "Cluster bilgileri:"
echo ""
terraform output -json | jq -r 'to_entries[] | "\(.key): \(.value.value)"' | grep -v "k3s_token"

echo ""
log_info "Kubeconfig ayarlamak için:"
echo "  export KUBECONFIG=\$(terraform output -raw kubeconfig_path)"
echo "  kubectl get nodes"
echo ""

log_success "Kurulum tamamlandı! 🎉"
