# Complete Docker Guide for CRUD Application
## Spring Boot Backend + React Frontend + MySQL Database

---

## 📋 Prerequisites
Before starting, ensure you have:
- **Docker** installed ([Download](https://www.docker.com/products/docker-desktop))
- **Docker Compose** installed (comes with Docker Desktop)
- Your project cloned locally
- Backend built (compiled to JAR file)

Check versions:
```bash
docker --version
docker-compose --version
```

---

## 🏗️ Project Structure
```
your-project/
├── backend/
│   └── crud-application/
│       ├── Dockerfile                 # Backend Docker config
│       ├── docker-compose.yml         # Complete stack definition
│       └── target/
│           └── crud-application-0.0.1-SNAPSHOT.jar
├── frontend/
│   └── crudfront/
│       ├── Dockerfile                 # Frontend Docker config
│       ├── public/
│       └── src/
```

---

## 📝 Docker Files Explained

### 1. **Backend Dockerfile** (`backend/crud-application/Dockerfile`)
- **Starts with:** Java 17 base image
- **Copies:** The compiled JAR file into container
- **Exposes:** Port 8080
- **Purpose:** Packages your Spring Boot app in a container

### 2. **Frontend Dockerfile** (`frontend/crudfront/Dockerfile`)
- **Stage 1 (Build):** Uses Node.js to compile React code
- **Stage 2 (Production):** Uses Nginx to serve the compiled code
- **Exposes:** Port 3000
- **Purpose:** Packages your React app efficiently

### 3. **docker-compose.yml** (`backend/crud-application/docker-compose.yml`)
- **Orchestrates:** All three services (MySQL, Backend, Frontend)
- **Networks:** Services communicate using service names (e.g., `mysql-db`)
- **Volumes:** Persists MySQL data between container restarts
- **Purpose:** Runs everything with one command

---

## 🚀 Step-by-Step Setup & Commands

### **STEP 1: Prepare the Backend**
**What:** Compile your Spring Boot application to JAR file
**Why:** Docker needs the compiled JAR to run the application
**When:** Do this before running Docker

```bash
# Navigate to backend folder
cd backend/crud-application

# Build the project (creates JAR in target/ folder)
mvn clean package

# Verify JAR was created
ls target/crud-application-0.0.1-SNAPSHOT.jar
```

**Expected output:**
```
target/crud-application-0.0.1-SNAPSHOT.jar (file exists)
```

---

### **STEP 2: Create Frontend Dockerfile**
**What:** Create configuration for React frontend container
**Why:** Enables frontend to run in Docker alongside backend
**When:** Once, before first Docker run

Create file: `frontend/crudfront/Dockerfile`
```dockerfile
# Stage 1: Build React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

---

### **STEP 3: Create Nginx Configuration**
**What:** Configuration for Nginx web server
**Why:** Routes frontend requests properly
**When:** Once, when creating frontend Dockerfile

Create file: `frontend/crudfront/nginx.conf`
```nginx
server {
    listen 3000;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://crud-app:8080;
    }
}
```

---

### **STEP 4: Start All Services with Docker Compose**
**What:** Launch MySQL, Backend, and Frontend containers together
**Why:** All three services start with one command and can communicate
**When:** Every time you want to run the application

```bash
# Navigate to docker-compose location
cd backend/crud-application

# Start all services (runs in background)
docker-compose up -d

# View logs to confirm everything started
docker-compose logs -f

# Wait 10-15 seconds for MySQL to initialize
```

**Expected output:**
```
Creating mysql-container ... done
Creating crud-container ... done
Creating frontend-container ... done
```

---

## 🌐 Access Your Application

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `http://localhost:3000` | React UI (open in browser) |
| **Backend API** | `http://localhost:8080` | Spring Boot API |
| **MySQL** | `localhost:3307` | Database (host machine only) |

**Test it:**
```bash
# Check if backend is running
curl http://localhost:8080/api/users

# Check if frontend is running
curl http://localhost:3000
```

---

## 🔄 Docker Compose Commands Reference

### **View running containers**
```bash
docker-compose ps
```
Expected: 3 containers (mysql-container, crud-container, frontend-container)

### **View logs**
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs crud-app
docker-compose logs mysql-db
docker-compose logs frontend-container

# Follow logs (real-time)
docker-compose logs -f
```

### **Stop all services**
```bash
docker-compose stop
```
Services pause but data persists

### **Start stopped services**
```bash
docker-compose start
```

### **Restart all services**
```bash
docker-compose restart
```

### **Remove all services (keep data)**
```bash
docker-compose down
```
Containers deleted but MySQL data persists in volumes

### **Remove everything including data**
```bash
docker-compose down -v
```
⚠️ Warning: Deletes all data in database

---

## 🐛 Troubleshooting

### **Frontend shows blank page**
- Check logs: `docker-compose logs frontend-container`
- Verify API endpoint in frontend code matches backend URL

### **Backend can't connect to MySQL**
- MySQL needs 10-15 seconds to initialize
- Check logs: `docker-compose logs mysql-db`
- Verify connection string uses `mysql-db:3306` (not localhost)

### **Port already in use**
```bash
# Change ports in docker-compose.yml:
# "3307:3306" → "3308:3306"  (MySQL)
# "8080:8080" → "8081:8080"  (Backend)
# "3000:3000" → "3001:3000"  (Frontend)
```

### **Clear everything and start fresh**
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

---

## 📊 Service Communication Inside Docker

```
[Frontend Container]
       ↓ (requests to /api/*)
       ↓
[Backend Container] ←→ [MySQL Container]
    (port 8080)           (port 3306)
```

**Key Point:** Services use **service names** (not localhost):
- Frontend calls: `http://crud-app:8080` (internal)
- Backend connects to: `mysql-db:3306` (internal)

---

## 🔐 Important Files Overview

| File | Location | Purpose |
|------|----------|---------|
| Dockerfile | `backend/crud-application/` | Backend container definition |
| Dockerfile | `frontend/crudfront/` | Frontend container definition |
| docker-compose.yml | `backend/crud-application/` | Orchestrates all services |
| nginx.conf | `frontend/crudfront/` | Frontend routing config |

---

## ✅ Typical Workflow

1. **First time setup:**
   ```bash
   # Build backend
   cd backend/crud-application && mvn clean package
   
   # Create frontend Dockerfile & nginx.conf
   # (see STEP 2 & 3 above)
   
   # Start services
   docker-compose up -d
   ```

2. **Daily development:**
   ```bash
   # Stop services
   docker-compose stop
   
   # Make changes to code
   
   # Rebuild backend if needed
   mvn clean package
   
   # Restart services
   docker-compose up -d
   ```

3. **Clean shutdown:**
   ```bash
   docker-compose down
   ```

---

## 📌 Quick Reference Card

```bash
# Build backend
mvn clean package

# Start all services
docker-compose up -d

# View status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose stop

# Remove services (keep data)
docker-compose down

# Remove everything
docker-compose down -v
```

---

## 🎯 Next Steps
1. ✅ Create Frontend Dockerfile (Step 2)
2. ✅ Create nginx.conf (Step 3)
3. ✅ Run `docker-compose up -d` (Step 4)
4. ✅ Access http://localhost:3000 in browser
5. ✅ Check logs if issues: `docker-compose logs -f`

---

## 📚 Additional Resources
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [React Docker Best Practices](https://react.dev/learn/deployment)
