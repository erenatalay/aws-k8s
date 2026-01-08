# ============================================================================
# HELM DEPLOYMENTS MODULE - OUTPUTS
# ============================================================================

output "namespace" {
  description = "Application namespace"
  value       = kubernetes_namespace.main.metadata[0].name
}

output "application_release_name" {
  description = "Application Helm release name"
  value       = helm_release.application.name
}

output "application_release_status" {
  description = "Application Helm release status"
  value       = helm_release.application.status
}

output "nginx_ingress_status" {
  description = "NGINX Ingress release status"
  value       = helm_release.nginx_ingress.status
}

output "cert_manager_status" {
  description = "Cert Manager release status"
  value       = var.enable_cert_manager ? helm_release.cert_manager[0].status : "disabled"
}

output "prometheus_status" {
  description = "Prometheus release status"
  value       = var.enable_monitoring ? helm_release.prometheus_stack[0].status : "disabled"
}

output "loki_status" {
  description = "Loki release status"
  value       = var.enable_logging ? helm_release.loki[0].status : "disabled"
}
