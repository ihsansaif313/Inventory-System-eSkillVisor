# EskillVisor Complete Deployment Guide

## 🚀 System Status: READY FOR DEPLOYMENT

All mock data has been removed and the system is now fully integrated with the backend API.

## Prerequisites

### Required Software
1. **Web Server**: Apache or Nginx with PHP support
2. **PHP**: Version 7.4+ with extensions:
   - PDO
   - PDO MySQL
   - JSON
   - mbstring
   - curl
3. **MySQL**: Version 8.0+
4. **Node.js**: Version 16+ (for frontend development)

### Recommended Setup
- **XAMPP** (Windows/Mac/Linux) - includes Apache, PHP, MySQL
- **WAMP** (Windows) - includes Apache, PHP, MySQL
- **MAMP** (Mac) - includes Apache, PHP, MySQL

## Step 1: Backend Deployment

### 1.1 Database Setup
```sql
-- Create database
CREATE DATABASE eskillvisor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional, for security)
CREATE USER 'eskillvisor'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON eskillvisor_db.* TO 'eskillvisor'@'localhost';
FLUSH PRIVILEGES;
```

### 1.2 Configure Database Connection
Edit `backend/config/config.php`:
```php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'eskillvisor_db');
define('DB_USER', 'root'); // or 'eskillvisor'
define('DB_PASS', ''); // or 'your_password'
```

### 1.3 Set Up Web Server
1. **Copy project to web root**:
   - XAMPP: `C:\xampp\htdocs\EskillVisor`
   - WAMP: `C:\wamp64\www\EskillVisor`
   - Linux: `/var/www/html/EskillVisor`

2. **Set permissions** (Linux/Mac):
   ```bash
   chmod 755 backend/uploads
   chmod 755 backend/logs
   chmod 644 backend/.htaccess
   ```

### 1.4 Run Installation
```bash
cd backend
php install.php
```

Expected output:
```
✓ PHP version: 7.4.x
✓ All required PHP extensions are loaded
✓ Database created or verified successfully
✓ All migrations executed successfully
✓ Users table: 3 users
✓ Companies table: 5 companies
✓ Inventory table: 5 items
✓ Installation completed successfully!
```

### 1.5 Verify Backend API
Test the API endpoint:
```bash
curl http://localhost/EskillVisor/backend/api/test
```

Expected response:
```json
{
  "success": true,
  "data": {
    "message": "API endpoint is working!",
    "timestamp": "2024-01-07T10:30:00+00:00"
  }
}
```

## Step 2: Frontend Deployment

### 2.1 Install Dependencies
```bash
npm install
```

### 2.2 Verify API Configuration
Check `src/services/api.js` - the API_BASE_URL should be:
```javascript
const API_BASE_URL = 'http://localhost/EskillVisor/backend';
```

### 2.3 Start Development Server
```bash
npm run dev
```

Expected output:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 3: System Integration Testing

### 3.1 Run Backend Tests
```bash
php test_system.php
```

Expected results:
```
✓ Backend Connectivity        PASS
✓ Database Connection         PASS
✓ Authentication - Login      PASS
✓ Get Current User           PASS
✓ Get Companies              PASS
✓ Get Inventory              PASS
✓ Get Dashboard Data         PASS
✓ Partner Role Access        PASS

Total Tests: 8
Passed: 8
Failed: 0
Errors: 0

✓ All tests passed! System is ready for use.
```

### 3.2 Frontend Integration Tests

1. **Open browser**: http://localhost:5173
2. **Test login** with default accounts:
   - Super Admin: `admin@enterprise.com` / `password`
   - Manager: `manager@enterprise.com` / `password`
   - Partner: `partner@enterprise.com` / `password`

3. **Verify data loading**:
   - Dashboard shows real data (not mock values)
   - Inventory items load from database
   - Companies load from database
   - User management works (Manager/SuperAdmin only)

## Step 4: Data Integration Verification

### 4.1 Removed Mock Data Files ✅
- ❌ `src/data/mockInventoryData.js` - REMOVED
- ❌ All mock data imports - REMOVED
- ❌ Hardcoded arrays in components - REMOVED

