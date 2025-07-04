<?php
/**
 * HTTP Response Helper Class
 */

class Response {
    
    public static function json($data, $statusCode = 200, $headers = []) {
        http_response_code($statusCode);
        
        // Set default headers
        header('Content-Type: application/json');
        
        // Set custom headers
        foreach ($headers as $key => $value) {
            header("{$key}: {$value}");
        }
        
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit();
    }
    
    public static function success($data = null, $message = 'Success', $statusCode = 200) {
        $response = [
            'success' => true,
            'message' => $message,
            'timestamp' => date('c')
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        self::json($response, $statusCode);
    }
    
    public static function error($message = 'Error', $statusCode = 400, $data = null) {
        $response = [
            'success' => false,
            'message' => $message,
            'timestamp' => date('c')
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        // Log error for debugging
        logError("API Error ({$statusCode}): {$message}", $data);
        
        self::json($response, $statusCode);
    }
    
    public static function created($data = null, $message = 'Created successfully') {
        self::success($data, $message, 201);
    }
    
    public static function updated($data = null, $message = 'Updated successfully') {
        self::success($data, $message, 200);
    }
    
    public static function deleted($message = 'Deleted successfully') {
        self::success(null, $message, 200);
    }
    
    public static function notFound($message = 'Resource not found') {
        self::error($message, 404);
    }
    
    public static function unauthorized($message = 'Unauthorized') {
        self::error($message, 401);
    }
    
    public static function forbidden($message = 'Forbidden') {
        self::error($message, 403);
    }
    
    public static function validationError($errors, $message = 'Validation failed') {
        self::error($message, 422, ['errors' => $errors]);
    }
    
    public static function serverError($message = 'Internal server error') {
        self::error($message, 500);
    }
    
    public static function badRequest($message = 'Bad request') {
        self::error($message, 400);
    }
    
    public static function conflict($message = 'Conflict') {
        self::error($message, 409);
    }
    
    public static function tooManyRequests($message = 'Too many requests') {
        self::error($message, 429);
    }
    
    public static function paginated($data, $total, $page, $limit, $message = 'Success') {
        $totalPages = ceil($total / $limit);
        
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $data,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1,
                'next_page' => $page < $totalPages ? $page + 1 : null,
                'prev_page' => $page > 1 ? $page - 1 : null
            ],
            'timestamp' => date('c')
        ];
        
        self::json($response, 200);
    }
    
    public static function file($filePath, $fileName = null, $mimeType = null) {
        if (!file_exists($filePath)) {
            self::notFound('File not found');
            return;
        }
        
        if (!$fileName) {
            $fileName = basename($filePath);
        }
        
        if (!$mimeType) {
            $mimeType = mime_content_type($filePath) ?: 'application/octet-stream';
        }
        
        header('Content-Type: ' . $mimeType);
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        header('Content-Length: ' . filesize($filePath));
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: 0');
        
        readfile($filePath);
        exit();
    }
    
    public static function download($filePath, $fileName = null) {
        self::file($filePath, $fileName, 'application/octet-stream');
    }
    
    public static function redirect($url, $statusCode = 302) {
        header("Location: {$url}", true, $statusCode);
        exit();
    }
    
    public static function cors($allowedOrigins = ['*'], $allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], $allowedHeaders = ['Content-Type', 'Authorization']) {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        if (in_array('*', $allowedOrigins) || in_array($origin, $allowedOrigins)) {
            header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
        }
        
        header('Access-Control-Allow-Methods: ' . implode(', ', $allowedMethods));
        header('Access-Control-Allow-Headers: ' . implode(', ', $allowedHeaders));
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400'); // 24 hours
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
    
    public static function cache($seconds = 3600) {
        header('Cache-Control: public, max-age=' . $seconds);
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $seconds) . ' GMT');
    }
    
    public static function noCache() {
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
    }
    
    public static function setHeader($name, $value) {
        header("{$name}: {$value}");
    }
    
    public static function getStatusText($code) {
        $statusTexts = [
            200 => 'OK',
            201 => 'Created',
            204 => 'No Content',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            409 => 'Conflict',
            422 => 'Unprocessable Entity',
            429 => 'Too Many Requests',
            500 => 'Internal Server Error'
        ];
        
        return $statusTexts[$code] ?? 'Unknown Status';
    }
}
