




locals {
  k3s_install_url = "https://get.k3s.io"


  control_plane_labels = merge(var.labels, {
    role = "control-plane"
  })

  worker_labels = merge(var.labels, {
    role = "worker"
  })
}





resource "random_password" "k3s_token" {
  length  = 64
  special = false
}





resource "hcloud_placement_group" "control_plane" {
  name   = "${var.cluster_name}-control-plane-pg"
  type   = "spread"
  labels = local.control_plane_labels
}

resource "hcloud_placement_group" "workers" {
  name   = "${var.cluster_name}-workers-pg"
  type   = "spread"
  labels = local.worker_labels
}





resource "hcloud_server" "control_plane" {
  count = var.control_plane_count

  name         = "${var.cluster_name}-control-${count.index + 1}"
  server_type  = var.control_plane_type
  image        = "ubuntu-22.04"
  location     = var.location
  ssh_keys     = var.ssh_key_ids
  firewall_ids = var.firewall_ids

  placement_group_id = hcloud_placement_group.control_plane.id

  labels = merge(local.control_plane_labels, {
    node_index = tostring(count.index + 1)
  })

  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }

  network {
    network_id = var.network_id
    ip         = cidrhost("10.0.1.0/24", 10 + count.index)
  }

  user_data = templatefile("${path.module}/templates/control-plane-init.sh.tftpl", {
    k3s_token       = random_password.k3s_token.result
    is_first_node   = count.index == 0
    first_node_ip   = "10.0.1.10"
    node_ip         = cidrhost("10.0.1.0/24", 10 + count.index)
    cluster_name    = var.cluster_name
    k3s_version     = var.k8s_version
    node_name       = "${var.cluster_name}-control-${count.index + 1}"
  })

  lifecycle {
    ignore_changes = [user_data, ssh_keys]
  }
}





resource "hcloud_server" "workers" {
  count = var.worker_node_count

  name         = "${var.cluster_name}-worker-${count.index + 1}"
  server_type  = var.worker_node_type
  image        = "ubuntu-22.04"
  location     = var.location
  ssh_keys     = var.ssh_key_ids
  firewall_ids = var.firewall_ids

  placement_group_id = hcloud_placement_group.workers.id

  labels = merge(local.worker_labels, {
    node_index = tostring(count.index + 1)
  })

  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }

  network {
    network_id = var.network_id
    ip         = cidrhost("10.0.1.0/24", 50 + count.index)
  }

  user_data = templatefile("${path.module}/templates/worker-init.sh.tftpl", {
    k3s_token       = random_password.k3s_token.result
    control_plane_ip = "10.0.1.10"
    node_ip         = cidrhost("10.0.1.0/24", 50 + count.index)
    cluster_name    = var.cluster_name
    k3s_version     = var.k8s_version
    node_name       = "${var.cluster_name}-worker-${count.index + 1}"
  })

  depends_on = [hcloud_server.control_plane]

  lifecycle {
    ignore_changes = [user_data, ssh_keys]
  }
}





resource "hcloud_placement_group" "node_pools" {
  for_each = { for pool in var.worker_node_pools : pool.name => pool }

  name   = "${var.cluster_name}-${each.key}-pg"
  type   = "spread"
  labels = merge(var.labels, { pool = each.key })
}

resource "hcloud_server" "node_pool_workers" {
  for_each = {
    for item in flatten([
      for pool in var.worker_node_pools : [
        for i in range(pool.count) : {
          pool_name   = pool.name
          index       = i
          server_type = pool.server_type
          labels      = pool.labels
          taints      = pool.taints
        }
      ]
    ]) : "${item.pool_name}-${item.index}" => item
  }

  name         = "${var.cluster_name}-${each.value.pool_name}-${each.value.index + 1}"
  server_type  = each.value.server_type
  image        = "ubuntu-22.04"
  location     = var.location
  ssh_keys     = var.ssh_key_ids
  firewall_ids = var.firewall_ids

  placement_group_id = hcloud_placement_group.node_pools[each.value.pool_name].id

  labels = merge(var.labels, each.value.labels, {
    pool       = each.value.pool_name
    node_index = tostring(each.value.index + 1)
  })

  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }

  network {
    network_id = var.network_id
  }

  user_data = templatefile("${path.module}/templates/worker-init.sh.tftpl", {
    k3s_token        = random_password.k3s_token.result
    control_plane_ip = "10.0.1.10"
    node_ip          = ""
    cluster_name     = var.cluster_name
    k3s_version      = var.k8s_version
    node_name        = "${var.cluster_name}-${each.value.pool_name}-${each.value.index + 1}"
    node_labels      = join(",", [for k, v in each.value.labels : "${k}=${v}"])
    node_taints      = join(",", [for t in each.value.taints : "${t.key}=${t.value}:${t.effect}"])
  })

  depends_on = [hcloud_server.control_plane]

  lifecycle {
    ignore_changes = [user_data, ssh_keys]
  }
}





resource "null_resource" "wait_for_cluster" {
  depends_on = [hcloud_server.control_plane, hcloud_server.workers]

  provisioner "local-exec" {
    command = <<-EOT
      echo "Waiting for k3s cluster to be ready..."
      sleep 120
    EOT
  }
}





resource "null_resource" "get_kubeconfig" {
  depends_on = [null_resource.wait_for_cluster]

  triggers = {
    control_plane_ip = hcloud_server.control_plane[0].ipv4_address
  }

  provisioner "local-exec" {
    command = <<-EOT
      mkdir -p ${path.root}/.kube
      ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@${hcloud_server.control_plane[0].ipv4_address} \
        'cat /etc/rancher/k3s/k3s.yaml' | \
        sed 's/127.0.0.1/${hcloud_server.control_plane[0].ipv4_address}/g' > ${path.root}/.kube/config
    EOT
  }
}





data "local_file" "kubeconfig" {
  depends_on = [null_resource.get_kubeconfig]
  filename   = "${path.root}/.kube/config"
}
