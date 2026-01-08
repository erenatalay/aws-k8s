#!/bin/bash
# ============================================================================
# TERRAFORM DEPLOYMENT SCRIPT
# Deploy infrastructure to Hetzner Cloud
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$(dirname "$SCRIPT_DIR")/terraform"

# Default values
ENVIRONMENT="${1:-dev}"
ACTION="${2:-plan}"

# Functions
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

print_usage() {
    echo "Usage: $0 <environment> <action>"
    echo ""
    echo "Environments:"
    echo "  dev         Development environment"
    echo "  staging     Staging environment"
    echo "  production  Production environment"
    echo ""
    echo "Actions:"
    echo "  plan        Preview changes (default)"
    echo "  apply       Apply changes"
    echo "  destroy     Destroy infrastructure"
    echo "  output      Show outputs"
    echo ""
    echo "Examples:"
    echo "  $0 dev plan"
    echo "  $0 staging apply"
    echo "  $0 production destroy"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check terraform
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed. Please install it first."
        echo "  brew install terraform"
        exit 1
    fi
    
    # Check jq
    if ! command -v jq &> /dev/null; then
        log_warning "jq is not installed. Some features may not work."
        echo "  brew install jq"
    fi
    
    # Check HCLOUD_TOKEN
    if [[ -z "${HCLOUD_TOKEN}" ]]; then
        log_error "HCLOUD_TOKEN environment variable is not set."
        echo "  export HCLOUD_TOKEN='your-token-here'"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

validate_environment() {
    if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|production)$ ]]; then
        log_error "Invalid environment: $ENVIRONMENT"
        print_usage
        exit 1
    fi
    
    if [[ ! -f "$TERRAFORM_DIR/environments/${ENVIRONMENT}.tfvars" ]]; then
        log_error "Environment file not found: environments/${ENVIRONMENT}.tfvars"
        exit 1
    fi
}

terraform_init() {
    log_info "Initializing Terraform..."
    cd "$TERRAFORM_DIR"
    
    terraform init -upgrade
    
    log_success "Terraform initialized"
}

terraform_validate() {
    log_info "Validating Terraform configuration..."
    cd "$TERRAFORM_DIR"
    
    terraform validate
    
    log_success "Terraform configuration is valid"
}

terraform_plan() {
    log_info "Creating Terraform plan for $ENVIRONMENT..."
    cd "$TERRAFORM_DIR"
    
    terraform plan \
        -var="hcloud_token=${HCLOUD_TOKEN}" \
        -var-file="environments/${ENVIRONMENT}.tfvars" \
        -out="tfplan-${ENVIRONMENT}"
    
    log_success "Plan created: tfplan-${ENVIRONMENT}"
}

terraform_apply() {
    log_info "Applying Terraform changes to $ENVIRONMENT..."
    cd "$TERRAFORM_DIR"
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        log_warning "You are about to apply changes to PRODUCTION!"
        read -p "Are you sure? (yes/no): " confirm
        if [[ "$confirm" != "yes" ]]; then
            log_info "Aborting..."
            exit 0
        fi
    fi
    
    # Check if plan exists
    if [[ -f "tfplan-${ENVIRONMENT}" ]]; then
        terraform apply "tfplan-${ENVIRONMENT}"
    else
        terraform apply \
            -var="hcloud_token=${HCLOUD_TOKEN}" \
            -var-file="environments/${ENVIRONMENT}.tfvars" \
            -auto-approve
    fi
    
    log_success "Terraform applied successfully"
}

terraform_destroy() {
    log_info "Destroying $ENVIRONMENT infrastructure..."
    cd "$TERRAFORM_DIR"
    
    log_warning "This will DESTROY all resources in $ENVIRONMENT!"
    read -p "Type the environment name to confirm: " confirm
    if [[ "$confirm" != "$ENVIRONMENT" ]]; then
        log_info "Aborting..."
        exit 0
    fi
    
    terraform destroy \
        -var="hcloud_token=${HCLOUD_TOKEN}" \
        -var-file="environments/${ENVIRONMENT}.tfvars" \
        -auto-approve
    
    log_success "Infrastructure destroyed"
}

terraform_output() {
    log_info "Showing outputs for $ENVIRONMENT..."
    cd "$TERRAFORM_DIR"
    
    terraform output
}

# Main
main() {
    echo "============================================"
    echo "  Hetzner Cloud Infrastructure Deployment"
    echo "============================================"
    echo ""
    
    check_prerequisites
    validate_environment
    
    case "$ACTION" in
        plan)
            terraform_init
            terraform_validate
            terraform_plan
            ;;
        apply)
            terraform_init
            terraform_validate
            terraform_plan
            terraform_apply
            ;;
        destroy)
            terraform_init
            terraform_destroy
            ;;
        output)
            terraform_output
            ;;
        *)
            log_error "Invalid action: $ACTION"
            print_usage
            exit 1
            ;;
    esac
}

# Run main
main
