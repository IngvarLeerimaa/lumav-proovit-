<?php
require_once __DIR__ . '/vendor/autoload.php';  
require_once 'crawler.php';

// Set headers to allow cross-origin requests (CORS)
header('Access-Control-Allow-Origin: *');  // Lubab päringud kõikidest päritoludest
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');  // Lubab vajalikud meetodid
header('Access-Control-Allow-Headers: Content-Type, Authorization');  // Lubab vajalikud päised

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$result = crawlWebsites();

header('Content-Type: application/json');
echo json_encode($result);
?>
