







environment  = "staging"
project_name = "aws-k8s-helm"
location     = "fsn1"





network_zone = "eu-central"
network_cidr = "10.0.0.0/8"
subnet_cidr  = "10.0.1.0/24"





k8s_version         = "1.28"
control_plane_count = 1
control_plane_type  = "cpx21"
worker_node_count   = 3
worker_node_type    = "cpx31"





load_balancer_type      = "lb11"
load_balancer_algorithm = "round_robin"





volume_size              = 50
enable_volume_encryption = true





enable_firewall = true






enable_monitoring   = true
enable_logging      = true
enable_cert_manager = true

















docker_registry = "docker.io"









common_labels = {
  managed_by  = "terraform"
  project     = "aws-k8s-helm"
  environment = "staging"
  team        = "platform"
}
