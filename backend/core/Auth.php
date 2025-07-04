<?php
/**
 * Authentication and Authorization Class
 */

if (!class_exists('Firebase\JWT\JWT')) {
    require_once __DIR__ . '/../vendor/firebase/php-jwt/src/JWT.php';
}
if (!class_exists('Firebase\JWT\Key')) {
    require_once __DIR__ . '/../vendor/firebase/php-jwt/src/Key.php';
}

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth {
    private static $user = null;
    
    public static function login($email, $password) {
        $db = Database::getInstance();

        logInfo("Login attempt for email: {$email}");

        $sql = "SELECT * FROM users WHERE email = :email AND status = 'active' LIMIT 1";
        $user = $db->fetch($sql, ['email' => $email]);

        if (!$user) {
            logInfo("User not found: {$email}");
            return false;
        }

        logInfo("User found: {$email}, checking password");

        if (!password_verify($password, $user['password_hash'])) {
            logInfo("Password verification failed for: {$email}");
            return false;
        }

        logInfo("Password verification successful for: {$email}");
        
        // Update last login
        $db->update('users', 
            ['last_login' => date('Y-m-d H:i:s')], 
            'id = :id', 
            ['id' => $user['id']]
        );
        
        // Generate tokens
        $accessToken = self::generateAccessToken($user);
        $refreshToken = self::generateRefreshToken($user);
        
        // Store refresh token
        $db->insert('user_tokens', [
            'user_id' => $user['id'],
            'token_hash' => $refreshToken,
            'type' => 'refresh',
            'expires_at' => date('Y-m-d H:i:s', time() + JWT_REFRESH_EXPIRATION),
            'created_at' => date('Y-m-d H:i:s')
        ]);
        
        // Remove password from user data
        unset($user['password']);
        
        return [
            'user' => $user,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'expires_in' => JWT_EXPIRATION
        ];
    }
    
    public static function logout($token = null) {
        if (!$token) {
            $token = self::getTokenFromHeader();
        }
        
        if ($token) {
            $db = Database::getInstance();
            // Invalidate refresh tokens for this user
            $user = self::getUserFromToken($token);
            if ($user) {
                $db->delete('user_tokens', 'user_id = :user_id', ['user_id' => $user['id']]);
            }
        }
        
        self::$user = null;
        return true;
    }
    
    public static function refresh($refreshToken) {
        $db = Database::getInstance();
        
        // Verify refresh token exists and is valid
        $sql = "SELECT ut.*, u.* FROM user_tokens ut
                JOIN users u ON ut.user_id = u.id
                WHERE ut.token_hash = :token AND ut.type = 'refresh'
                AND ut.expires_at > NOW() AND u.status = 'active'";
        
        $result = $db->fetch($sql, ['token' => $refreshToken]);
        
        if (!$result) {
            return false;
        }
        
        // Generate new access token
        $user = [
            'id' => $result['user_id'],
            'email' => $result['email'],
            'role' => $result['role'],
            'name' => $result['name']
        ];
        
        $accessToken = self::generateAccessToken($user);
        
        return [
            'access_token' => $accessToken,
            'expires_in' => JWT_EXPIRATION
        ];
    }
    
    public static function check() {
        return self::user() !== null;
    }
    
    public static function user() {
        if (self::$user === null) {
            $token = self::getTokenFromHeader();
            if ($token) {
                self::$user = self::getUserFromToken($token);
            }
        }
        
        return self::$user;
    }
    
    public static function id() {
        $user = self::user();
        return $user ? $user['id'] : null;
    }
    
    public static function hasRole($role) {
        $user = self::user();
        return $user && $user['role'] === $role;
    }
    
    public static function hasAnyRole($roles) {
        $user = self::user();
        return $user && in_array($user['role'], $roles);
    }
    
    public static function isSuperAdmin() {
        return self::hasRole('superadmin');
    }
    
    public static function isManager() {
        return self::hasAnyRole(['superadmin', 'manager']);
    }
    
    public static function isPartner() {
        return self::hasRole('partner');
    }
    
    public static function canAccessCompany($companyId) {
        $user = self::user();
        if (!$user) return false;
        
        // Superadmin and manager can access all companies
        if (in_array($user['role'], ['superadmin', 'manager'])) {
            return true;
        }
        
        // Partner can only access assigned companies
        if ($user['role'] === 'partner') {
            $db = Database::getInstance();
            $sql = "SELECT COUNT(*) as count FROM company_partners WHERE user_id = :user_id AND company_id = :company_id";
            $result = $db->fetch($sql, [
                'user_id' => $user['id'],
                'company_id' => $companyId
            ]);
            
            return $result['count'] > 0;
        }
        
        return false;
    }
    
    public static function middleware() {
        if (!self::check()) {
            Response::error('Authentication required', 401);
            return false;
        }
        return true;
    }
    
    public static function adminMiddleware() {
        if (!self::middleware()) return false;
        
        if (!self::isSuperAdmin()) {
            Response::error('Admin access required', 403);
            return false;
        }
        return true;
    }
    
    public static function managerMiddleware() {
        if (!self::middleware()) return false;
        
        if (!self::isManager()) {
            Response::error('Manager access required', 403);
            return false;
        }
        return true;
    }
    
    private static function generateAccessToken($user) {
        $payload = [
            'iss' => APP_NAME,
            'iat' => time(),
            'exp' => time() + JWT_EXPIRATION,
            'user_id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'name' => $user['name'] ?? ''
        ];
        
        return JWT::encode($payload, JWT_SECRET, JWT_ALGORITHM);
    }
    
    private static function generateRefreshToken($user) {
        $payload = [
            'iss' => APP_NAME,
            'iat' => time(),
            'exp' => time() + JWT_REFRESH_EXPIRATION,
            'user_id' => $user['id'],
            'type' => 'refresh'
        ];
        
        return JWT::encode($payload, JWT_SECRET, JWT_ALGORITHM);
    }
    
    private static function getTokenFromHeader() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        
        if ($authHeader && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }
        
        return null;
    }
    
    private static function getUserFromToken($token) {
        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, JWT_ALGORITHM));
            
            // Verify user still exists and is active
            $db = Database::getInstance();
            $sql = "SELECT id, email, role, name, status FROM users WHERE id = :id AND status = 'active'";
            $user = $db->fetch($sql, ['id' => $decoded->user_id]);
            
            return $user ?: null;
        } catch (Exception $e) {
            logError('Token validation failed: ' . $e->getMessage());
            return null;
        }
    }
    
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_DEFAULT);
    }
    
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
    
    public static function generatePasswordResetToken($userId) {
        $payload = [
            'iss' => APP_NAME,
            'iat' => time(),
            'exp' => time() + 3600, // 1 hour
            'user_id' => $userId,
            'type' => 'password_reset'
        ];
        
        return JWT::encode($payload, JWT_SECRET, JWT_ALGORITHM);
    }
    
    public static function verifyPasswordResetToken($token) {
        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, JWT_ALGORITHM));
            
            if ($decoded->type !== 'password_reset') {
                return false;
            }
            
            return $decoded->user_id;
        } catch (Exception $e) {
            return false;
        }
    }
}
