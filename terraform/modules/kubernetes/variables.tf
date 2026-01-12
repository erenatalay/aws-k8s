




variable "cluster_name" {
  description = "Cluster name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "location" {
  description = "Hetzner location"
  type        = string
}

variable "network_id" {
  description = "Network ID"
  type        = number
}

variable "subnet_id" {
  description = "Subnet ID"
  type        = string
}

variable "ssh_key_ids" {
  description = "SSH key IDs"
  type        = list(number)
  default     = []
}

variable "firewall_ids" {
  description = "Firewall IDs to attach"
  type        = list(number)
  default     = []
}

variable "control_plane_count" {
  description = "Number of control plane nodes"
  type        = number
  default     = 3
}

variable "control_plane_type" {
  description = "Server type for control plane"
  type        = string
  default     = "cpx21"
}

variable "worker_node_count" {
  description = "Number of worker nodes"
  type        = number
  default     = 3
}

variable "worker_node_type" {
  description = "Server type for worker nodes"
  type        = string
  default     = "cpx31"
}

variable "worker_node_pools" {
  description = "Additional worker node pools"
  type = list(object({
    name        = string
    count       = number
    server_type = string
    labels      = map(string)
    taints      = list(object({
      key    = string
      value  = string
      effect = string
    }))
  }))
  default = []
}

variable "k8s_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.28"
}

variable "labels" {
  description = "Labels for resources"
  type        = map(string)
  default     = {}
}
