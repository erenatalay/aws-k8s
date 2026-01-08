#!/bin/bash
# ============================================================================
# HELM DEPLOYMENT SCRIPT FOR HETZNER
# Deploy application using Helm after infrastructure is ready
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HELM_DIR="$(dirname "$SCRIPT_DIR")/aws-k8s-helm"

ENVIRONMENT="${1:-production}"
NAMESPACE="${ENVIRONMENT}"

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v helm &> /dev/null; then
        log_error "Helm is not installed"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi
    
    # Check cluster connection
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        echo "Run: source scripts/setup-kubeconfig.sh $ENVIRONMENT"
        exit 1
    fi
    
    log_success "Prerequisites OK"
}

# Create namespace
create_namespace() {
    log_info "Creating namespace: $NAMESPACE"
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
    log_success "Namespace ready"
}

# Update Helm dependencies
update_dependencies() {
    log_info "Updating Helm dependencies..."
    cd "$HELM_DIR"
    helm dependency update
    log_success "Dependencies updated"
}

# Deploy application
deploy_app() {
    log_info "Deploying application to $ENVIRONMENT..."
    cd "$HELM_DIR"
    
    VALUES_FILE="values-${ENVIRONMENT}.yaml"
    if [[ ! -f "$VALUES_FILE" ]]; then
        VALUES_FILE="values.yaml"
        log_warning "Using default values.yaml (no values-${ENVIRONMENT}.yaml found)"
    fi
    
    helm upgrade --install \
        "aws-k8s-helm" \
        . \
        --namespace "$NAMESPACE" \
        --values "$VALUES_FILE" \
        --wait \
        --timeout 10m
    
    log_success "Application deployed"
}

# Show status
show_status() {
    log_info "Deployment status:"
    echo ""
    
    kubectl get pods -n "$NAMESPACE"
    echo ""
    
    kubectl get svc -n "$NAMESPACE"
    echo ""
    
    kubectl get ingress -n "$NAMESPACE" 2>/dev/null || true
}

# Main
main() {
    echo "============================================"
    echo "  Helm Deployment - $ENVIRONMENT"
    echo "============================================"
    echo ""
    
    check_prerequisites
    create_namespace
    update_dependencies
    deploy_app
    show_status
}

main
