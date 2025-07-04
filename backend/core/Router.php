<?php
/**
 * Simple Router for API endpoints
 */

class Router {
    private $routes = [];
    private $middlewares = [];
    
    public function get($path, $handler) {
        $this->addRoute('GET', $path, $handler);
    }
    
    public function post($path, $handler) {
        $this->addRoute('POST', $path, $handler);
    }
    
    public function put($path, $handler) {
        $this->addRoute('PUT', $path, $handler);
    }
    
    public function delete($path, $handler) {
        $this->addRoute('DELETE', $path, $handler);
    }
    
    public function patch($path, $handler) {
        $this->addRoute('PATCH', $path, $handler);
    }
    
    private function addRoute($method, $path, $handler) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
            'pattern' => $this->convertToPattern($path)
        ];
    }
    
    private function convertToPattern($path) {
        // Convert {id} to named capture groups
        $pattern = preg_replace('/\{([^}]+)\}/', '(?P<$1>[^/]+)', $path);
        return '#^' . $pattern . '$#';
    }
    
    public function middleware($middleware) {
        $this->middlewares[] = $middleware;
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Remove the base path if it exists (for subdirectory installations)
        $basePath = '/EskillVisor/backend';
        if (strpos($path, $basePath) === 0) {
            $path = substr($path, strlen($basePath));
        }

        // Remove trailing slash except for root
        if ($path !== '/' && substr($path, -1) === '/') {
            $path = rtrim($path, '/');
        }

        // Default to root if path is empty
        if (empty($path)) {
            $path = '/';
        }

        logInfo("Handling request: {$method} {$path}");
        
        // Find matching route
        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['pattern'], $path, $matches)) {
                // Extract parameters
                $params = [];
                foreach ($matches as $key => $value) {
                    if (!is_numeric($key)) {
                        $params[$key] = $value;
                    }
                }
                
                // Run middlewares
                foreach ($this->middlewares as $middleware) {
                    if (!$this->runMiddleware($middleware, $path)) {
                        return;
                    }
                }
                
                // Execute handler
                $this->executeHandler($route['handler'], $params);
                return;
            }
        }
        
        // No route found
        Response::error('Route not found', 404);
    }
    
    private function runMiddleware($middleware, $path) {
        if (is_callable($middleware)) {
            return $middleware($path);
        }
        
        if (is_string($middleware)) {
            switch ($middleware) {
                case 'auth':
                    return Auth::middleware();
                case 'admin':
                    return Auth::adminMiddleware();
                case 'manager':
                    return Auth::managerMiddleware();
                default:
                    return true;
            }
        }
        
        return true;
    }
    
    private function executeHandler($handler, $params) {
        if (is_callable($handler)) {
            call_user_func($handler, $params);
            return;
        }
        
        if (is_string($handler) && strpos($handler, '@') !== false) {
            list($controllerName, $methodName) = explode('@', $handler);
            
            if (class_exists($controllerName)) {
                $controller = new $controllerName();
                
                if (method_exists($controller, $methodName)) {
                    $controller->$methodName($params);
                    return;
                }
            }
        }
        
        Response::error('Handler not found', 500);
    }
    
    public function group($prefix, $callback) {
        $originalRoutes = $this->routes;
        $this->routes = [];
        
        // Execute callback to define routes
        $callback($this);
        
        // Add prefix to all new routes
        $newRoutes = $this->routes;
        foreach ($newRoutes as &$route) {
            $route['path'] = $prefix . $route['path'];
            $route['pattern'] = $this->convertToPattern($route['path']);
        }
        
        // Merge with original routes
        $this->routes = array_merge($originalRoutes, $newRoutes);
    }
    
    public static function redirect($url, $code = 302) {
        header("Location: {$url}", true, $code);
        exit();
    }
    
    public static function getCurrentPath() {
        return parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    }
    
    public static function getCurrentMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }
    
    public static function getQueryParams() {
        return $_GET;
    }
    
    public static function getPostData() {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (json_last_error() === JSON_ERROR_NONE) {
            return $data;
        }
        
        return $_POST;
    }
    
    public static function getHeaders() {
        return getallheaders();
    }
    
    public static function getHeader($name, $default = null) {
        $headers = self::getHeaders();
        return $headers[$name] ?? $default;
    }
}
