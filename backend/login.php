<?php
require_once __DIR__ . '/vendor/autoload.php';  

// Set headers to allow cross-origin requests (CORS)
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Handle login request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Extract the Authorization header from $_SERVER superglobal
    if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header missing']);
        exit;
    }

    // Extract base64 credentials from Authorization header
    $auth = $_SERVER['HTTP_AUTHORIZATION'];
    list(, $base64Credentials) = explode(' ', $auth);
    $credentials = base64_decode($base64Credentials);
    list($email, $password) = explode(':', $credentials);

    // Load the users from the text file (users.txt)
    $users = file('users.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    // Find the user by email and password
    foreach ($users as $user) {
        list($storedEmail, $storedPassword) = explode(':', $user);
        
        // Check if the email and password match
        if ($storedEmail == $email && $storedPassword == $password) {
            // Generate a simple token (in real applications, use JWT or more secure tokens)
            $token = bin2hex(random_bytes(16)); // Generate a random token

            // Respond with the token
            echo json_encode(['token' => $token]);
            exit;
        }
    }

    // If authentication fails
    http_response_code(403);
    echo json_encode(['error' => 'Invalid email or password']);
    exit;
}

// If request method is not POST
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
