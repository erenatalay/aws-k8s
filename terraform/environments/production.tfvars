







environment  = "production"
project_name = "aws-k8s-helm"
location     = "fsn1"





network_zone = "eu-central"
network_cidr = "10.0.0.0/8"
subnet_cidr  = "10.0.1.0/24"





k8s_version         = "1.28"
control_plane_count = 3
control_plane_type  = "cpx31"
worker_node_count   = 5
worker_node_type    = "cpx41"


worker_node_pools = [
  {
    name        = "high-memory"
    count       = 2
    server_type = "cpx51"
    labels = {
      "workload-type" = "high-memory"
    }
    taints = []
  },
  {
    name        = "database"
    count       = 2
    server_type = "cpx41"
    labels = {
      "workload-type" = "database"
    }
    taints = [
      {
        key    = "database"
        value  = "true"
        effect = "NoSchedule"
      }
    ]
  }
]





load_balancer_type      = "lb21"
load_balancer_algorithm = "least_connections"





volume_size              = 100
enable_volume_encryption = true





enable_firewall = true










enable_monitoring   = true
enable_logging      = true
enable_cert_manager = true

















docker_registry = "docker.io"









common_labels = {
  managed_by  = "terraform"
  project     = "aws-k8s-helm"
  environment = "production"
  team        = "platform"
  cost_center = "infrastructure"
}
