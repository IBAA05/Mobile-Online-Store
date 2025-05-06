<?php
require_once __DIR__ . '/../utils/JsonHandler.php';

class User {
    private static $usersFile = 'users.json';
    
    public static function getAll() {
        $data = JsonHandler::readJson(self::$usersFile);
        $users = $data['users'] ?? [];
        
        // Remove passwords from returned data
        return array_map(function($user) {
            unset($user['password']);
            return $user;
        }, $users);
    }
    
    public static function getById($id, $includePassword = false) {
        $users = JsonHandler::readJson(self::$usersFile)['users'] ?? [];
        foreach ($users as $user) {
            if ($user['id'] == $id) {
                if (!$includePassword) {
                    unset($user['password']);
                }
                return $user;
            }
        }
        return null;
    }
    
    public static function getByEmail($email, $includePassword = false) {
        $users = JsonHandler::readJson(self::$usersFile)['users'] ?? [];
        foreach ($users as $user) {
            if (strtolower($user['email']) === strtolower($email)) {
                if (!$includePassword) {
                    unset($user['password']);
                }
                return $user;
            }
        }
        return null;
    }
    
    public static function create($userData) {
        $data = JsonHandler::readJson(self::$usersFile);
        $users = $data['users'] ?? [];
        
        // Validation
        if (empty($userData['name'])) {
            throw new Exception('Name is required');
        }
        
        if (empty($userData['email']) || !filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Valid email is required');
        }
        
        if (empty($userData['password']) || strlen($userData['password']) < 8) {
            throw new Exception('Password must be at least 8 characters');
        }
        
        if (self::getByEmail($userData['email'], true)) {
            throw new Exception('Email already exists');
        }

        // Prepare user data (store password in plaintext)
        $newUser = [
            'id' => JsonHandler::getNextId($users),
            'name' => trim($userData['name']),
            'email' => strtolower(trim($userData['email'])),
            'password' => $userData['password'], // Store plaintext password
            'role' => $userData['role'] ?? 'client', // Default role is now 'client'
            'status' => $userData['status'] ?? 'active',
            'created_at' => date('Y-m-d H:i:s')
        ];

        $users[] = $newUser;
        JsonHandler::writeJson(self::$usersFile, ['users' => $users]);
        
        // Don't return password
        unset($newUser['password']);
        return $newUser;
    }
    
    public static function update($id, $updateData) {
        $data = JsonHandler::readJson(self::$usersFile);
        $users = $data['users'] ?? [];
        $found = false;
        
        foreach ($users as &$user) {
            if ($user['id'] == $id) {
                $found = true;
                
                // Prevent email changes
                if (isset($updateData['email']) && $updateData['email'] !== $user['email']) {
                    throw new Exception('Email cannot be changed');
                }
                
                // Update password in plaintext if provided
                if (!empty($updateData['password'])) {
                    if (strlen($updateData['password']) < 8) {
                        throw new Exception('Password must be at least 8 characters');
                    }
                    $user['password'] = $updateData['password']; // Store plaintext password
                }
                
                // Update other fields
                if (!empty($updateData['name'])) {
                    $user['name'] = trim($updateData['name']);
                }
                
                if (isset($updateData['status'])) {
                    $user['status'] = $updateData['status'];
                }
                
                $user['updated_at'] = date('Y-m-d H:i:s');
                break;
            }
        }
        
        if (!$found) {
            throw new Exception('User not found');
        }
        
        JsonHandler::writeJson(self::$usersFile, ['users' => $users]);
        
        // Return updated user without password
        $updatedUser = $user;
        unset($updatedUser['password']);
        return $updatedUser;
    }
    
    public static function delete($id) {
        $data = JsonHandler::readJson(self::$usersFile);
        $users = $data['users'] ?? [];
        $initialCount = count($users);
        
        $users = array_filter($users, function($user) use ($id) {
            return $user['id'] != $id;
        });
        
        if (count($users) === $initialCount) {
            throw new Exception('User not found');
        }
        
        JsonHandler::writeJson(self::$usersFile, ['users' => array_values($users)]);
        return true;
    }
    
    public static function verifyCredentials($email, $password) {
        $user = self::getByEmail($email, true);
        if ($user && $user['password'] === $password) { // Compare plaintext passwords
            unset($user['password']);
            return $user;
        }
        return null;
    }
    
    public static function changeStatus($id, $status) {
        $validStatuses = ['active', 'blocked'];
        if (!in_array($status, $validStatuses)) {
            throw new Exception('Status must be: ' . implode(', ', $validStatuses));
        }
        
        return self::update($id, ['status' => $status]);
    }
    
    public static function changeRole($id, $role) {
        $validRoles = ['admin', 'client']; // Only these two roles are valid now
        if (!in_array($role, $validRoles)) {
            throw new Exception('Role must be: ' . implode(', ', $validRoles));
        }
        
        return self::update($id, ['role' => $role]);
    }
}
?>