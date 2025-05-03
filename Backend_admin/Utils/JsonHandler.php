<?php
class JsonHandler {
    private static $dataPath = __DIR__ . '/../data/';
    
    public static function readJson($filename) {
        $filepath = self::$dataPath . $filename;
        if (!file_exists($filepath)) {
            return [];
        }
        $json = file_get_contents($filepath);
        return json_decode($json, true);
    }
    
    public static function writeJson($filename, $data) {
        $filepath = self::$dataPath . $filename;
        $json = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents($filepath, $json);
    }
    
    public static function getNextId($items) {
        return max(array_column($items, 'id')) + 1;
    }
}
?>