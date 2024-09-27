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

if ($_SERVER['REQUEST_METHOD'] == 'GET'){

    if(!isset($_SERVER['HTTP_AUTHORIZATION'])){
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header missing']);
        exit;
    }

    $auth = $_SERVER['HTTP_AUTHORIZATION'];
    list(, $token) = explode(' ', $auth);
    $savedToken = trim(file_get_contents('token.txt'));
    if ($token !== $savedToken){
        http_response_code(403);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }
    $result = crawlWebsites();
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
