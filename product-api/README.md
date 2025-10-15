<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Afterlive Auth Service

## Overview

Afterlive Auth is a robust authentication and authorization service built with NestJS and Prisma. It provides secure user management, authentication flows, and role-based access control for the Afterlive ecosystem.

## Features

- User authentication with JWT
- Role-based access control
- User management
- Secure password handling
- Email verification
- OAuth integrations
- API rate limiting

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Yarn](https://yarnpkg.com/getting-started/install) (optional, only needed for local development)

## Quick Start with Docker Compose

The easiest way to run the project is using Docker Compose, which will set up all required services automatically:

```bash

# Start all services (PostgreSQL database, Prisma, and the API)
docker-compose up
```

This will:
1. Set up a PostgreSQL database
2. Run Prisma migrations
3. Start the API service on port 3000

You can access the API at http://localhost:3000 and Swagger documentation at http://localhost:3000/api/docs

## Environment Variables

The application uses environment variables for configuration. Copy the example file to create your own:

```bash
cp .env.example .env
```

## Prisma Commands

If you need to interact with Prisma directly:

```bash
# Generate Prisma client (already done in Docker setup)
yarn prisma generate


## Manual Development Setup

If you prefer to run the services locally without Docker:

```bash
# Install dependencies
yarn install

# Apply migrations
npx prisma db push

# Start the development server
yarn start:dev
```

## API Documentation

Swagger documentation is available at `/api/docs` when the server is running.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is [MIT licensed](LICENSE).

