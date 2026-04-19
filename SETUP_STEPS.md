# Step-by-Step Docker Setup Guide

## 🎯 Complete Setup from Scratch (15 minutes)

### **Phase 1: Prepare Backend (5 minutes)**

**Step 1.1:** Open terminal and navigate to backend
```bash
cd backend/crud-application
```

**Step 1.2:** Build the Java application (creates JAR file)
```bash
mvn clean package
```
**What happens:** 
- Compiles all Java code
- Runs tests
- Creates `target/crud-application-0.0.1-SNAPSHOT.jar`
- Takes 2-3 minutes

**Wait for:** `BUILD SUCCESS` message

---

### **Phase 2: Verify Files Exist (1 minute)**

**Step 2.1:** Check backend Dockerfile exists
```bash
ls Dockerfile
```
Should show: `Dockerfile`

**Step 2.2:** Check frontend files exist
```bash
ls ../../frontend/crudfront/Dockerfile
ls ../../frontend/crudfront/nginx.conf
ls ../../frontend/crudfront/package.json
```
Should show all 3 files exist ✅

**If files missing:** They were just created for you in this setup

**Step 2.3:** Check docker-compose.yml
```bash
cat docker-compose.yml
```
Should include MySQL, Backend (crud-app), and Frontend sections ✅

---

### **Phase 3: Start Docker Services (3 minutes)**

**Step 3.1:** Make sure you're in the right directory
```bash
pwd
```
**Should show path ending with:** `backend/crud-application`

**Step 3.2:** Start all services
```bash
docker-compose up -d
```
**Output:**
```
Creating network "crud-application_default" ...
Creating mysql-container ... done
Creating crud-container ... done
Creating frontend-container ... done
```

**What happens:**
- Creates Docker network
- Starts MySQL database
- Starts Spring Boot backend
- Starts React frontend
- Runs in background (you get terminal back)

**Step 3.3:** Wait 10-15 seconds (MySQL initialization)
```bash
# Just wait...
```

---

### **Phase 4: Verify Everything Running (2 minutes)**

**Step 4.1:** Check all containers running
```bash
docker-compose ps
```
**Expected output:**
```
NAME                  STATUS      PORTS
mysql-container       Up 2 min    0.0.0.0:3307->3306/tcp
crud-container        Up 1 min    0.0.0.0:8080->8080/tcp
frontend-container    Up 1 min    0.0.0.0:3000->3000/tcp
```

All should show **Up** status ✅

**Step 4.2:** Check backend logs
```bash
docker-compose logs crud-app
```
**Look for:** 
```
Started CrudApplication in X seconds
```
✅ Backend is running

**Step 4.3:** Check MySQL logs
```bash
docker-compose logs mysql-db
```
**Look for:**
```
Ready for connections
```
✅ Database is running

---

### **Phase 5: Test the Application (2 minutes)**

**Step 5.1:** Open browser and go to Frontend
```
http://localhost:3000
```
**Expected:** React app loads ✅

**Step 5.2:** Test Backend API
```bash
curl http://localhost:8080/api/users
```
or in browser:
```
http://localhost:8080/api/users
```
**Expected:** JSON response with user data ✅

**Step 5.3:** Test signing up / logging in
- Go to http://localhost:3000
- Try the signup or login functionality
- If works: ✅ Everything is connected!

---

## 🔄 After First Setup (Daily Usage)

### **To Start Work**
```bash
cd backend/crud-application
docker-compose up -d
docker-compose logs -f
```
Wait 15 seconds, then open http://localhost:3000

### **To Stop Work**
```bash
docker-compose stop
```
or
```bash
docker-compose down
```

### **To Restart Everything**
```bash
docker-compose restart
```

### **If Something Breaks**
```bash
# View all logs
docker-compose logs -f

# Restart that service
docker-compose restart crud-app
# or
docker-compose restart frontend-container
# or
docker-compose restart mysql-db

# Full reset if needed
docker-compose down -v
docker-compose up -d
```

---

## 📝 Making Code Changes

