# ============================================================================
# LOAD BALANCER MODULE - OUTPUTS
# ============================================================================

output "load_balancer_id" {
  description = "Load balancer ID"
  value       = hcloud_load_balancer.main.id
}

output "load_balancer_name" {
  description = "Load balancer name"
  value       = hcloud_load_balancer.main.name
}

output "load_balancer_ip" {
  description = "Load balancer public IPv4"
  value       = hcloud_load_balancer.main.ipv4
}

output "load_balancer_ipv6" {
  description = "Load balancer public IPv6"
  value       = hcloud_load_balancer.main.ipv6
}

output "load_balancer_private_ip" {
  description = "Load balancer private IP"
  value       = hcloud_load_balancer_network.main.ip
}
