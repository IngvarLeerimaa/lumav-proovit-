<?php
require_once __DIR__ . '/vendor/autoload.php';  
require_once 'crawler.php';

//API key kontroll
// if (!isset($_GET['api_key']) || $_GET['api_key'] !== API_KEY) {
//     http_response_code(403);
//     echo json_encode(['error' => 'Unauthorized']);
//     exit;
// }

// Käivita veebilehe kaapimise funktsioon
$result = crawlWebsites();

header('Content-Type: application/json');
echo json_encode($result);
?>