### **Backend Changes**
```bash
# 1. Edit Java files
# 2. Rebuild JAR
mvn clean package

# 3. Restart backend
docker-compose restart crud-app

# 4. Check logs
docker-compose logs -f crud-app
```

### **Frontend Changes**
```bash
# 1. Edit React files
# 2. Restart frontend (Docker rebuilds)
docker-compose restart frontend-container

# 3. Check logs
docker-compose logs -f frontend-container
```

### **Database Schema Changes**
```bash
# 1. Update JPA entities
# 2. Rebuild backend
mvn clean package

# 3. Reset database
docker-compose down -v

# 4. Restart (creates new tables)
docker-compose up -d
```

---

## ⚠️ Troubleshooting

### **Containers won't start**
```bash
# Check if ports are in use
netstat -ano | findstr 3000  # Frontend
netstat -ano | findstr 8080  # Backend
netstat -ano | findstr 3307  # MySQL

# If ports in use, change them in docker-compose.yml
# Then try again
docker-compose up -d
```

### **Frontend shows blank page**
```bash
# Check frontend logs
docker-compose logs frontend-container

# Ensure backend is running
curl http://localhost:8080/api/users

# Restart frontend
docker-compose restart frontend-container
```

### **Backend can't connect to MySQL**
```bash
# Check MySQL status
docker-compose ps mysql-db

# Should show "Up" status

# Wait 15 more seconds if just started

# Check MySQL logs
docker-compose logs mysql-db

# Restart database
docker-compose restart mysql-db
```

### **Need to completely reset**
```bash
# Stop everything
docker-compose down -v

# Remove unused images
docker system prune -a

# Start fresh
docker-compose up -d

# Watch logs to confirm
docker-compose logs -f
```

---

## 📊 What Each Service Does

### **MySQL Container** (mysql-container)
- **Purpose:** Stores all data (users, posts, etc.)
- **Port:** 3307 (on your computer) → 3306 (in container)
- **Data:** Persists in Docker volume `mysql_data`
- **Credentials:** root / Rooter@2389
- **Database:** crud_db

### **Backend Container** (crud-container)
- **Purpose:** Spring Boot API server
- **Port:** 8080 (on your computer) → 8080 (in container)
- **Connects to:** MySQL at `mysql-db:3306`
- **Runs:** Java application from JAR file

### **Frontend Container** (frontend-container)
- **Purpose:** React web application UI
- **Port:** 3000 (on your computer) → 3000 (in container)
- **Calls:** Backend API at `crud-app:8080`
- **Served by:** Nginx web server

---

## 📌 Key Concepts

### **Docker Network**
All three containers are on the same Docker network and can communicate by service name:
```
Frontend Container → Backend Container (http://crud-app:8080)
Backend Container → MySQL Container (jdbc:mysql://mysql-db:3306)
```

### **Volumes**
Database data is stored in Docker volume `mysql_data` so it survives container restarts:
```
docker-compose stop  # Data persists
docker-compose down  # Data persists
docker-compose down -v  # Data DELETED
```

### **Port Mapping**
```
External (Your Computer) : Internal (Container)
3000 : 3000              (Frontend)
8080 : 8080              (Backend)
3307 : 3306              (MySQL)
```

---

## ✅ Success Checklist

- [ ] Java 17 or higher installed
- [ ] Docker Desktop running
- [ ] Backend built: `mvn clean package`
- [ ] All 3 containers running: `docker-compose ps`
- [ ] Frontend loads: http://localhost:3000
- [ ] API responds: http://localhost:8080/api/users
- [ ] Can login/signup successfully
- [ ] Database has data

If all checkmarks complete → ✅ You're done!

---

## 🎓 Learning Tips

1. **Keep watching logs while developing:**
   ```bash
   docker-compose logs -f
   ```

2. **Don't memorize commands, use this guide**

3. **Usually only need 3 commands:**
   ```bash
   docker-compose up -d    # Start
   docker-compose ps       # Check status
   docker-compose logs -f  # See what's happening
   ```

4. **When stuck: restart everything**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

---

## 🚀 You're ready! Start with Phase 1 above.
