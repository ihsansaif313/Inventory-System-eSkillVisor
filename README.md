# EskillVisor Investment System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PHP Version](https://img.shields.io/badge/PHP-7.4%2B-blue.svg)](https://php.net)
[![Node.js Version](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org)
[![MySQL Version](https://img.shields.io/badge/MySQL-8.0%2B-orange.svg)](https://mysql.com)

## 🚀 Overview

EskillVisor is a comprehensive enterprise-grade investment portfolio management system designed for investment firms to efficiently manage their portfolio companies' inventory, users, and operations. The system provides role-based access control, real-time inventory tracking, bulk file processing, and comprehensive audit trails.

### 🎯 Key Features

- **Role-Based Access Control**: Three distinct user roles (Super Admin, Manager, Partner) with granular permissions
- **Real-Time Inventory Management**: Complete CRUD operations with low-stock alerts and automated notifications
- **Bulk File Processing**: Excel/CSV file upload with intelligent parsing and validation
- **Company Portfolio Management**: Assign partners to companies with restricted data access
- **User Management**: Complete user lifecycle management with role assignments
- **Audit Trail**: Comprehensive logging of all system changes and user activities
- **JWT Authentication**: Secure token-based authentication with refresh token support
- **Responsive Design**: Modern, mobile-friendly interface built with React and Tailwind CSS
- **RESTful API**: Well-documented API endpoints for all system operations

## 🏗️ System Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context API
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with custom service layer

### Backend
- **Language**: PHP 7.4+ with MVC architecture
- **Database**: MySQL 8.0+ with optimized schema
- **Authentication**: JWT tokens with refresh token rotation
- **File Processing**: Multi-format file parser (Excel, CSV, PDF)
- **API**: RESTful endpoints with comprehensive error handling
- **Security**: Input validation, SQL injection prevention, CORS protection

## 📋 System Requirements

### Development Environment
- **PHP**: 7.4 or higher with extensions:
  - PDO, PDO MySQL, JSON, mbstring, curl, fileinfo
- **MySQL**: 8.0 or higher
- **Node.js**: 16.0 or higher
- **Web Server**: Apache 2.4+ or Nginx 1.18+

### Recommended Setup
- **XAMPP**: 8.0+ (includes Apache, PHP, MySQL)
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 2GB free space minimum

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-username/eskillvisor-investment-system.git
cd eskillvisor-investment-system
```

### 2. Backend Setup
```bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE eskillvisor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Configure database connection
cp backend/config/config.example.php backend/config/config.php
# Edit config.php with your database credentials

# Run database installation
php backend/install.php
```

### 3. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost/eskillvisor/backend
- **Database Admin**: http://localhost/phpmyadmin

## 🔐 Default Login Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Super Admin** | admin@enterprise.com | password | Full system access, user management |
| **Manager** | manager@enterprise.com | password | Partner & company management |
| **Partner** | partner@enterprise.com | password | Assigned companies only |

> ⚠️ **Security Notice**: Change these default passwords immediately in production environments.

## 📚 Documentation

- **[API Documentation](API_DOCUMENTATION.md)**: Complete API endpoint reference
- **[Database Schema](DATABASE_SCHEMA.md)**: Database structure and relationships
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)**: Production deployment instructions

## 🎮 Usage Examples

### User Management (Super Admin)
```javascript
// Create new user
const newUser = await userService.createUser({
  email: 'newuser@company.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'partner',
  status: 'active'
});
```

### Inventory Operations
```javascript
// Add inventory item
const item = await inventoryService.createInventoryItem({
  name: 'Office Chairs',
  quantity: 25,
  unitPrice: 299.99,
  minStockLevel: 10,
  companyId: 1
});
```

### File Upload Processing
```javascript
// Process Excel file
const result = await fileService.uploadFile(file);
const processed = await fileService.processFile(result.fileId);
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User authentication (all roles)
- [ ] Role-based access control
- [ ] Inventory CRUD operations
- [ ] File upload and processing
- [ ] Company-partner assignments
- [ ] Notification system
- [ ] Audit trail logging

## 🚀 Production Deployment

### Security Checklist
- [ ] Change default passwords
- [ ] Configure HTTPS
- [ ] Set up database backups
- [ ] Configure error logging
- [ ] Enable rate limiting
- [ ] Set proper file permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check the documentation files
- **Issues**: Create a GitHub issue
- **Email**: support@eskillvisor.com

---

**EskillVisor Investment System** - Professional inventory management for investment portfolios.
