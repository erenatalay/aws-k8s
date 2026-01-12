



output "network_id" {
  description = "ID of the private network"
  value       = hcloud_network.main.id
}

output "network_name" {
  description = "Name of the private network"
  value       = hcloud_network.main.name
}

output "network_cidr" {
  description = "CIDR of the private network"
  value       = hcloud_network.main.ip_range
}

output "subnet_id" {
  description = "ID of the kubernetes subnet"
  value       = hcloud_network_subnet.kubernetes.id
}

output "subnet_cidr" {
  description = "CIDR of the kubernetes subnet"
  value       = hcloud_network_subnet.kubernetes.ip_range
}

output "pod_subnet_id" {
  description = "ID of the pod subnet"
  value       = hcloud_network_subnet.pods.id
}

output "pod_subnet_cidr" {
  description = "CIDR of the pod subnet"
  value       = hcloud_network_subnet.pods.ip_range
}

output "service_subnet_id" {
  description = "ID of the service subnet"
  value       = hcloud_network_subnet.services.id
}

output "service_subnet_cidr" {
  description = "CIDR of the service subnet"
  value       = hcloud_network_subnet.services.ip_range
}
