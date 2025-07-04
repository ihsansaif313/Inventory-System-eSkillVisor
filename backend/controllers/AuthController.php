<?php
/**
 * Authentication Controller
 */

class AuthController extends Controller {
    
    public function login() {
        $data = $this->getRequestData();
        
        // Validate input
        $rules = [
            'email' => 'required|email',
            'password' => 'required|min:1'
        ];
        
        if (!$this->validateAndRespond($data, $rules)) {
            return;
        }
        
        try {
            $result = Auth::login($data['email'], $data['password']);
            
            if ($result) {
                $this->logActivity('login', 'user', $result['user']['id']);
                Response::success($result, 'Login successful');
            } else {
                Response::error('Invalid email or password', 401);
            }
        } catch (Exception $e) {
            logError('Login failed: ' . $e->getMessage(), $data);
            Response::error('Login failed', 500);
        }
    }
    
    public function logout() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $token = $this->getTokenFromHeader();
            Auth::logout($token);
            
            $this->logActivity('logout', 'user', $this->user['id']);
            Response::success(null, 'Logout successful');
        } catch (Exception $e) {
            logError('Logout failed: ' . $e->getMessage());
            Response::error('Logout failed', 500);
        }
    }
    
    public function refresh() {
        $data = $this->getRequestData();
        
        if (!isset($data['refresh_token'])) {
            Response::error('Refresh token required', 400);
            return;
        }
        
        try {
            $result = Auth::refresh($data['refresh_token']);
            
            if ($result) {
                Response::success($result, 'Token refreshed successfully');
            } else {
                Response::error('Invalid refresh token', 401);
            }
        } catch (Exception $e) {
            logError('Token refresh failed: ' . $e->getMessage());
            Response::error('Token refresh failed', 500);
        }
    }
    
    public function me() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            // Get user with additional details
            $userModel = new User();
            $user = $userModel->find($this->user['id']);
            
            if ($user) {
                // Get assigned companies for partners
                if ($user['role'] === 'partner') {
                    $sql = "SELECT c.id, c.name FROM companies c 
                            JOIN company_partners cp ON c.id = cp.company_id 
                            WHERE cp.user_id = :user_id AND cp.status = 'active'";
                    $companies = $this->db->fetchAll($sql, ['user_id' => $user['id']]);
                    $user['assigned_companies'] = $companies;
                }
                
                Response::success($user, 'User profile retrieved');
            } else {
                Response::error('User not found', 404);
            }
        } catch (Exception $e) {
            logError('Get user profile failed: ' . $e->getMessage());
            Response::error('Failed to get user profile', 500);
        }
    }
    
    public function forgotPassword() {
        $data = $this->getRequestData();
        
        $rules = [
            'email' => 'required|email'
        ];
        
        if (!$this->validateAndRespond($data, $rules)) {
            return;
        }
        
        try {
            $userModel = new User();
            $user = $userModel->whereFirst('email', $data['email']);
            
            if ($user && $user['status'] === 'active') {
                // Generate password reset token
                $resetToken = Auth::generatePasswordResetToken($user['id']);
                
                // Store reset token
                $this->db->insert('user_tokens', [
                    'user_id' => $user['id'],
                    'token' => $resetToken,
                    'type' => 'password_reset',
                    'expires_at' => date('Y-m-d H:i:s', time() + 3600), // 1 hour
                    'created_at' => date('Y-m-d H:i:s')
                ]);
                
                // In a real application, send email here
                // EmailService::sendPasswordReset($user['email'], $resetToken);
                
                $this->logActivity('password_reset_requested', 'user', $user['id']);
                
                // Always return success for security (don't reveal if email exists)
                Response::success(null, 'If the email exists, a password reset link has been sent');
            } else {
                // Still return success for security
                Response::success(null, 'If the email exists, a password reset link has been sent');
            }
        } catch (Exception $e) {
            logError('Password reset request failed: ' . $e->getMessage());
            Response::error('Password reset request failed', 500);
        }
    }
    
    public function resetPassword() {
        $data = $this->getRequestData();
        
        $rules = [
            'token' => 'required',
            'password' => 'required|min:8',
            'password_confirmation' => 'required'
        ];
        
        if (!$this->validateAndRespond($data, $rules)) {
            return;
        }
        
        if ($data['password'] !== $data['password_confirmation']) {
            Response::error('Password confirmation does not match', 422);
            return;
        }
        
        try {
            // Verify reset token
            $userId = Auth::verifyPasswordResetToken($data['token']);
            
            if (!$userId) {
                Response::error('Invalid or expired reset token', 400);
                return;
            }
            
            // Check if token exists in database and is not used
            $sql = "SELECT * FROM user_tokens 
                    WHERE token = :token AND type = 'password_reset' 
                    AND expires_at > NOW() AND used_at IS NULL";
            $tokenRecord = $this->db->fetch($sql, ['token' => $data['token']]);
            
            if (!$tokenRecord) {
                Response::error('Invalid or expired reset token', 400);
                return;
            }
            
            // Update password
            $userModel = new User();
            $hashedPassword = Auth::hashPassword($data['password']);
            
            $userModel->update($userId, [
                'password' => $hashedPassword,
                'updated_at' => date('Y-m-d H:i:s')
            ]);
            
            // Mark token as used
            $this->db->update('user_tokens', 
                ['used_at' => date('Y-m-d H:i:s')], 
                'id = :id', 
                ['id' => $tokenRecord['id']]
            );
            
            // Invalidate all user sessions
            $this->db->delete('user_tokens', 'user_id = :user_id AND type = :type', [
                'user_id' => $userId,
                'type' => 'refresh'
            ]);
            
            $this->logActivity('password_reset_completed', 'user', $userId);
            
            Response::success(null, 'Password reset successfully');
        } catch (Exception $e) {
            logError('Password reset failed: ' . $e->getMessage());
            Response::error('Password reset failed', 500);
        }
    }
    
    private function getTokenFromHeader() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        
        if ($authHeader && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }
        
        return null;
    }
}
