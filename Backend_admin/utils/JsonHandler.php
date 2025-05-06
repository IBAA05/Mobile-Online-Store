<?php
class JsonHandler {
    private static $dataPath = __DIR__ . '/../data/';
    
    public static function readJson($filename) {
        $filepath = self::$dataPath . $filename;
        
        if (!file_exists($filepath)) {
            if (!is_dir(self::$dataPath)) {
                mkdir(self::$dataPath, 0755, true);
            }
            file_put_contents($filepath, json_encode(['users' => []]));
        }
        
        $json = file_get_contents($filepath);
        if ($json === false) {
            throw new Exception("Failed to read file: $filename");
        }
        
        $data = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON in file: $filename");
        }
        
        return $data;
    }
    
    public static function writeJson($filename, $data) {
        $filepath = self::$dataPath . $filename;
        
        if (!is_dir(self::$dataPath)) {
            mkdir(self::$dataPath, 0755, true);
        }
        
        $json = json_encode($data, JSON_PRETTY_PRINT);
        if ($json === false) {
            throw new Exception("Failed to encode JSON data");
        }
        
        $result = file_put_contents($filepath, $json, LOCK_EX);
        if ($result === false) {
            throw new Exception("Failed to write to file: $filename");
        }
        
        return true;
    }
    
    public static function getNextId($items) {
        if (empty($items)) {
            return 1;
        }
        $ids = array_column($items, 'id');
        return empty($ids) ? 1 : (max($ids) + 1);
    }
}
?>