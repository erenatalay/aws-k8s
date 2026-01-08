# ============================================================================
# FIREWALL MODULE - OUTPUTS
# ============================================================================

output "firewall_ids" {
  description = "All firewall IDs"
  value = var.enable_firewall ? [
    hcloud_firewall.control_plane[0].id,
    hcloud_firewall.workers[0].id
  ] : []
}

output "control_plane_firewall_id" {
  description = "Control plane firewall ID"
  value       = var.enable_firewall ? hcloud_firewall.control_plane[0].id : null
}

output "workers_firewall_id" {
  description = "Workers firewall ID"
  value       = var.enable_firewall ? hcloud_firewall.workers[0].id : null
}

output "load_balancer_firewall_id" {
  description = "Load balancer firewall ID"
  value       = var.enable_firewall ? hcloud_firewall.load_balancer[0].id : null
}
