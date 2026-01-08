# ============================================================================
# VOLUMES MODULE - VARIABLES
# ============================================================================

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

variable "volume_size" {
  description = "Volume size in GB"
  type        = number
  default     = 50
}

variable "enable_encryption" {
  description = "Enable volume encryption"
  type        = bool
  default     = true
}

variable "server_ids" {
  description = "Server IDs to attach volumes"
  type        = list(number)
}

variable "labels" {
  description = "Labels for resources"
  type        = map(string)
  default     = {}
}
