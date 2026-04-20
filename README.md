# CRUD Spring Boot React MySQL Docker

A full-stack CRUD application built with React, Spring Boot, Spring Security, JWT authentication, MySQL, and Docker.

The project contains a React frontend, a Spring Boot REST backend, and a MySQL database. You can run it in two ways:

- Using Docker Compose
- Running the frontend and backend manually on your machine

## Tech Stack

- React 18
- Redux Toolkit
- Bootstrap
- Spring Boot 3
- Spring Security
- JWT
- Spring Data JPA
- MySQL 8
- Docker and Docker Compose

## Project Structure

```text
.
|-- backend/
|   `-- crud-application/
|       |-- src/
|       |-- Dockerfile
|       |-- docker-compose.yml
|       `-- pom.xml
`-- frontend/
    `-- crudfront/
        |-- src/
        |-- public/
        |-- Dockerfile
        |-- nginx.conf
        `-- package.json
```

## Prerequisites

Install these tools before running the project:

- Java 17
- Node.js 18 or later
- npm
- Docker Desktop
- MySQL 8, only required for the manual local setup

## Flow 1: Run With Docker Compose

Use this flow if you want Docker to run the backend, frontend, and MySQL database together.

### 1. Clone The Repository

```bash
git clone <your-repository-url>
cd CRUD-Springboot-React-MySQL-Docker
```

### 2. Build The Backend JAR

The backend Dockerfile copies the Spring Boot JAR from the `target` folder, so build it before starting Docker Compose.

For Windows PowerShell:

```powershell
cd backend\crud-application
.\mvnw.cmd clean package -DskipTests
```

For macOS/Linux/Git Bash:

```bash
cd backend/crud-application
./mvnw clean package -DskipTests
```

### 3. Start All Containers

Run this command from `backend/crud-application`:

```bash
docker compose up --build
```

Docker Compose starts:

- MySQL on `localhost:3307`
- Spring Boot backend on `http://localhost:8080`
- React frontend on `http://localhost:3000`

Docker database configuration:

```text
Database: crud_db
Username: root
Password: Rooter@2389
JDBC URL inside Docker: jdbc:mysql://mysql-db:3306/crud_db
JDBC URL from your machine: jdbc:mysql://localhost:3307/crud_db
```

### 4. Open The Application

Visit:

```text
http://localhost:3000
```

### 5. Stop The Containers

```bash
docker compose down
```

To also remove the MySQL volume and delete stored database data:

```bash
docker compose down -v
```

## Flow 2: Run Manually Without Docker

Use this flow if you want to run MySQL, Spring Boot, and React directly on your machine.

### 1. Start MySQL

Create a database named `crud_db`.

```sql
CREATE DATABASE crud_db;
```

### 2. Configure Backend Environment Variables

The backend reads database settings from environment variables.

For Windows PowerShell:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/crud_db"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="your_mysql_password"
```

For macOS/Linux/Git Bash:

```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/crud_db"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="your_mysql_password"
```

### 3. Start The Backend

From the project root:

```bash
cd backend/crud-application
./mvnw spring-boot:run
```

For Windows PowerShell, use:

```powershell
cd backend\crud-application
.\mvnw.cmd spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

### 4. Start The Frontend

Open a new terminal from the project root:

```bash
cd frontend/crudfront
npm install
npm start
```

The frontend runs at:

```text
http://localhost:3000
```

## Useful URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Docker MySQL: `localhost:3307`
- Local MySQL: `localhost:3306`

## Backend Database Properties

The backend uses these properties from `application.properties`:

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

For Docker, these values are provided by `docker-compose.yml`.

For manual setup, you must provide them yourself as environment variables before starting the backend:

```text
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/crud_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_mysql_password
```

## Notes

- The backend uses `spring.jpa.hibernate.ddl-auto=update`, so tables are created or updated automatically when the backend starts.
- In the Docker flow, MySQL credentials are already configured in `docker-compose.yml`.
- In the manual flow, update the environment variables with your local MySQL username and password.
- The frontend API client currently points to `http://localhost:8080`.

## Common Commands

Build backend:

```bash
cd backend/crud-application
./mvnw clean package
```

Run backend tests:

```bash
cd backend/crud-application
./mvnw test
```

Build frontend:

```bash
cd frontend/crudfront
npm run build
```

Run frontend tests:

```bash
cd frontend/crudfront
npm test
```