### 4.2 Updated Components ✅
- ✅ `src/pages/partner/Dashboard.jsx` - Uses real API
- ✅ `src/pages/manager/Dashboard.jsx` - Uses real API
- ✅ `src/pages/superadmin/Dashboard.jsx` - Uses real API
- ✅ `src/pages/manager/Inventory.jsx` - Uses real API
- ✅ `src/pages/partner/Inventory.jsx` - Uses real API
- ✅ `src/services/inventoryProcessor.js` - Uses real API
- ✅ `src/services/companyMatcher.js` - Uses real API

### 4.3 API Services ✅
- ✅ `src/services/api.js` - Complete API client
- ✅ `src/services/authService.js` - Real JWT authentication
- ✅ `src/services/inventoryService.js` - Real inventory operations
- ✅ `src/services/companyService.js` - Real company operations
- ✅ `src/services/userService.js` - Real user operations
- ✅ `src/services/notificationService.js` - Real notifications

## Step 5: Feature Testing

### 5.1 Authentication Testing
1. **Login/Logout**: Test with all user roles
2. **Role-based access**: Verify partners can't access admin features
3. **Token refresh**: Leave browser open for extended period
4. **Password reset**: Test forgot password flow

### 5.2 Inventory Management Testing
1. **CRUD operations**: Create, read, update, delete inventory items
2. **Company filtering**: Filter inventory by company
3. **Search functionality**: Search inventory items
4. **Low stock alerts**: Verify notifications for low stock

### 5.3 File Upload Testing
1. **Excel upload**: Upload .xlsx files with inventory data
2. **File processing**: Verify files are processed correctly
3. **Error handling**: Upload invalid files and check error messages
4. **Progress tracking**: Monitor upload and processing status

### 5.4 User Management Testing (Manager/SuperAdmin only)
1. **Create users**: Add new partners and managers
2. **Assign partners**: Assign partners to companies
3. **Role permissions**: Verify role-based access control
4. **User status**: Activate/deactivate users

## Step 6: Production Deployment (Optional)

### 6.1 Environment Configuration
1. **Update API URL**: Change `API_BASE_URL` to production domain
2. **Build frontend**: Run `npm run build`
3. **Deploy static files**: Upload `dist/` folder to web server
4. **Configure SSL**: Set up HTTPS for production
5. **Database security**: Use dedicated database user with limited permissions

### 6.2 Security Checklist
- ✅ Change default passwords
- ✅ Use environment variables for sensitive data
- ✅ Enable HTTPS
- ✅ Configure proper CORS settings
- ✅ Set up database backups
- ✅ Configure error logging

## Default Login Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Super Admin | admin@enterprise.com | password | Full system access |
| Manager | manager@enterprise.com | password | Manage partners and companies |
| Partner | partner@enterprise.com | password | View assigned companies only |

**⚠️ IMPORTANT**: Change these passwords immediately after deployment!

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check MySQL service is running
   - Verify database credentials in `backend/config/config.php`
   - Ensure database `eskillvisor_db` exists

2. **API requests failing**
   - Check `src/services/api.js` has correct `API_BASE_URL`
   - Verify backend is accessible at the URL
   - Check browser console for CORS errors

3. **File upload errors**
   - Ensure `backend/uploads/` directory exists and is writable
   - Check PHP upload limits in `php.ini`
   - Verify file types are allowed

4. **Frontend not loading data**
   - Check browser console for JavaScript errors
   - Verify API endpoints are responding
   - Check authentication tokens are valid

### Debug Mode
Enable debug mode in `backend/config/config.php`:
```php
define('DEBUG_MODE', true);
```

This will show detailed error messages and SQL queries.

## Support

For issues or questions:
1. Check the browser console for errors
2. Check backend logs in `backend/logs/`
3. Run the system integration test: `php test_system.php`
4. Verify all prerequisites are installed correctly

## 🎉 Deployment Complete!

Your EskillVisor Investment System is now fully deployed and operational with:
- ✅ Complete backend API integration
- ✅ Real-time data from MySQL database
- ✅ Role-based access control
- ✅ File upload and processing
- ✅ Comprehensive audit trail
- ✅ No mock data remaining

The system is production-ready and can handle real inventory management workflows!
