# ============================================================================
# PRODUCTION ENVIRONMENT - TERRAFORM VARIABLES
# Hetzner Cloud - High Availability Production Cluster
# ============================================================================

# Hetzner Cloud API Token (get from: https://console.hetzner.cloud)
# hcloud_token = "your-api-token-here"

environment  = "production"
project_name = "aws-k8s-helm"
location     = "fsn1"  # Falkenstein, Germany

# ============================================================================
# NETWORK CONFIGURATION
# ============================================================================

network_zone = "eu-central"
network_cidr = "10.0.0.0/8"
subnet_cidr  = "10.0.1.0/24"

# ============================================================================
# KUBERNETES CLUSTER - PRODUCTION HA SETUP
# ============================================================================

k8s_version         = "1.28"
control_plane_count = 3          # 3 control planes for HA
control_plane_type  = "cpx31"    # 4 vCPU, 8GB RAM
worker_node_count   = 5          # 5 workers for production load
worker_node_type    = "cpx41"    # 8 vCPU, 16GB RAM

# Additional specialized node pools
worker_node_pools = [
  {
    name        = "high-memory"
    count       = 2
    server_type = "cpx51"  # 16 vCPU, 32GB RAM
    labels = {
      "workload-type" = "high-memory"
    }
    taints = []
  },
  {
    name        = "database"
    count       = 2
    server_type = "cpx41"
    labels = {
      "workload-type" = "database"
    }
    taints = [
      {
        key    = "database"
        value  = "true"
        effect = "NoSchedule"
      }
    ]
  }
]

# ============================================================================
# LOAD BALANCER
# ============================================================================

load_balancer_type      = "lb21"  # Medium LB for production
load_balancer_algorithm = "least_connections"

# ============================================================================
# STORAGE
# ============================================================================

volume_size              = 100
enable_volume_encryption = true

# ============================================================================
# SECURITY
# ============================================================================

enable_firewall = true
# SSH access should be very restricted in production
# allowed_ssh_ips = ["YOUR_VPN_IP/32", "YOUR_BASTION_IP/32"]

# SSH Key (generate with: ssh-keygen -t ed25519)
# ssh_public_key = "ssh-ed25519 AAAA..."

# ============================================================================
# FEATURES
# ============================================================================

enable_monitoring   = true
enable_logging      = true
enable_cert_manager = true
# letsencrypt_email = "ssl@yourcompany.com"

# ============================================================================
# DOMAIN CONFIGURATION
# ============================================================================

# domain_name = "yourcompany.com"
# subdomains = {
#   api     = "api"
#   gateway = "gateway"
#   app     = "app"
# }

# ============================================================================
# APPLICATION
# ============================================================================

docker_registry = "docker.io"

# Database passwords (USE STRONG PASSWORDS!)
# postgresql_auth_password    = "super-strong-auth-password-here"
# postgresql_product_password = "super-strong-product-password-here"

# ============================================================================
# LABELS
# ============================================================================

common_labels = {
  managed_by  = "terraform"
  project     = "aws-k8s-helm"
  environment = "production"
  team        = "platform"
  cost_center = "infrastructure"
}
