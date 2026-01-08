# ============================================================================
# HELM DEPLOYMENTS MODULE - VARIABLES
# ============================================================================

variable "cluster_name" {
  description = "Cluster name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "app_chart_path" {
  description = "Path to the application Helm chart"
  type        = string
}

variable "docker_registry" {
  description = "Docker registry"
  type        = string
  default     = "docker.io"
}

variable "image_pull_secrets" {
  description = "Docker registry pull secrets"
  type = list(object({
    name     = string
    registry = string
    username = string
    password = string
  }))
  default   = []
  sensitive = true
}

variable "postgresql_enabled" {
  description = "Enable PostgreSQL"
  type        = bool
  default     = true
}

variable "postgresql_auth_password" {
  description = "PostgreSQL auth password"
  type        = string
  sensitive   = true
}

variable "postgresql_product_password" {
  description = "PostgreSQL product password"
  type        = string
  sensitive   = true
}

variable "enable_monitoring" {
  description = "Enable monitoring stack"
  type        = bool
  default     = true
}

variable "enable_logging" {
  description = "Enable logging stack"
  type        = bool
  default     = true
}

variable "enable_cert_manager" {
  description = "Enable cert-manager"
  type        = bool
  default     = true
}

variable "letsencrypt_email" {
  description = "Let's Encrypt email"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Primary domain name"
  type        = string
  default     = ""
}

variable "subdomains" {
  description = "Subdomains"
  type = object({
    api     = string
    gateway = string
    app     = string
  })
  default = {
    api     = "api"
    gateway = "gateway"
    app     = "app"
  }
}

variable "load_balancer_ip" {
  description = "Load balancer IP (not used)"
  type        = string
  default     = ""
}

