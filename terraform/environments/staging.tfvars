# ============================================================================
# STAGING ENVIRONMENT - TERRAFORM VARIABLES
# Hetzner Cloud - Medium Staging Cluster
# ============================================================================

# Hetzner Cloud API Token (get from: https://console.hetzner.cloud)
# hcloud_token = "your-api-token-here"

environment  = "staging"
project_name = "aws-k8s-helm"
location     = "fsn1"  # Falkenstein, Germany

# ============================================================================
# NETWORK CONFIGURATION
# ============================================================================

network_zone = "eu-central"
network_cidr = "10.0.0.0/8"
subnet_cidr  = "10.0.1.0/24"

# ============================================================================
# KUBERNETES CLUSTER - STAGING SETUP
# ============================================================================

k8s_version         = "1.28"
control_plane_count = 1          # Single control plane for staging
control_plane_type  = "cpx21"    # 3 vCPU, 4GB RAM
worker_node_count   = 3          # 3 workers for HA testing
worker_node_type    = "cpx31"    # 4 vCPU, 8GB RAM

# ============================================================================
# LOAD BALANCER
# ============================================================================

load_balancer_type      = "lb11"
load_balancer_algorithm = "round_robin"

# ============================================================================
# STORAGE
# ============================================================================

volume_size              = 50
enable_volume_encryption = true

# ============================================================================
# SECURITY
# ============================================================================

enable_firewall = true
# allowed_ssh_ips = ["YOUR_OFFICE_IP/32"]

# ============================================================================
# FEATURES
# ============================================================================

enable_monitoring   = true   # Enable for testing
enable_logging      = true   # Enable for debugging
enable_cert_manager = true
# letsencrypt_email = "devops@yourcompany.com"

# ============================================================================
# DOMAIN (Optional)
# ============================================================================

# domain_name = "staging.yourcompany.com"
# subdomains = {
#   api     = "api"
#   gateway = "gateway"
#   app     = "app"
# }

# ============================================================================
# APPLICATION
# ============================================================================

docker_registry = "docker.io"

# Database passwords (change these!)
# postgresql_auth_password    = "staging-auth-password"
# postgresql_product_password = "staging-product-password"

# ============================================================================
# LABELS
# ============================================================================

common_labels = {
  managed_by  = "terraform"
  project     = "aws-k8s-helm"
  environment = "staging"
  team        = "platform"
}
