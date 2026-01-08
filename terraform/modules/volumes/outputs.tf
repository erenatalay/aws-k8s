# ============================================================================
# VOLUMES MODULE - OUTPUTS
# ============================================================================

output "postgres_auth_volume_id" {
  description = "PostgreSQL Auth volume ID"
  value       = hcloud_volume.postgres_auth.id
}

output "postgres_product_volume_id" {
  description = "PostgreSQL Product volume ID"
  value       = hcloud_volume.postgres_product.id
}

output "prometheus_volume_id" {
  description = "Prometheus volume ID"
  value       = hcloud_volume.prometheus.id
}

output "grafana_volume_id" {
  description = "Grafana volume ID"
  value       = hcloud_volume.grafana.id
}

output "loki_volume_id" {
  description = "Loki volume ID"
  value       = hcloud_volume.loki.id
}

output "all_volume_ids" {
  description = "All volume IDs"
  value = [
    hcloud_volume.postgres_auth.id,
    hcloud_volume.postgres_product.id,
    hcloud_volume.prometheus.id,
    hcloud_volume.grafana.id,
    hcloud_volume.loki.id
  ]
}
