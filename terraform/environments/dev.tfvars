







environment  = "dev"
project_name = "aws-k8s-helm"
location     = "fsn1"





network_zone = "eu-central"
network_cidr = "10.0.0.0/8"
subnet_cidr  = "10.0.1.0/24"





k8s_version         = "1.28"
control_plane_count = 1
control_plane_type  = "cpx11"
worker_node_count   = 2
worker_node_type    = "cpx21"





load_balancer_type      = "lb11"
load_balancer_algorithm = "round_robin"





volume_size              = 20
enable_volume_encryption = false





enable_firewall = true






enable_monitoring   = false
enable_logging      = false
enable_cert_manager = false





docker_registry = "docker.io"









common_labels = {
  managed_by  = "terraform"
  project     = "aws-k8s-helm"
  environment = "dev"
  team        = "development"
}
