# EverFit API

## Table of Contents

- [EverFit API](#everfit-api)
  - [Table of Contents](#table-of-contents)
- [Local Development](#local-development)
  - [System Requirements](#system-requirements)
  - [Using Docker](#using-docker)
  - [Using Node.js](#using-nodejs)

# Local Development

## System Requirements

- [NodeJS](https://nodejs.org/en/download/) version 16.18.0
- [Docker](https://docs.docker.com/get-docker/)

Required environment variables

/src/.env:
```
PORT="3000"
NODE_ENV="dev"
```
/src/db/.env:
```
DB_USERNAME="my_db_username"
DB_PASSWORD="my_db_password"
DB_URI="my_db_uri"
```

## Using Docker

Build Docker image:
```bash
docker build -t everfit-api .
```
Run the image or specify a desired port like so: `-p {port}:3000`
```bash
docker run -it -p 3000:3000 everfit-api
```
Go to http://localhost:3000

## Using Node.js

Install dependencies
```bash
npm ci
```

Start API

```bash
npm run dev
```
Go to http://localhost:3000