<?php
require_once __DIR__ . '/../utils/JsonHandler.php';

class User {
    public static function getAll() {
        $data = JsonHandler::readJson('users.json');
        return $data['users'] ?? [];
    }
    
    public static function getById($id) {
        $users = self::getAll();
        foreach ($users as $user) {
            if ($user['id'] == $id) {
                return $user;
            }
        }
        return null;
    }
    
    public static function getByEmail($email) {
        $users = self::getAll();
        foreach ($users as $user) {
            if (strtolower($user['email']) === strtolower($email)) {
                return $user;
            }
        }
        return null;
    }
    
    public static function create($userData) {
        $users = self::getAll();
        
        // Validate required fields
        if (empty($userData['name']) || empty($userData['email']) || empty($userData['role'])) {
            throw new Exception('Missing required fields');
        }
        
        // Check if email exists
        if (self::getByEmail($userData['email'])) {
            throw new Exception('Email already exists');
        }

        $newId = JsonHandler::getNextId($users);
        $userData['id'] = $newId;
        $users[] = $userData;
        JsonHandler::writeJson('users.json', ['users' => $users]);
        return $userData;
    }
    
    public static function update($id, $userData) {
        $users = self::getAll();
        foreach ($users as &$user) {
            if ($user['id'] == $id) {
                $user = array_merge($user, $userData);
                JsonHandler::writeJson('users.json', ['users' => $users]);
                return $user;
            }
        }
        throw new Exception('User not found');
    }
    
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
}
?>