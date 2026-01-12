




provider "hcloud" {
  token = var.hcloud_token
}

locals {
  cluster_name = "${var.project_name}-${var.environment}"
}






data "hcloud_ssh_keys" "all" {}





resource "hcloud_network" "main" {
  name     = "${local.cluster_name}-network"
  ip_range = "10.0.0.0/8"
}

resource "hcloud_network_subnet" "kubernetes" {
  network_id   = hcloud_network.main.id
  type         = "cloud"
  network_zone = var.network_zone
  ip_range     = "10.0.1.0/24"
}





resource "hcloud_firewall" "cluster" {
  name = "${local.cluster_name}-firewall"


  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = ["0.0.0.0/0", "::/0"]
  }


  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "6443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }


  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }


  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }


  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "30000-32767"
    source_ips = ["0.0.0.0/0", "::/0"]
  }


  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "2379-2380"
    source_ips = ["10.0.0.0/8"]
  }

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "10250"
    source_ips = ["10.0.0.0/8"]
  }


  rule {
    direction  = "in"
    protocol   = "udp"
    port       = "8472"
    source_ips = ["10.0.0.0/8"]
  }


  rule {
    direction  = "in"
    protocol   = "icmp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
}





resource "random_password" "k3s_token" {
  length  = 64
  special = false
}





resource "hcloud_server" "control_plane" {
  name         = "${local.cluster_name}-master"
  server_type  = var.control_plane_type
  image        = "ubuntu-22.04"
  location     = var.location
  ssh_keys     = [for key in data.hcloud_ssh_keys.all.ssh_keys : key.id]
  firewall_ids = [hcloud_firewall.cluster.id]

  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }

  network {
    network_id = hcloud_network.main.id
    ip         = "10.0.1.10"
  }

  user_data = templatefile("${path.module}/cloud-init-master.sh", {
    k3s_token    = random_password.k3s_token.result
    node_ip      = "10.0.1.10"
    cluster_name = local.cluster_name
  })

  lifecycle {
    ignore_changes = [user_data, ssh_keys]
  }
}





resource "hcloud_server" "workers" {
  count = var.worker_node_count

  name         = "${local.cluster_name}-worker-${count.index + 1}"
  server_type  = var.worker_node_type
  image        = "ubuntu-22.04"
  location     = var.location
  ssh_keys     = [for key in data.hcloud_ssh_keys.all.ssh_keys : key.id]
  firewall_ids = [hcloud_firewall.cluster.id]

  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }

  network {
    network_id = hcloud_network.main.id
    ip         = "10.0.1.${20 + count.index}"
  }

  user_data = templatefile("${path.module}/cloud-init-worker.sh", {
    k3s_token       = random_password.k3s_token.result
    master_ip       = "10.0.1.10"
    node_ip         = "10.0.1.${20 + count.index}"
    cluster_name    = local.cluster_name
  })

  depends_on = [hcloud_server.control_plane]

  lifecycle {
    ignore_changes = [user_data, ssh_keys]
  }
}





resource "null_resource" "get_kubeconfig" {
  depends_on = [hcloud_server.control_plane]

  triggers = {
    control_plane_ip = hcloud_server.control_plane.ipv4_address
  }

  provisioner "local-exec" {
    command = <<-EOT
      sleep 120
      mkdir -p ${path.module}/.kube
      ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@${hcloud_server.control_plane.ipv4_address} \
        'cat /etc/rancher/k3s/k3s.yaml' | \
        sed 's/127.0.0.1/${hcloud_server.control_plane.ipv4_address}/g' > ${path.module}/.kube/config
    EOT
  }
}





output "master_ip" {
  value = hcloud_server.control_plane.ipv4_address
}

output "worker_ips" {
  value = hcloud_server.workers[*].ipv4_address
}

output "kubeconfig_path" {
  value = "${path.module}/.kube/config"
}

output "k3s_token" {
  value     = random_password.k3s_token.result
  sensitive = true
}

output "ssh_command_master" {
  value = "ssh root@${hcloud_server.control_plane.ipv4_address}"
}

output "access_info" {
  value = <<-EOT

  Cluster kuruldu! Erişim için:

  1. Kubeconfig ayarla:
     export KUBECONFIG=${path.module}/.kube/config

  2. Cluster kontrol et:
     kubectl get nodes

  3. Master IP: ${hcloud_server.control_plane.ipv4_address}
  4. Worker IPs: ${join(", ", hcloud_server.workers[*].ipv4_address)}

  5. NodePort servisler için herhangi bir worker IP kullanabilirsin:
     http:

  EOT
}
