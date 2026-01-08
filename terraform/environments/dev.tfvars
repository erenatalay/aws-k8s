# ============================================================================
# DEVELOPMENT ENVIRONMENT - TERRAFORM VARIABLES
# Hetzner Cloud - Small Development Cluster
# ============================================================================

# Hetzner Cloud API Token (get from: https://console.hetzner.cloud)
# hcloud_token = "your-api-token-here"

environment  = "dev"
project_name = "aws-k8s-helm"
location     = "fsn1"  # Falkenstein, Germany

# ============================================================================
# NETWORK CONFIGURATION
# ============================================================================

network_zone = "eu-central"
network_cidr = "10.0.0.0/8"
subnet_cidr  = "10.0.1.0/24"

# ============================================================================
# KUBERNETES CLUSTER - SMALL DEV SETUP
# ============================================================================

k8s_version         = "1.28"
control_plane_count = 1          # Single control plane for dev
control_plane_type  = "cpx11"    # 2 vCPU, 2GB RAM (€4.85/mo)
worker_node_count   = 2          # Minimal workers
worker_node_type    = "cpx21"    # 3 vCPU, 4GB RAM (€8.98/mo)

# ============================================================================
# LOAD BALANCER
# ============================================================================

load_balancer_type      = "lb11"        # Small LB (€5.39/mo)
load_balancer_algorithm = "round_robin"

# ============================================================================
# STORAGE
# ============================================================================

volume_size              = 20   # 20GB per volume
enable_volume_encryption = false  # Dev doesn't need encryption

# ============================================================================
# SECURITY
# ============================================================================

enable_firewall = true
# allowed_ssh_ips = ["YOUR_IP/32"]  # Restrict SSH access

# ============================================================================
# FEATURES
# ============================================================================

enable_monitoring   = false  # Disable in dev to save resources
enable_logging      = false  # Disable in dev to save resources
enable_cert_manager = false  # No TLS needed in dev

# ============================================================================
# APPLICATION
# ============================================================================

docker_registry = "docker.io"

# Database passwords (change these!)
# postgresql_auth_password    = "dev-auth-password"
# postgresql_product_password = "dev-product-password"

# ============================================================================
# LABELS
# ============================================================================

common_labels = {
  managed_by  = "terraform"
  project     = "aws-k8s-helm"
  environment = "dev"
  team        = "development"
}
