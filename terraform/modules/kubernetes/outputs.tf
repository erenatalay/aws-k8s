# ============================================================================
# KUBERNETES MODULE - OUTPUTS
# ============================================================================

output "control_plane_server_ids" {
  description = "IDs of control plane servers"
  value       = hcloud_server.control_plane[*].id
}

output "control_plane_ips" {
  description = "Public IPs of control plane servers"
  value       = hcloud_server.control_plane[*].ipv4_address
}

output "control_plane_private_ips" {
  description = "Private IPs of control plane servers"
  value       = [for s in hcloud_server.control_plane : s.network[*].ip]
}

output "worker_server_ids" {
  description = "IDs of worker servers"
  value       = hcloud_server.workers[*].id
}

output "worker_ips" {
  description = "Public IPs of worker servers"
  value       = hcloud_server.workers[*].ipv4_address
}

output "worker_private_ips" {
  description = "Private IPs of worker servers"
  value       = [for s in hcloud_server.workers : s.network[*].ip]
}

output "k3s_token" {
  description = "K3s cluster token"
  value       = random_password.k3s_token.result
  sensitive   = true
}

output "kubeconfig_host" {
  description = "Kubernetes API server endpoint"
  value       = "https://${hcloud_server.control_plane[0].ipv4_address}:6443"
}

output "kubeconfig_ca_certificate" {
  description = "Kubernetes CA certificate (base64)"
  value       = try(yamldecode(data.local_file.kubeconfig.content)["clusters"][0]["cluster"]["certificate-authority-data"], "")
  sensitive   = true
}

output "kubeconfig_client_certificate" {
  description = "Kubernetes client certificate (base64)"
  value       = try(yamldecode(data.local_file.kubeconfig.content)["users"][0]["user"]["client-certificate-data"], "")
  sensitive   = true
}

output "kubeconfig_client_key" {
  description = "Kubernetes client key (base64)"
  value       = try(yamldecode(data.local_file.kubeconfig.content)["users"][0]["user"]["client-key-data"], "")
  sensitive   = true
}

output "cluster_name" {
  description = "Cluster name"
  value       = var.cluster_name
}
