









resource "hcloud_volume" "postgres_auth" {
  name      = "${var.cluster_name}-postgres-auth"
  size      = var.volume_size
  location  = var.location
  format    = "ext4"
  labels    = merge(var.labels, { purpose = "postgres-auth" })
}


resource "hcloud_volume" "postgres_product" {
  name      = "${var.cluster_name}-postgres-product"
  size      = var.volume_size
  location  = var.location
  format    = "ext4"
  labels    = merge(var.labels, { purpose = "postgres-product" })
}






resource "hcloud_volume" "prometheus" {
  name      = "${var.cluster_name}-prometheus"
  size      = 100
  location  = var.location
  format    = "ext4"
  labels    = merge(var.labels, { purpose = "prometheus" })
}


resource "hcloud_volume" "grafana" {
  name      = "${var.cluster_name}-grafana"
  size      = 20
  location  = var.location
  format    = "ext4"
  labels    = merge(var.labels, { purpose = "grafana" })
}


resource "hcloud_volume" "loki" {
  name      = "${var.cluster_name}-loki"
  size      = 100
  location  = var.location
  format    = "ext4"
  labels    = merge(var.labels, { purpose = "loki" })
}
