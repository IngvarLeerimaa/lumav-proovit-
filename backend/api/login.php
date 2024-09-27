<?php
/**
 * Handles user authentication via HTTP POST requests, validates credentials, and returns a token for successful logins.
 * 
 * This function:
 * - Allows cross-origin requests (CORS) by setting appropriate headers.
 * - Handles preflight OPTIONS requests by responding with a 200 status code.
 * - For POST requests, extracts the Authorization header, decodes the base64-encoded credentials (email and password),
 *   and checks them against the stored credentials in the users.txt file.
 * - If the credentials match, it generates a random token, saves it to token.txt, and returns the token in the response.
 * - If the credentials do not match or the Authorization header is missing, it returns an appropriate error response.
 * - Responds with a 403 status code for invalid credentials and a 405 status code for unsupported HTTP methods.
 * 
 * This function is primarily used to authenticate users by checking their email and password, issuing a token for valid users.
 * 
 * @return void Responds with a JSON object containing the token or an error message.
 */

require_once __DIR__ . '/../vendor/autoload.php';

header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header missing']);
        exit;
    }

    $auth = $_SERVER['HTTP_AUTHORIZATION'];
    list(, $base64Credentials) = explode(' ', $auth);
    $credentials = base64_decode($base64Credentials);
    list($email, $password) = explode(':', $credentials);

    $users = file(__DIR__ . '/../config/users.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($users as $user) {
        list($storedEmail, $storedPassword) = explode(':', $user);
        
        if ($storedEmail == $email && $storedPassword == $password) {
            $token = bin2hex(random_bytes(16));

            file_put_contents(__DIR__ . '/../config/token.txt', $token);

            
            echo json_encode(['token' => $token]);
            exit;
        }
    }

    http_response_code(403);
    echo json_encode(['error' => 'Invalid email or password']);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
