<?php
require_once __DIR__ . '/../models/User.php';

class UserController {
    public function getAllUsers() {
        header('Content-Type: application/json');
        echo json_encode(User::getAll());
    }
    
    public function getUser($id) {
        header('Content-Type: application/json');
        try {
            $user = User::getById($id);
            if ($user) {
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function createUser() {
        header('Content-Type: application/json');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $newUser = User::create($input);
            http_response_code(201);
            echo json_encode($newUser);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function updateUser($id) {
        header('Content-Type: application/json');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $updatedUser = User::update($id, $input);
            echo json_encode($updatedUser);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function deleteUser($id) {
        header('Content-Type: application/json');
        try {
            User::delete($id);
            echo json_encode(['message' => 'User deleted successfully']);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>