<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// Check if file exists
$file = 'data.json';
if (!file_exists($file)) {
  file_put_contents($file, json_encode([]));
}

$data = json_decode(file_get_contents($file), true) ?? [];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
  case 'GET':
    echo json_encode($data);
    break;
  
  // Add new entry
  case 'POST':
    $input = json_decode(file_get_contents("php://input"), true);
    if (empty($input['title'])) {
      echo json_encode(["success" => false, "error" => "Title is required"]);
      exit;
    }
    $input['id'] = uniqid();
    $data[] = $input;
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
    echo json_encode(["success" => true]);
    break;
  
  // Update entry
  case 'PUT':
    $input = json_decode(file_get_contents("php://input"), true);
    foreach ($data as &$item) {
      if ($item['id'] == $input['id']) {
        $item = array_merge($item, $input);
        break;
      }
    }
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
    echo json_encode(["success" => true]);
    break;

  // Delete entry
  case 'DELETE':
    $input = json_decode(file_get_contents("php://input"), true);
    $data = array_filter($data, fn($item) => $item['id'] != $input['id']);
    file_put_contents($file, json_encode(array_values($data), JSON_PRETTY_PRINT), LOCK_EX);
    echo json_encode(["success" => true]);
    break;

  default:
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method Not Allowed"]);
    break;
}
?>

