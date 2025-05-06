<?php
require_once __DIR__ . '/user.php';

class Auth {
    public static function login($email, $password) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start([
                'cookie_lifetime' => 86400, // 1 day
                'cookie_secure' => true,
                'cookie_httponly' => true,
                'use_strict_mode' => true
            ]);
        }
        
        $user = User::verifyCredentials($email, $password);
        if (!$user) {
            throw new Exception('Invalid credentials');
        }

        $_SESSION['user'] = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'session_id' => session_id()
        ];

        return $_SESSION['user'];
    }

    public static function logout() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Clear session data
        $_SESSION = [];
        
        // Delete session cookie
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }
        
        session_destroy();
    }

    public static function check() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (empty($_SESSION['user'])) {
            throw new Exception('Not authenticated');
        }
        
        // Verify session hasn't been tampered with
        if ($_SESSION['user']['session_id'] !== session_id()) {
            self::logout();
            throw new Exception('Session invalid');
        }
        
        return $_SESSION['user'];
    }
}
?>