#!/bin/bash
# k3s Master Node Kurulumu

set -e

# Sistem güncellemesi
apt-get update
apt-get upgrade -y
apt-get install -y curl wget

# Swap'ı kapat
swapoff -a
sed -i '/swap/d' /etc/fstab

# Private network interface'i bekle
echo "Waiting for private network interface..."
for i in {1..30}; do
  if ip addr show | grep -q "10.0.1"; then
    echo "Private network is ready"
    break
  fi
  sleep 2
done

# k3s kurulumu
export K3S_TOKEN="${k3s_token}"

# Private network interface'ini otomatik tespit et
PRIVATE_IFACE=$(ip -o addr show | grep "10.0.1.10" | awk '{print $2}')
echo "Using network interface: $PRIVATE_IFACE"

curl -sfL https://get.k3s.io | sh -s - server \
  --node-name="master" \
  --node-ip="${node_ip}" \
  --advertise-address="${node_ip}" \
  --tls-san="${node_ip}" \
  --flannel-iface=$PRIVATE_IFACE \
  --disable=traefik \
  --write-kubeconfig-mode=644

echo "k3s master kuruldu"
