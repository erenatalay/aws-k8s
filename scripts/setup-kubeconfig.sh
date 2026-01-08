#!/bin/bash
# ============================================================================
# KUBECONFIG SETUP SCRIPT
# Configure kubectl to access the Hetzner cluster
# ============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$(dirname "$SCRIPT_DIR")/terraform"
KUBECONFIG_DIR="$HOME/.kube"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

ENVIRONMENT="${1:-production}"

log_info "Setting up kubeconfig for $ENVIRONMENT..."

# Get kubeconfig from terraform
cd "$TERRAFORM_DIR"

# Check if terraform state exists
if [[ ! -f "terraform.tfstate" ]]; then
    echo "Error: Terraform state not found. Run terraform apply first."
    exit 1
fi

# Get the first control plane IP
CONTROL_PLANE_IP=$(terraform output -json control_plane_ips 2>/dev/null | jq -r '.[0]')

if [[ -z "$CONTROL_PLANE_IP" ]] || [[ "$CONTROL_PLANE_IP" == "null" ]]; then
    echo "Error: Could not get control plane IP from terraform output"
    exit 1
fi

log_info "Control plane IP: $CONTROL_PLANE_IP"

# Create kubeconfig directory
mkdir -p "$KUBECONFIG_DIR"

# Download kubeconfig from server
log_info "Downloading kubeconfig from control plane..."
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
    "root@${CONTROL_PLANE_IP}" \
    'cat /etc/rancher/k3s/k3s.yaml' | \
    sed "s/127.0.0.1/${CONTROL_PLANE_IP}/g" > "$KUBECONFIG_DIR/config-hetzner-${ENVIRONMENT}"

# Set permissions
chmod 600 "$KUBECONFIG_DIR/config-hetzner-${ENVIRONMENT}"

log_success "Kubeconfig saved to: $KUBECONFIG_DIR/config-hetzner-${ENVIRONMENT}"

# Instructions
echo ""
echo "To use this kubeconfig:"
echo "  export KUBECONFIG=$KUBECONFIG_DIR/config-hetzner-${ENVIRONMENT}"
echo ""
echo "Or merge with existing kubeconfig:"
echo "  KUBECONFIG=$KUBECONFIG_DIR/config:$KUBECONFIG_DIR/config-hetzner-${ENVIRONMENT} kubectl config view --flatten > $KUBECONFIG_DIR/config.new"
echo "  mv $KUBECONFIG_DIR/config.new $KUBECONFIG_DIR/config"
echo ""
echo "Test connection:"
echo "  kubectl get nodes"
