



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

variable "load_balancer_type" {
  description = "Load balancer type"
  type        = string
  default     = "lb11"
}

variable "load_balancer_algorithm" {
  description = "Load balancer algorithm"
  type        = string
  default     = "round_robin"
}

variable "target_server_ids" {
  description = "Target server IDs"
  type        = list(number)
}

variable "labels" {
  description = "Labels for resources"
  type        = map(string)
  default     = {}
}
