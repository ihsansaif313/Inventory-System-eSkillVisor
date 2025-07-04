<?php
/**
 * Email Service
 * Handles email notifications and communications
 */

class EmailService {
    
    public static function sendNotification($to, $subject, $message, $type = 'info') {
        // In production, use a proper email service like PHPMailer, SendGrid, etc.
        // For now, we'll just log the email
        
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'to' => $to,
            'subject' => $subject,
            'message' => $message,
            'type' => $type,
            'status' => 'sent'
        ];
        
        // Log to file
        $logFile = __DIR__ . '/../logs/email.log';
        $logLine = json_encode($logEntry) . "\n";
        file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
        
        return true;
    }
    
    public static function sendLowStockAlert($userEmail, $itemName, $currentQuantity, $minLevel) {
        $subject = "Low Stock Alert - {$itemName}";
        $message = "
            <h2>Low Stock Alert</h2>
            <p>The following item is running low on stock:</p>
            <ul>
                <li><strong>Item:</strong> {$itemName}</li>
                <li><strong>Current Quantity:</strong> {$currentQuantity}</li>
                <li><strong>Minimum Level:</strong> {$minLevel}</li>
            </ul>
            <p>Please consider restocking this item soon.</p>
        ";
        
        return self::sendNotification($userEmail, $subject, $message, 'warning');
    }
    
    public static function sendWelcomeEmail($userEmail, $firstName, $temporaryPassword) {
        $subject = "Welcome to EskillVisor";
        $message = "
            <h2>Welcome to EskillVisor, {$firstName}!</h2>
            <p>Your account has been created successfully.</p>
            <p><strong>Login Details:</strong></p>
            <ul>
                <li><strong>Email:</strong> {$userEmail}</li>
                <li><strong>Temporary Password:</strong> {$temporaryPassword}</li>
            </ul>
            <p>Please log in and change your password as soon as possible.</p>
            <p><a href='http://localhost:5173'>Access EskillVisor</a></p>
        ";
        
        return self::sendNotification($userEmail, $subject, $message, 'info');
    }
    
    public static function sendPasswordResetEmail($userEmail, $resetToken) {
        $subject = "Password Reset Request";
        $resetLink = "http://localhost:5173/reset-password?token={$resetToken}";
        $message = "
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password.</p>
            <p>Click the link below to reset your password:</p>
            <p><a href='{$resetLink}'>Reset Password</a></p>
            <p>If you did not request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
        ";
        
        return self::sendNotification($userEmail, $subject, $message, 'info');
    }
}
