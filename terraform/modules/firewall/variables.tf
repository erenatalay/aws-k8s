



variable "cluster_name" {
  description = "Cluster name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "enable_firewall" {
  description = "Enable firewall rules"
  type        = bool
  default     = true
}

variable "allowed_ssh_ips" {
  description = "List of IPs allowed for SSH"
  type        = list(string)
  default     = []
}

variable "labels" {
  description = "Labels for resources"
  type        = map(string)
  default     = {}
}
