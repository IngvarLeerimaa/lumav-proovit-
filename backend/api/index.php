<?php
/**
 * Handles authenticated GET requests to crawl websites and return the extracted data as a JSON response.
 * 
 * This function:
 * - Allows cross-origin requests (CORS) by setting appropriate headers for all origins.
 * - Handles OPTIONS preflight requests by responding with a 200 status code to ensure proper CORS support.
 * - For GET requests, it checks the presence of an Authorization header and validates the provided token
 *   against the token stored in config/token.txt. If the token is valid, it triggers the website crawling
 *   process by calling the crawlWebsites function.
 * - If the token is invalid or missing, it responds with a 401 or 403 HTTP status code and an error message.
 * - If the request method is not supported (i.e., not GET or OPTIONS), it returns a 405 status code indicating
 *   that the method is not allowed.
 * 
 * This function is used to ensure secure access to the website crawling feature via token-based authentication
 * and to return the crawled data in a JSON format.
 * 
 * @return void Responds with the crawled data in JSON format or an error message for unauthorized or unsupported requests.
 */

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../api/crawler.php';


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
    $savedToken = trim(file_get_contents(__DIR__ . '/../config/token.txt', $token));
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
