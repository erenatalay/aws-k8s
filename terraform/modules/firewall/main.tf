




locals {

  ssh_source_ips = length(var.allowed_ssh_ips) > 0 ? var.allowed_ssh_ips : ["0.0.0.0/0", "::/0"]
}





resource "hcloud_firewall" "control_plane" {
  count = var.enable_firewall ? 1 : 0

  name   = "${var.cluster_name}-control-plane-fw"
  labels = var.labels


  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = local.ssh_source_ips
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
    protocol   = "tcp"
    port       = "10259"
    source_ips = ["10.0.0.0/8"]
  }


  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "10257"
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
    protocol   = "tcp"
    port       = "30000-32767"
    source_ips = ["0.0.0.0/0", "::/0"]
  }


  rule {
    direction  = "in"
    protocol   = "icmp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }


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





resource "hcloud_firewall" "workers" {
  count = var.enable_firewall ? 1 : 0

  name   = "${var.cluster_name}-workers-fw"
  labels = var.labels


  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = local.ssh_source_ips
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
    protocol   = "tcp"
    port       = "30000-32767"
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
    protocol   = "icmp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }


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





resource "hcloud_firewall" "load_balancer" {
  count = var.enable_firewall ? 1 : 0

  name   = "${var.cluster_name}-lb-fw"
  labels = var.labels


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
    protocol   = "icmp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }


  rule {
    direction       = "out"
    protocol        = "tcp"
    port            = "1-65535"
    destination_ips = ["0.0.0.0/0", "::/0"]
  }
}
