# Development Setup

Bu dokümantasyon development ortamında projeyi nasıl çalıştıracağınızı açıklar.

## Gereksinimler

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL Client (opsiyonel - database connection test için)

## Development Ortamı Kurulumu

### 1. Infrastructure'ı Başlat

Sadece database'leri ve RabbitMQ'yu çalıştır:

```bash
# Development infrastructure'ı başlat
docker-compose -f docker-compose.dev.yml up -d

# Logları kontrol et
docker-compose -f docker-compose.dev.yml logs -f

# Status kontrol et
docker-compose -f docker-compose.dev.yml ps
```

### 2. Auth API'yi Manuel Başlat

```bash
cd auth-api

# Dependencies kur
npm install

# Environment dosyasını kopyala
cp .env.development .env

# Prisma client oluştur
npx prisma generate

# Database migration çalıştır
npx prisma migrate dev

# Development modda başlat
npm run start:dev

# Veya debug modda
npm run start:debug
```

Auth API şimdi **http://localhost:3000** adresinde çalışıyor.

### 3. Product API'yi Manuel Başlat

```bash
cd product-api

# Dependencies kur
npm install

# Environment dosyasını kopyala
cp .env.development .env

# Prisma client oluştur
npx prisma generate

# Database migration çalıştır
npx prisma migrate dev

# Development modda başlat
npm run start:dev
```

Product API şimdi **http://localhost:3001** adresinde çalışıyor.

### 4. Ecommerce Frontend'i Başlat (Opsiyonel)

```bash
cd ecommerce

# Dependencies kur
npm install

# Development modda başlat
npm run dev
```

Frontend şimdi **http://localhost:3002** adresinde çalışıyor.

## Servis URL'leri

- **Auth API**: http://localhost:3000
- **Product API**: http://localhost:3001  
- **Ecommerce App**: http://localhost:3002
- **RabbitMQ Management**: http://localhost:15672 (admin/password)

## Database Bağlantıları

### Auth Database
```
Host: localhost
Port: 5432
Username: auth_user
Password: auth_password
Database: auth_db
```

### Product Database
```
Host: localhost
Port: 5433
Username: product_user
Password: product_password  
Database: product_db
```

## API Test Etme

### 1. Kullanıcı Kaydı ve Login

```bash
# Kullanıcı kaydı
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com", 
    "password": "SecurePass123!"
  }'

# Hesap doğrulama (email'den gelen aktivasyon kodu)
curl -X POST http://localhost:3000/v1/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "activationCode": "123456"
  }'

# Login
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### 2. Protected Product API Kullanımı

```bash
# Login'den token al
TOKEN=$(curl -s -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "SecurePass123!"}' | \
  jq -r '.accessToken')

# Product oluştur
curl -X POST http://localhost:3001/v1/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test açıklaması", 
    "price": 99.99
  }'
```

## Development Commands

### Database İşlemleri

```bash
# Prisma Studio açmak için
cd auth-api && npx prisma studio
cd product-api && npx prisma studio

# Migration oluşturmak için
cd auth-api && npx prisma migrate dev --name "migration_name"
cd product-api && npx prisma migrate dev --name "migration_name"

# Database reset
cd auth-api && npx prisma migrate reset
cd product-api && npx prisma migrate reset
```

### RabbitMQ Management

- Management UI: http://localhost:15672
- Username: `admin`
- Password: `password`

Event'leri ve queue'ları buradan takip edebilirsiniz.

## Infrastructure Yönetimi

```bash
# Infrastructure'ı durdur
docker-compose -f docker-compose.dev.yml down

# Volume'lar ile birlikte temizle (dikkat: data silinir!)
docker-compose -f docker-compose.dev.yml down -v

# Sadece belirli servisi yeniden başlat
docker-compose -f docker-compose.dev.yml restart rabbitmq
docker-compose -f docker-compose.dev.yml restart auth-postgres

# Logları takip et
docker-compose -f docker-compose.dev.yml logs -f rabbitmq
docker-compose -f docker-compose.dev.yml logs -f auth-postgres
```

## Troubleshooting

### Port Çakışması
Eğer portlar kullanımdaysa `docker-compose.dev.yml` dosyasındaki port mapping'leri değiştirin.

### Database Bağlantı Problemi
```bash
# Database'lerin hazır olup olmadığını kontrol et
docker-compose -f docker-compose.dev.yml ps
docker-compose -f docker-compose.dev.yml logs auth-postgres
docker-compose -f docker-compose.dev.yml logs product-postgres
```

### RabbitMQ Bağlantı Problemi
```bash
# RabbitMQ durumunu kontrol et
docker-compose -f docker-compose.dev.yml logs rabbitmq
```

### Hot Reload Çalışmıyor
API'larda değişiklikler otomatik olarak yeniden yükleniyor (`npm run start:dev`). Eğer çalışmıyorsa servisi yeniden başlatın.

## VS Code Development

### Önerilen Extensionlar
- Prisma
- TypeScript Importer
- REST Client
- Docker

### Launch Configuration
VS Code debug için `.vscode/launch.json` dosyası oluşturabilirsiniz.

## Production Deployment

Development ortamından production'a geçmek için ana `docker-compose.yml` dosyasını kullanın:

```bash
docker-compose up --build
```
