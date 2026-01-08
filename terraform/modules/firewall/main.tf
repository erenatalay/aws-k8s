# ============================================================================
# FIREWALL MODULE - MAIN
# Hetzner Cloud Firewall Rules
# ============================================================================

locals {
  # SSH allowed IPs - default to all if empty
  ssh_source_ips = length(var.allowed_ssh_ips) > 0 ? var.allowed_ssh_ips : ["0.0.0.0/0", "::/0"]
}

# ============================================================================
# CONTROL PLANE FIREWALL
# ============================================================================

resource "hcloud_firewall" "control_plane" {
  count = var.enable_firewall ? 1 : 0

  name   = "${var.cluster_name}-control-plane-fw"
  labels = var.labels

  # SSH Access
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = local.ssh_source_ips
  }

  # Kubernetes API Server
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "6443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # etcd client requests
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "2379-2380"
    source_ips = ["10.0.0.0/8"]
  }

  # Kubelet API
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "10250"
    source_ips = ["10.0.0.0/8"]
  }

  # kube-scheduler
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "10259"
    source_ips = ["10.0.0.0/8"]
  }

  # kube-controller-manager
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "10257"
    source_ips = ["10.0.0.0/8"]
  }

  # Flannel VXLAN
  rule {
    direction  = "in"
    protocol   = "udp"
    port       = "8472"
    source_ips = ["10.0.0.0/8"]
  }

  # NodePort Services
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "30000-32767"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # ICMP (ping)
  rule {
    direction  = "in"
    protocol   = "icmp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # Outbound - All traffic
  rule {
    direction       = "out"
    protocol        = "tcp"
    port            = "1-65535"
    destination_ips = ["0.0.0.0/0", "::/0"]
  }

  rule {
    direction       = "out"
    protocol        = "udp"
    port            = "1-65535"
    destination_ips = ["0.0.0.0/0", "::/0"]
  }

  rule {
    direction       = "out"
    protocol        = "icmp"
    destination_ips = ["0.0.0.0/0", "::/0"]
  }
}

# ============================================================================
# WORKER NODE FIREWALL
# ============================================================================

resource "hcloud_firewall" "workers" {
  count = var.enable_firewall ? 1 : 0

  name   = "${var.cluster_name}-workers-fw"
  labels = var.labels

  # SSH Access
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = local.ssh_source_ips
  }

  # Kubelet API
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "10250"
    source_ips = ["10.0.0.0/8"]
  }

  # Flannel VXLAN
  rule {
    direction  = "in"
    protocol   = "udp"
    port       = "8472"
    source_ips = ["10.0.0.0/8"]
  }

  # NodePort Services
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "30000-32767"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # HTTP
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # ICMP
  rule {
    direction  = "in"
    protocol   = "icmp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # Outbound - All traffic
  rule {
    direction       = "out"
    protocol        = "tcp"
    port            = "1-65535"
    destination_ips = ["0.0.0.0/0", "::/0"]
  }

  rule {
    direction       = "out"
    protocol        = "udp"
    port            = "1-65535"
    destination_ips = ["0.0.0.0/0", "::/0"]
  }

  rule {
    direction       = "out"
    protocol        = "icmp"
    destination_ips = ["0.0.0.0/0", "::/0"]
  }
}

# ============================================================================
# LOAD BALANCER FIREWALL
# ============================================================================

resource "hcloud_firewall" "load_balancer" {
  count = var.enable_firewall ? 1 : 0

  name   = "${var.cluster_name}-lb-fw"
  labels = var.labels

  # HTTP
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # ICMP
  rule {
    direction  = "in"
    protocol   = "icmp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # Outbound
  rule {
    direction       = "out"
    protocol        = "tcp"
    port            = "1-65535"
    destination_ips = ["0.0.0.0/0", "::/0"]
  }
}
