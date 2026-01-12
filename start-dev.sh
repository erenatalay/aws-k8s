#!/bin/bash




set -e

echo "🚀 Development Environment - Kafka Setup"
echo "=========================================="
echo ""


RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'


if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"
echo ""


echo -e "${BLUE}📦 Starting infrastructure services...${NC}"
echo ""


echo "  → Starting Zookeeper..."
docker-compose -f docker-compose.dev.yml up -d zookeeper-dev

echo "  → Starting Kafka brokers..."
docker-compose -f docker-compose.dev.yml up -d kafka-1-dev kafka-2-dev

echo "  → Starting PostgreSQL databases..."
docker-compose -f docker-compose.dev.yml up -d auth-postgres product-postgres

echo ""
echo -e "${YELLOW}⏳ Waiting for services to be ready (30 seconds)...${NC}"
sleep 30


echo ""
echo -e "${BLUE}🔍 Checking service health...${NC}"


if docker exec kafka-1-dev kafka-broker-api-versions --bootstrap-server localhost:9092 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Kafka Broker 1 is healthy${NC}"
else
    echo -e "${RED}❌ Kafka Broker 1 is not responding${NC}"
fi

if docker exec kafka-2-dev kafka-broker-api-versions --bootstrap-server localhost:9093 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Kafka Broker 2 is healthy${NC}"
else
    echo -e "${RED}❌ Kafka Broker 2 is not responding${NC}"
fi


if docker exec auth-postgres-dev pg_isready -U auth_user > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Auth PostgreSQL is healthy${NC}"
else
    echo -e "${RED}❌ Auth PostgreSQL is not responding${NC}"
fi

if docker exec product-postgres-dev pg_isready -U product_user > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Product PostgreSQL is healthy${NC}"
else
    echo -e "${RED}❌ Product PostgreSQL is not responding${NC}"
fi


echo ""
echo -e "${BLUE}📝 Creating development topics...${NC}"


docker exec kafka-1-dev kafka-topics --create --if-not-exists \
    --topic user.register \
    --partitions 5 \
    --replication-factor 2 \
    --bootstrap-server localhost:9092 2>/dev/null || true

docker exec kafka-1-dev kafka-topics --create --if-not-exists \
    --topic user.login \
    --partitions 5 \
    --replication-factor 2 \
    --bootstrap-server localhost:9092 2>/dev/null || true

docker exec kafka-1-dev kafka-topics --create --if-not-exists \
    --topic user.password.reset \
    --partitions 5 \
    --replication-factor 2 \
    --bootstrap-server localhost:9092 2>/dev/null || true

docker exec kafka-1-dev kafka-topics --create --if-not-exists \
    --topic user.verify.email \
    --partitions 5 \
    --replication-factor 2 \
    --bootstrap-server localhost:9092 2>/dev/null || true


docker exec kafka-1-dev kafka-topics --create --if-not-exists \
    --topic product.created \
    --partitions 10 \
    --replication-factor 2 \
    --bootstrap-server localhost:9092 2>/dev/null || true

docker exec kafka-1-dev kafka-topics --create --if-not-exists \
    --topic product.updated \
    --partitions 10 \
    --replication-factor 2 \
    --bootstrap-server localhost:9092 2>/dev/null || true

docker exec kafka-1-dev kafka-topics --create --if-not-exists \
    --topic inventory.updated \
    --partitions 10 \
    --replication-factor 2 \
    --bootstrap-server localhost:9092 2>/dev/null || true

docker exec kafka-1-dev kafka-topics --create --if-not-exists \
    --topic product.price.updated \
    --partitions 10 \
    --replication-factor 2 \
    --bootstrap-server localhost:9092 2>/dev/null || true

echo -e "${GREEN}✅ Topics created${NC}"


echo ""
echo -e "${BLUE}🖥️  Starting Kafka UI...${NC}"
docker-compose -f docker-compose.dev.yml up -d kafka-ui-dev

echo ""
echo -e "${GREEN}✅ Development environment is ready!${NC}"
echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "📊 Service URLs:"
echo ""
echo "  🔹 Kafka Broker 1:         localhost:19092"
echo "  🔹 Kafka Broker 2:         localhost:19093"
echo "  🔹 Kafka UI Dashboard:     http://localhost:8080"
echo "  🔹 Zookeeper:              localhost:2181"
echo "  🔹 Auth PostgreSQL:        localhost:5432"
echo "  🔹 Product PostgreSQL:     localhost:5433"
echo ""
echo "📝 Next Steps:"
echo ""
echo "  1️⃣  Create .env files:"
echo ""
echo "     auth-api/.env:"
echo "     ----------------"
echo "     NODE_ENV=development"
echo "     PORT=3000"
echo "     DATABASE_URL=postgresql://auth_user:auth_password@localhost:5432/auth_db?schema=public"
echo "     KAFKA_BROKERS=localhost:19092,localhost:19093"
echo "     JWT_SECRET=dev-secret-key"
echo "     JWT_EXPIRES_IN=1h"
echo ""
echo "     product-api/.env:"
echo "     ------------------"
echo "     NODE_ENV=development"
echo "     PORT=3001"
echo "     DATABASE_URL=postgresql://product_user:product_password@localhost:5433/product_db?schema=public"
echo "     KAFKA_BROKERS=localhost:19092,localhost:19093"
echo "     AUTH_SERVICE_URL=http://localhost:3000"
echo ""
echo "  2️⃣  Setup Auth API:"
echo "     cd auth-api"
echo "     yarn install"
echo "     yarn prisma:generate"
echo "     yarn prisma:migrate"
echo "     yarn start:dev"
echo ""
echo "  3️⃣  Setup Product API (new terminal):"
echo "     cd product-api"
echo "     yarn install"
echo "     yarn prisma:generate"
echo "     yarn prisma:migrate"
echo "     yarn start:dev"
echo ""
echo "  4️⃣  Monitor Kafka:"
echo "     open http://localhost:8080"
echo ""
echo "  5️⃣  Run load test (optional):"
echo "     node load-test.js 10000 100"
echo ""
echo "🛠️  Useful Commands:"
echo ""
echo "  • View logs:           docker-compose -f docker-compose.dev.yml logs -f"
echo "  • Stop services:       docker-compose -f docker-compose.dev.yml down"
echo "  • Clean volumes:       docker-compose -f docker-compose.dev.yml down -v"
echo "  • List topics:         docker exec kafka-1-dev kafka-topics --list --bootstrap-server localhost:9092"
echo "  • Monitor cluster:     node monitor-kafka.js"
echo ""
echo -e "${YELLOW}⚡ Development environment ready for high-performance testing!${NC}"
echo ""
