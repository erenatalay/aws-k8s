




variable "cluster_name" {
  description = "Cluster name for resource naming"
  type        = string
}

variable "location" {
  description = "Hetzner Cloud location"
  type        = string
}

variable "network_zone" {
  description = "Network zone"
  type        = string
}

variable "network_cidr" {
  description = "CIDR block for the private network"
  type        = string
}

variable "subnet_cidr" {
  description = "CIDR block for the subnet"
  type        = string
}

variable "labels" {
  description = "Labels for resources"
  type        = map(string)
  default     = {}
}
