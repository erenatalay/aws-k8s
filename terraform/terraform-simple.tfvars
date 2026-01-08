# ============================================================================
# DEV ENVIRONMENT - Basit Kurulum
# ============================================================================

# Hetzner Token
# export HCLOUD_TOKEN="your-token-here"

environment  = "dev"
project_name = "k8s-cluster"
location     = "nbg1"

# Server Types
control_plane_type = "cx23"   # 2 vCPU, 4GB RAM
worker_node_type   = "cx23"   # 2 vCPU, 4GB RAM (same as master)
worker_node_count  = 0        # Sadece master node yeterli

# SSH Key - export TF_VAR_ssh_public_key="your-ssh-key" olarak set et
# ssh_public_key = ""

# Network
network_zone = "eu-central"
