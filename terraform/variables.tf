# ============================================================================
# BASİT TERRAFORM VARIABLES
# ============================================================================

variable "hcloud_token" {
  description = "Hetzner Cloud API Token"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment (dev, staging, production)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "k8s-cluster"
}

variable "location" {
  description = "Hetzner datacenter (fsn1, nbg1, hel1)"
  type        = string
  default     = "fsn1"
}

variable "network_zone" {
  description = "Network zone"
  type        = string
  default     = "eu-central"
}

variable "ssh_public_key" {
  description = "SSH public key"
  type        = string
  default     = ""
}

variable "control_plane_type" {
  description = "Master server type"
  type        = string
  default     = "cpx11" # 2 vCPU, 2GB RAM - €4.85/ay
}

variable "worker_node_type" {
  description = "Worker server type"
  type        = string
  default     = "cpx21" # 3 vCPU, 4GB RAM - €8.98/ay
}

variable "worker_node_count" {
  description = "Worker node sayısı"
  type        = number
  default     = 2
}
