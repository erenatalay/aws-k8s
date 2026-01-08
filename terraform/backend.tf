terraform {
  cloud {
    organization = "erenatalay"  # Kendi organization adını yaz

    workspaces {
      name = "aws-k8s-helm"  # Workspace adın
    }
  }
}
