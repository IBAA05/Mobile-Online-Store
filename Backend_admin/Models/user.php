<?php
require_once __DIR__ . '/../utils/JsonHandler.php';

class User {
    /**
     * Get all users
     * @return array List of users
     */
    public static function getAll() {
        $data = JsonHandler::readJson('users.json');
        return $data['users'] ?? [];
    }
    
    /**
     * Get user by ID
     * @param int $id User ID
     * @return array|null User data or null if not found
     */
    public static function getById($id) {
        $users = self::getAll();
        foreach ($users as $user) {
            if ($user['id'] == $id) {
                return $user;
            }
        }
        return null;
    }
    
    /**
     * Get user by email
     * @param string $email User email
     * @return array|null User data or null if not found
     */
    public static function getByEmail($email) {
        $users = self::getAll();
        foreach ($users as $user) {
            if (strtolower($user['email']) === strtolower($email)) {
                return $user;
            }
        }
        return null;
    }
    
    /**
     * Create new user
     * @param array $userData User data
     * @return array Created user
     * @throws Exception If validation fails
     */
    public static function create($userData) {
        $users = self::getAll();
        
        // Validate required fields
        if (empty($userData['name']) || empty($userData['email']) || empty($userData['password'])) {
            throw new Exception('Name, email and password are required');
        }
        
        // Validate email format
        if (!filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }
        
        // Check if email exists
        if (self::getByEmail($userData['email'])) {
            throw new Exception('Email already exists');
        }

        // Hash password
        $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);
        
        // Set default role if not provided
        if (!isset($userData['role'])) {
            $userData['role'] = 'user';
        }
        
        // Set default status if not provided
        if (!isset($userData['status'])) {
            $userData['status'] = 'active';
        }

        $newId = JsonHandler::getNextId($users);
        $userData['id'] = $newId;
        $users[] = $userData;
        JsonHandler::writeJson('users.json', ['users' => $users]);
        return $userData;
    }
    
    /**
     * Update user
     * @param int $id User ID
     * @param array $userData Updated user data
     * @return array Updated user
     * @throws Exception If user not found
     */
    public static function update($id, $userData) {
        $users = self::getAll();
        foreach ($users as &$user) {
            if ($user['id'] == $id) {
                // Don't allow changing email if provided
                if (isset($userData['email']) && $userData['email'] !== $user['email']) {
                    throw new Exception('Email cannot be changed');
                }
                
                // Hash new password if provided
                if (isset($userData['password'])) {
                    $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);
                }
                
                $user = array_merge($user, $userData);
                JsonHandler::writeJson('users.json', ['users' => $users]);
                return $user;
            }
        }
        throw new Exception('User not found');
    }
    
    /**
     * Delete user
     * @param int $id User ID
     * @return bool True if deleted
     * @throws Exception If user not found
     */
    public static function delete($id) {
        $users = self::getAll();
        $newUsers = array_filter($users, function($user) use ($id) {
            return $user['id'] != $id;
        });
        
        if (count($users) === count($newUsers)) {
            throw new Exception('User not found');
        }
        
        JsonHandler::writeJson('users.json', ['users' => array_values($newUsers)]);
        return true;
    }
    
    /**
     * Change user status
     * @param int $id User ID
     * @param string $status New status (active/blocked)
     * @return array Updated user
     * @throws Exception If invalid status or user not found
     */
    public static function changeStatus($id, $status) {
        if (!in_array($status, ['active', 'blocked'])) {
            throw new Exception('Invalid status');
        }
        
        $users = self::getAll();
        foreach ($users as &$user) {
            if ($user['id'] == $id) {
                $user['status'] = $status;
                JsonHandler::writeJson('users.json', ['users' => $users]);
                return $user;
            }
        }
        throw new Exception('User not found');
    }
    
    /**
     * Change user role
     * @param int $id User ID
     * @param string $role New role (admin/user)
     * @return array Updated user
     * @throws Exception If invalid role or user not found
     */
    public static function changeRole($id, $role) {
        if (!in_array($role, ['admin', 'user'])) {
            throw new Exception('Invalid role');
        }
        
        $users = self::getAll();
        foreach ($users as &$user) {
            if ($user['id'] == $id) {
                $user['role'] = $role;
                JsonHandler::writeJson('users.json', ['users' => $users]);
                return $user;
            }
        }
        throw new Exception('User not found');
    }
    
    /**
     * Verify user credentials
     * @param string $email User email
     * @param string $password User password
     * @return array|null User data if valid, null otherwise
     */
    public static function verifyCredentials($email, $password) {
        $user = self::getByEmail($email);
        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }
        return null;
    }
}
?>