<?php
class JwtHandler {
    private static $secret = 'your-256-bit-secret'; // MUST MATCH IN ALL INSTANCES
    private static $algorithm = 'HS256';

    public static function generate($payload) {
        try {
            $header = json_encode(['typ' => 'JWT', 'alg' => self::$algorithm]);
            $payload = json_encode(array_merge($payload, [
                'iat' => time(),
                'exp' => time() + (60 * 60 * 24) // 24 hour expiration
            ]));
            
            $base64UrlHeader = self::base64UrlEncode($header);
            $base64UrlPayload = self::base64UrlEncode($payload);
            
            $signature = hash_hmac('sha256', $base64UrlHeader.".".$base64UrlPayload, self::$secret, true);
            $base64UrlSignature = self::base64UrlEncode($signature);
            
            return $base64UrlHeader.".".$base64UrlPayload.".".$base64UrlSignature;
        } catch (Exception $e) {
            error_log("JWT Generation Error: ".$e->getMessage());
            return false;
        }
    }

    public static function validate($token) {
        try {
            if (empty($token)) {
                error_log("Empty token provided");
                return false;
            }
            
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                error_log("Invalid token structure");
                return false;
            }
            
            list($header, $payload, $signature) = $parts;
            
            // Verify signature
            $verified = hash_hmac('sha256', $header.".".$payload, self::$secret, true);
            $verified = self::base64UrlEncode($verified);
            
            if (!hash_equals($verified, $signature)) {
                error_log("Invalid token signature");
                return false;
            }
            
            $payload = json_decode(self::base64UrlDecode($payload), true);
            
            // Check expiration
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                error_log("Token expired");
                return false;
            }
            
            return $payload;
        } catch (Exception $e) {
            error_log("JWT Validation Error: ".$e->getMessage());
            return false;
        }
    }
    
    private static function base64UrlEncode($data) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }
    
    private static function base64UrlDecode($data) {
        $padded = str_replace(['-', '_'], ['+', '/'], $data);
        $modulus = strlen($padded) % 4;
        if ($modulus) {
            $padded .= str_repeat('=', 4 - $modulus);
        }
        return base64_decode($padded);
    }
}
?>