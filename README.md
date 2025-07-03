# Auction API

A RESTful API for managing auction items with PostgreSQL, Prisma ORM, Redis caching, and Kubernetes deployment.

# Why I Chose This Stack

I built the API with Node.js, Express, and TypeScript because it’s fast, flexible, and easy to work with. Using TypeScript helps catch errors early and keeps the code clean and maintainable.

For the database, I picked PostgreSQL because it supports full-text search out of the box, which makes searching through auction items quick and accurate. in the future, PostgreSQL will help me keep all bidding transactions safe and consistent by using its built-in support for ACID properties — meaning each bid is processed completely and correctly, without any data loss or corruption, even if multiple users bid at the same time.

To speed things up, I use Redis as a cache. It stores frequently requested data like lists of items and search results in memory, so the API can respond faster without hitting the database every time.

I chose Prisma as the ORM because it makes working with the database much easier and safer. It provides type safety with TypeScript, so I catch mistakes early, and its clear API helps me write and maintain database queries quickly without worrying about SQL syntax errors. Plus, Prisma handles migrations smoothly, which helps keep the database schema in sync with the code.

---

## Project Initialization

Initialize the project with docker compose:

`docker compose up --build`

you can also turn it off and delete all data using 

`docker compose down -v`

---

# How to test

To Quickly test the api, please run this in a unix system or wsl.
This will run a bash script that will Curl all the possible api requests

```
chmod +x test-auction-api.sh
./test-auction-api.sh
```

---

## Install Dependencies

### Runtime Dependencies

These are required for running the application:

npm install express dotenv zod cors csv-parse @prisma/client ioredis

| Package          | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `express`        | HTTP server                              |
| `dotenv`         | Load environment variables               |
| `zod`            | Input validation                         |
| `cors`           | Enable Cross-Origin Resource Sharing     |
| `csv-parse`      | CSV file parsing                         |
| `@prisma/client` | Prisma ORM runtime client                |
| `ioredis`        | Redis client for caching                 |

## ⚙️ Setup TypeScript & Prisma

- The initial docker build autimatically handles the schema migrate and postgres full text search indexing

- Import CSV data and build full-text search index:
    `docker-compose exec auction-api-api-1 npm run import`


- Verify full-text index exists in PostgreSQL:
    `docker exec -it auction-api-postgres-1 psql -U postgres -d auctiondb`
```
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'AuctionItem' AND indexname = 'auction_item_fulltext_idx';
```

---

## API Endpoints

| Action     | Endpoint            | Description                                      | `x-api-key` |
| ---------- | ------------------- | ------------------------------------------------ | ----------- |
| Create     | `POST /items`       | Create a new auction item                        | Yes         |
| Read All   | `GET /items`        | Paginated list of items (`?page=1&limit=10`)     | No          |
| Read One   | `GET /items/:id`    | Get single item by ID                            | No          |
| Search     | `GET /search?q=...` | Full-text search on title, description, category | No          |
| Update     | `PUT /items/:id`    | Update auction item by ID                        | Yes         |
| Delete     | `DELETE /items/:id` | Delete auction item by ID                        | Yes         |

---

## Kubernetes Deployment

1. Start Minikube (for local testing):

minikube start

2. Apply Kubernetes manifests:

kubectl apply -f ./k8s/

3. Access the API service in the browser (Minikube):

minikube service auction-api-service

---

## Docker Image Build & Push

Build and push the Docker image to Docker Hub:

docker build -t nightoneee/auction-api:latest .
docker push nightoneee/auction-api:latest

Verify the image on Docker Hub:

docker search nightoneee/auction-api

View on Docker Hub:  
https://hub.docker.com/repository/docker/nightoneee/auction-api/general

---
