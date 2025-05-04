<?php
require_once __DIR__ . '/JwtHandler.php';

class Middleware {
    public static function authenticate($requiredRole = null) {
        // Try different ways to get the header
        $token = self::getBearerToken();
        
        if (!$token) {
            http_response_code(401);
            echo json_encode(['error' => 'Authorization header missing']);
            exit;
        }

        $decoded = JwtHandler::validate($token);
        if (!$decoded) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            exit;
        }
        
        if ($requiredRole && $decoded['role'] !== $requiredRole) {
            http_response_code(403);
            echo json_encode(['error' => 'Insufficient privileges']);
            exit;
        }
        
        return $decoded;
    }

    private static function getBearerToken() {
        $headers = null;
        
        // Try Apache headers first
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                return str_replace('Bearer ', '', $headers['Authorization']);
            }
        }
        
        // Fallback to $_SERVER
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            return str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
        }
        
        // Final fallback
        if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            return str_replace('Bearer ', '', $_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        }
        
        return null;
    }
}
?>