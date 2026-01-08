# ============================================================================
# NETWORK MODULE - MAIN
# ============================================================================

# Private Network
resource "hcloud_network" "main" {
  name     = "${var.cluster_name}-network"
  ip_range = var.network_cidr
  labels   = var.labels
}

# Kubernetes Subnet
resource "hcloud_network_subnet" "kubernetes" {
  network_id   = hcloud_network.main.id
  type         = "cloud"
  network_zone = var.network_zone
  ip_range     = var.subnet_cidr
}

# Pod Network Subnet (for CNI)
resource "hcloud_network_subnet" "pods" {
  network_id   = hcloud_network.main.id
  type         = "cloud"
  network_zone = var.network_zone
  ip_range     = "10.0.2.0/24"
}

# Service Network Subnet
resource "hcloud_network_subnet" "services" {
  network_id   = hcloud_network.main.id
  type         = "cloud"
  network_zone = var.network_zone
  ip_range     = "10.0.3.0/24"
}
