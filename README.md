# Microservices Architecture

Bu proje mikroservis mimarisi ile geliştirilmiş e-ticaret sistemidir:
- **Auth API** (NestJS + PostgreSQL + JWT/JWKS)
- **Product API** (NestJS + PostgreSQL + JWKS Verification) 
- **Ecommerce App** (Next.js Frontend)
- **RabbitMQ** (Asenkron mesajlaşma)

## Quick Start

**Development:** [README-DEV.md](./README-DEV.md) dosyasını okuyun.

**Production:** Bu dokümantasyonu takip edin.

## Servisler

### Auth API
- Port: 3000
- Database: PostgreSQL (Port: 5432)
- Framework: NestJS

### Product API
- Port: 3001
- Database: PostgreSQL (Port: 5433)
- Framework: NestJS

### Ecommerce App
- Port: 3002
- Framework: Next.js

### RabbitMQ
- AMQP Port: 5672
- Management UI Port: 15672
- Username: admin
- Password: password

## Production Deployment

### Tüm servisleri başlatmak için:
```bash
docker-compose up --build -d
```

### Servisleri durdurmak için:
```bash
docker-compose down
```

### Logları görüntülemek için:
```bash
docker-compose logs -f [service-name]
```

## Development Setup

**Development ortamında çalışmak için [README-DEV.md](./README-DEV.md) dosyasını okuyun.**

Development'da sadece infrastructure (PostgreSQL + RabbitMQ) Docker ile çalışır, API'ları manuel başlatırsınız.

## Erişim URL'leri

- **Auth API**: http://localhost:3000
- **Product API**: http://localhost:3001
- **Ecommerce App**: http://localhost:3002
- **RabbitMQ Management UI**: http://localhost:15672 (admin/password)

## Database Bağlantıları

### Auth Database
- Host: localhost
- Port: 5432
- Username: auth_user
- Password: auth_password
- Database: auth_db

### Product Database
- Host: localhost
- Port: 5433
- Username: product_user
- Password: product_password
- Database: product_db

## RabbitMQ Bağlantısı

- **Host**: localhost
- **Port**: 5672
- **Username**: admin
- **Password**: password
- **Virtual Host**: /
- **Management UI**: http://localhost:15672
- **Connection URL**: amqp://admin:password@localhost:5672/

## Geliştirme

Kod değişiklikleri yaptığınızda servisleri yeniden build etmek için:

```bash
docker-compose up --build <service-name>
```

## Log'ları görüntülemek için:

```bash
docker-compose logs -f <service-name>
```

## Troubleshooting

1. **Port çakışması**: Eğer portlar kullanımda ise, docker-compose.yml dosyasındaki port mappinglerini değiştirin.

2. **Database bağlantı problemi**: Servisler başlatılırken healthcheck'ler database'lerin hazır olduğunu kontrol eder.

3. **Build hataları**: Node.js versiyonu uyumsuzluğu durumunda Dockerfile'lardaki base image'ları güncelleyin.

## JWKS ve JWT Token Kullanımı

### JWKS Endpoint
Auth API'de JWKS endpoint'i: `http://localhost:3000/.well-known/jwks.json`

### Kullanıcı Kaydı ve Giriş
```bash
# 1. Kullanıcı kaydı
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe", 
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# 2. Hesap doğrulama (email'den gelen kod ile)
curl -X POST http://localhost:3000/v1/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "activationCode": "123456"
  }'

# 3. Login yaparak JWT token al
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Test için Token Alma (Doğrudan)
```bash
curl -X POST http://localhost:3000/v1/auth/create-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "email": "test@example.com", 
    "role": "user"
  }'
```

### Protected Product Oluşturma
```bash
# Login yaparak token al
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "SecurePass123!"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

# Product oluştur (JWT ile korumalı)
curl -X POST http://localhost:3001/v1/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test açıklaması",
    "price": 99.99
  }'
```

## RabbitMQ Event Örnekleri

### Auth Service Events
- `user.registered` - Kullanıcı kayıt eventi
- `user.login` - Kullanıcı giriş eventi
- `user.password-reset` - Şifre sıfırlama eventi

### Product Service Events
- `product.created` - Ürün oluşturma eventi
- `product.updated` - Ürün güncelleme eventi
- `inventory.updated` - Stok güncelleme eventi
- `order.placed` - Sipariş verme eventi

### Message Patterns (RPC)
- `auth.verify-token` - Token doğrulama
- `product.get-details` - Ürün detayları

## Güvenlik Notları

- Production ortamında environment variable'ları .env dosyalarından yönetin
- Database şifrelerini güçlü yapın
- JWT_SECRET'ı production'da güçlü bir değer yapın
- Hassas bilgileri version control'e eklemeyin
