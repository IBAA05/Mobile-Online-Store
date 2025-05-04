<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/JwtHandler.php';

class AuthController {
    public function login() {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['email']) || empty($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            return;
        }

        $user = User::verifyCredentials($input['email'], $input['password']);
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            return;
        }

        if ($user['status'] !== 'active') {
            http_response_code(403);
            echo json_encode(['error' => 'Account is blocked']);
            return;
        }

        $jwt = JwtHandler::generate([
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);

        // Don't return password hash
        unset($user['password']);

        echo json_encode([
            'token' => $jwt,
            'user' => $user
        ]);
    }

    public function signup() {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        
        try {
            $input['role'] = 'user'; // Force user role for signups
            $input['status'] = 'active';
            
            $newUser = User::create($input);
            
            // Generate token for immediate login
            $jwt = JwtHandler::generate([
                'id' => $newUser['id'],
                'email' => $newUser['email'],
                'role' => $newUser['role']
            ]);
            
            // Don't return password hash
            unset($newUser['password']);

            http_response_code(201);
            echo json_encode([
                'token' => $jwt,
                'user' => $newUser
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>