# GitHub Secrets Yapılandırması

Bu dokümantasyon, GitHub Actions workflow'unun çalışması için gerekli GitHub Secrets'ların nasıl yapılandırılacağını açıklar.

## Gerekli GitHub Secrets

GitHub repository'nizde Settings > Secrets and variables > Actions bölümüne gidip aşağıdaki secrets'ları ekleyin:

### Docker Registry Secrets

```
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

**Nasıl Oluşturulur:**
1. Docker Hub'a giriş yapın
2. Account Settings > Security > New Access Token
3. Token oluşturun ve kopyalayın
4. GitHub Secrets'a ekleyin

### Kubernetes Secrets

```
KUBECONFIG
```

**Nasıl Oluşturulur:**
```bash
cat ~/.kube/config | base64
```

Base64 encoded kubeconfig'i GitHub Secrets'a ekleyin.

### Application Secrets

```
JWT_SECRET
JWT_EXPIRES_IN
JWT_ISSUER
JWT_AUDIENCE
AUTH_SERVICE_URL
AUTH_GRAPHQL_URL
PRODUCT_GRAPHQL_URL
GRAPHQL_POLL_INTERVAL
NEXT_PUBLIC_AUTH_API_URL
NEXT_PUBLIC_PRODUCT_API_URL
```

**Nasıl Oluşturulur:**
```bash
openssl rand -base64 32
```

**Örnek Değerler:**
```
JWT_SECRET=<random-32-char-string>
JWT_EXPIRES_IN=1h
JWT_ISSUER=auth-service
JWT_AUDIENCE=api-services
AUTH_SERVICE_URL=http://auth-api:3000
AUTH_GRAPHQL_URL=http://auth-api:3000/api/graphql
PRODUCT_GRAPHQL_URL=http://product-api:3001/api/graphql
GRAPHQL_POLL_INTERVAL=10000
NEXT_PUBLIC_AUTH_API_URL=https://api.yourdomain.com/auth
NEXT_PUBLIC_PRODUCT_API_URL=https://api.yourdomain.com/product
```

### Image Repository Secrets

```
AUTH_API_IMAGE_REPOSITORY
PRODUCT_API_IMAGE_REPOSITORY
GATEWAY_IMAGE_REPOSITORY
ECOMMERCE_IMAGE_REPOSITORY
```

**Örnek Değerler:**
```
AUTH_API_IMAGE_REPOSITORY=auth-api
PRODUCT_API_IMAGE_REPOSITORY=product-api
GATEWAY_IMAGE_REPOSITORY=gateway
ECOMMERCE_IMAGE_REPOSITORY=ecommerce
```

### PostgreSQL Secrets

```
POSTGRES_AUTH_POSTGRES_PASSWORD
POSTGRES_AUTH_DATABASE
POSTGRES_AUTH_USERNAME
POSTGRES_AUTH_PASSWORD
POSTGRES_PRODUCT_POSTGRES_PASSWORD
POSTGRES_PRODUCT_DATABASE
POSTGRES_PRODUCT_USERNAME
POSTGRES_PRODUCT_PASSWORD
```

**Nasıl Oluşturulur:**
Her biri için güçlü password'ler oluşturun:
```bash
openssl rand -base64 16
```

**Örnek Değerler:**
```
POSTGRES_AUTH_DATABASE=auth_db
POSTGRES_AUTH_USERNAME=auth_user
POSTGRES_PRODUCT_DATABASE=product_db
POSTGRES_PRODUCT_USERNAME=product_user
```

### Ingress Secrets

```
INGRESS_CLASS_NAME
CERT_MANAGER_CLUSTER_ISSUER
API_DOMAIN
APP_DOMAIN
STORAGE_CLASS
```

**Örnek Değerler:**
```
INGRESS_CLASS_NAME=traefik
CERT_MANAGER_CLUSTER_ISSUER=letsencrypt-prod
API_DOMAIN=api.yourdomain.com
APP_DOMAIN=app.yourdomain.com
STORAGE_CLASS=local-path
```

## Secrets Ekleme Adımları

1. GitHub repository'nize gidin
2. Settings > Secrets and variables > Actions
3. "New repository secret" butonuna tıklayın
4. Name ve Value'yu girin
5. "Add secret" butonuna tıklayın

## Güvenlik Best Practices

1. **Secrets'ları asla commit etmeyin** - .gitignore'a ekleyin
2. **Düzenli olarak rotate edin** - Özellikle JWT_SECRET ve database password'leri
3. **Minimum privilege** - Sadece gerekli secrets'ları ekleyin
4. **Environment-specific secrets** - Production ve staging için ayrı secrets kullanın

## Test Etme

Secrets'ları ekledikten sonra workflow'u test edin:

```bash
git push origin main
```

GitHub Actions sekmesinde workflow'un çalıştığını görebilirsiniz.

## Troubleshooting

### Secret Bulunamadı Hatası

Eğer workflow'da "secret not found" hatası alırsanız:
1. Secret'ın adının doğru olduğundan emin olun (case-sensitive)
2. Secret'ın repository secrets'ında olduğundan emin olun (organization secrets değil)

### Base64 Encoding Hatası

KUBECONFIG için base64 encoding yaparken:
```bash
cat ~/.kube/config | base64 -w 0  # Linux
cat ~/.kube/config | base64      # macOS
```

### Secret Değeri Kontrolü

Secret değerlerini göremezsiniz ama varlığını kontrol edebilirsiniz:
- Settings > Secrets and variables > Actions
- Secret listesinde görünüyor mu kontrol edin

