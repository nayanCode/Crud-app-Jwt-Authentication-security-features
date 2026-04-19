# Docker Commands Cheat Sheet for CRUD App

## 🎯 Most Used Commands

### Start Everything
```bash
cd backend/crud-application
docker-compose up -d
```
- Starts MySQL, Backend, and Frontend
- Runs in background (-d flag)
- Takes 10-15 seconds for MySQL to initialize

### Check Services Running
```bash
docker-compose ps
```
Shows status of all containers:
- ✅ UP: Service is running
- ❌ Exited: Service crashed

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service (shows real-time logs)
docker-compose logs -f crud-app
docker-compose logs -f mysql-db
docker-compose logs -f frontend-container
```

### Stop Services
```bash
# Pause (can restart with docker-compose start)
docker-compose stop

# Delete containers (data persists)
docker-compose down

# Delete everything including database
docker-compose down -v
```

---

## 🔄 Development Workflow

### 1️⃣ First Time Only
```bash
# Build backend JAR
cd backend/crud-application
mvn clean package

# Create Frontend Dockerfile & nginx.conf
# (files are already created in DOCKER_GUIDE.md)

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### 2️⃣ Daily Work
```bash
# Make changes to backend code
# Edit Java files in backend/crud-application/src/

# Rebuild backend
mvn clean package

# Restart backend
docker-compose restart crud-app

# Check it worked
docker-compose logs -f crud-app
```

### 3️⃣ Frontend Changes
```bash
# Make changes to frontend code
# Edit React files in frontend/crudfront/src/

# Rebuild frontend
docker-compose restart frontend-container

# Check it worked
docker-compose logs -f frontend-container
```

### 4️⃣ Database Issues
```bash
# Reset database (starts fresh)
docker-compose down -v
docker-compose up -d
```

---

## 🌐 Access Your App

| What | URL | Browser |
|------|-----|---------|
| Frontend | http://localhost:3000 | ✅ Open here |
| API Test | http://localhost:8080/api/users | ✅ Test API |
| MySQL | localhost:3307 | Use MySQL client |

---

## 🆘 Common Issues

### "Port already in use"
Change ports in docker-compose.yml:
```yaml
# OLD: "3000:3000"
# NEW: "3001:3000"
```

### "Backend can't connect to MySQL"
- Wait 15 seconds, MySQL takes time to start
- Check: `docker-compose logs mysql-db`

### "Frontend shows blank page"
- Check: `docker-compose logs frontend-container`
- Check backend is running: `docker-compose ps`

### "Services won't start"
```bash
# Full reset
docker-compose down -v
docker system prune -a
docker-compose up -d
docker-compose logs -f
```

---

## 📊 Service URLs (Inside Docker)
These URLs work INSIDE containers, not from your computer:
- Frontend → Backend: `http://crud-app:8080`
- Backend → MySQL: `jdbc:mysql://mysql-db:3306/crud_db`

---

## 💾 One-Line Reference

| Task | Command |
|------|---------|
| Start | `docker-compose up -d` |
| Status | `docker-compose ps` |
| Logs | `docker-compose logs -f` |
| Stop | `docker-compose stop` |
| Delete containers | `docker-compose down` |
| Delete everything | `docker-compose down -v` |
| Restart backend | `docker-compose restart crud-app` |
| Rebuild all | `docker-compose up -d --build` |

---

## 📌 Always Remember

1. **Build backend before Docker:**
   ```bash
   mvn clean package
   ```

2. **Run from correct directory:**
   ```bash
   cd backend/crud-application
   docker-compose up -d
   ```

3. **Wait for MySQL (10-15 seconds)**

4. **Access app at:**
   ```
   http://localhost:3000
   ```

5. **Check logs if issues:**
   ```bash
   docker-compose logs -f
   ```
