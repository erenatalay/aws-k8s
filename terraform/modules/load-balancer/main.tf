# ============================================================================
# LOAD BALANCER MODULE - MAIN
# Hetzner Cloud Load Balancer
# ============================================================================

# ============================================================================
# PRIMARY LOAD BALANCER
# ============================================================================

resource "hcloud_load_balancer" "main" {
  name               = "${var.cluster_name}-lb"
  load_balancer_type = var.load_balancer_type
  location           = var.location
  labels             = var.labels

  algorithm {
    type = var.load_balancer_algorithm
  }
}

# ============================================================================
# LOAD BALANCER NETWORK ATTACHMENT
# ============================================================================

resource "hcloud_load_balancer_network" "main" {
  load_balancer_id = hcloud_load_balancer.main.id
  network_id       = var.network_id
  ip               = "10.0.1.250"
}

# ============================================================================
# LOAD BALANCER TARGETS
# ============================================================================

resource "hcloud_load_balancer_target" "workers" {
  count            = length(var.target_server_ids)
  type             = "server"
  load_balancer_id = hcloud_load_balancer.main.id
  server_id        = var.target_server_ids[count.index]
  use_private_ip   = true

  depends_on = [hcloud_load_balancer_network.main]
}

# ============================================================================
# LOAD BALANCER SERVICES
# ============================================================================

# HTTP Service
resource "hcloud_load_balancer_service" "http" {
  load_balancer_id = hcloud_load_balancer.main.id
  protocol         = "http"
  listen_port      = 80
  destination_port = 80

  http {
    sticky_sessions = true
    cookie_name     = "SERVERID"
    cookie_lifetime = 300
  }

  health_check {
    protocol = "http"
    port     = 80
    interval = 15
    timeout  = 10
    retries  = 3
    http {
      path         = "/health"
      status_codes = ["200", "2??", "3??"]
    }
  }
}

# HTTPS Service
resource "hcloud_load_balancer_service" "https" {
  load_balancer_id = hcloud_load_balancer.main.id
  protocol         = "tcp"
  listen_port      = 443
  destination_port = 443

  health_check {
    protocol = "tcp"
    port     = 443
    interval = 15
    timeout  = 10
    retries  = 3
  }
}

# Kubernetes API (Optional - for external kubectl access)
resource "hcloud_load_balancer_service" "kubernetes_api" {
  load_balancer_id = hcloud_load_balancer.main.id
  protocol         = "tcp"
  listen_port      = 6443
  destination_port = 6443

  health_check {
    protocol = "tcp"
    port     = 6443
    interval = 15
    timeout  = 10
    retries  = 3
  }
}
