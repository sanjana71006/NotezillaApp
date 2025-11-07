# 🔧 MongoDB Atlas Troubleshooting Guide

## Current Error
```
MongoServerError: bad auth : authentication failed
```

This means MongoDB Atlas is **rejecting your credentials or IP address**.

---

## ✅ Solution Steps (Do in Order)

### Step 1: Whitelist Your IP Address (MOST IMPORTANT)

**This is the #1 cause of authentication failures!**

1. Open https://cloud.mongodb.com/ and sign in
2. Select your project (the one with cluster0)
3. Click **"Network Access"** in the left sidebar
4. Click **"+ ADD IP ADDRESS"** button
5. In the popup, click **"ALLOW ACCESS FROM ANYWHERE"**
   - This adds `0.0.0.0/0` to the whitelist
6. Click **"Confirm"**
7. **Wait 1-2 minutes** for changes to take effect

**Screenshot locations:**
```
MongoDB Atlas Dashboard
├── Security (left menu)
│   └── Network Access ← Click here
│       └── + ADD IP ADDRESS button ← Click here
│           └── ALLOW ACCESS FROM ANYWHERE ← Select this
```

---

### Step 2: Verify Your Database User

1. In MongoDB Atlas, click **"Database Access"** (under Security)
2. Look for user: `sanjanapriyadarshini6_db_user`
3. Check that:
   - ✅ User exists
   - ✅ Status shows "Enabled" (not disabled)
   - ✅ Password is correct: `Alitane`
   - ✅ User has "Atlas admin" or "Read and write to any database" role

**If user doesn't exist or password is wrong:**
1. Click **"+ ADD NEW DATABASE USER"**
2. Select **"Password"** (not Certificate)
3. Fill in:
   ```
   Username: sanjanapriyadarshini6_db_user
   Password: Alitane
   ```
4. Under "Database User Privileges", select:
   - **Built-in Role**: "Atlas admin" or "Read and write to any database"
5. Click **"Add User"**

---

### Step 3: Verify Cluster is Running

1. Click **"Database"** in the left sidebar
2. Check your cluster `cluster0`:
   - Should show **green "Active"** status
   - Should NOT say "Paused"
3. If paused, click "Resume" button

---

### Step 4: Test Connection Again

After completing steps 1-3:

```bash
# In your backend folder
npm run dev
```

You should see:
```
✅ MongoDB Atlas connected successfully!
Database: notezilla
Server running on port 5000
```

---

## 🔄 Alternative: Create New User (If Steps 1-3 Don't Work)

If the original credentials don't work, create a fresh user:

1. Go to **Database Access** → **+ ADD NEW DATABASE USER**
2. Create user:
   ```
   Username: notezilla_admin
   Password: NotezillaSecure123
   Role: Atlas admin
   ```
3. Update `backend/src/config/db.js`:
   ```javascript
   const uri = 'mongodb+srv://notezilla_admin:NotezillaSecure123@cluster0.1oxvb5x.mongodb.net/?appName=Cluster0';
   ```

---

## 🎯 Quick Checklist

Before restarting the backend, verify:

- [ ] IP `0.0.0.0/0` is in Network Access whitelist
- [ ] Database user exists with correct password
- [ ] User has "Atlas admin" or "Read and write" permissions
- [ ] Cluster0 is Active (not Paused)
- [ ] Waited 1-2 minutes after making changes

---

## 📞 Still Not Working?

If you've done all of the above and it still fails:

1. **Check for typos** in username/password
2. **Special characters**: If password has `@`, `#`, `:`, etc., they need URL encoding:
   - `@` → `%40`
   - `#` → `%23`
   - `:` → `%3A`
   
   Example: Password `Pass@123` becomes `Pass%40123` in connection string

3. **Browser cache**: Sometimes Atlas dashboard needs a refresh
   - Press `Ctrl + Shift + R` to hard refresh

4. **Create a completely new cluster** if nothing works:
   - This is a last resort, but sometimes helps with configuration issues

---

## ✨ Once Connected

After successful connection, you'll have access to:
- User signup/login with roles (Admin, Faculty, Student)
- All dashboard features working
- Full database with all collections
- Complete CRUD operations for all features

The application is fully built and ready to use once MongoDB connects!
