#!/bin/bash




set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

if [[ -z "${HCLOUD_TOKEN}" ]]; then
    log_error "HCLOUD_TOKEN bulunamadı!"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================"
echo "  CLUSTER SİLME İŞLEMİ"
echo "============================================"
echo ""

log_warning "TÜM CLUSTER SİLİNECEK!"
echo ""

terraform output 2>/dev/null || true

echo ""
read -p "Cluster'ı silmek istediğinizden emin misiniz? (EVET yazın): " confirm

if [[ "$confirm" != "EVET" ]]; then
    echo "İşlem iptal edildi"
    exit 0
fi

terraform destroy \
    -var="hcloud_token=${HCLOUD_TOKEN}" \
    -var-file="terraform-simple.tfvars" \
    -auto-approve

echo ""
echo "Cluster silindi!"
