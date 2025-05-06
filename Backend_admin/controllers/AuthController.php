<?php
require_once __DIR__ . '/../models/auth.php';
require_once __DIR__ . '/../models/user.php';

class AuthController {
    public function login() {
        header('Content-Type: application/json');
        
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (empty($input['email']) || empty($input['password'])) {
                throw new Exception('Email and password are required');
            }

            $user = Auth::login($input['email'], $input['password']);
            echo json_encode([
                'message' => 'Login successful',
                'user' => $user
            ]);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function logout() {
        header('Content-Type: application/json');
        try {
            Auth::logout();
            echo json_encode(['message' => 'Logged out successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function checkAuth() {
        header('Content-Type: application/json');
        try {
            $user = Auth::check();
            echo json_encode([
                'authenticated' => true,
                'user' => $user
            ]);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function authenticate($requiredRole = null) {
        try {
            $user = Auth::check();
            
            if ($requiredRole && $user['role'] !== $requiredRole) {
                throw new Exception('Insufficient permissions');
            }
            
            return $user;
        } catch (Exception $e) {
            http_response_code($e->getMessage() === 'Insufficient permissions' ? 403 : 401);
            echo json_encode(['error' => $e->getMessage()]);
            exit;
        }
    }
}
?>