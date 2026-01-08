# ============================================================================
# VOLUMES MODULE - MAIN
# Hetzner Cloud Block Storage
# ============================================================================

# ============================================================================
# DATABASE VOLUMES
# ============================================================================

# PostgreSQL Auth API Volume
resource "hcloud_volume" "postgres_auth" {
  name      = "${var.cluster_name}-postgres-auth"
  size      = var.volume_size
  location  = var.location
  format    = "ext4"
  labels    = merge(var.labels, { purpose = "postgres-auth" })
}

# PostgreSQL Product API Volume
resource "hcloud_volume" "postgres_product" {
  name      = "${var.cluster_name}-postgres-product"
  size      = var.volume_size
  location  = var.location
  format    = "ext4"
  labels    = merge(var.labels, { purpose = "postgres-product" })
}

# ============================================================================
# MONITORING VOLUMES
# ============================================================================

# Prometheus Volume
resource "hcloud_volume" "prometheus" {
  name      = "${var.cluster_name}-prometheus"
  size      = 100
  location  = var.location
  format    = "ext4"
  labels    = merge(var.labels, { purpose = "prometheus" })
}

# Grafana Volume
resource "hcloud_volume" "grafana" {
  name      = "${var.cluster_name}-grafana"
  size      = 20
  location  = var.location
  format    = "ext4"
  labels    = merge(var.labels, { purpose = "grafana" })
}

# Loki Volume (Logs)
resource "hcloud_volume" "loki" {
  name      = "${var.cluster_name}-loki"
  size      = 100
  location  = var.location
  format    = "ext4"
  labels    = merge(var.labels, { purpose = "loki" })
}
