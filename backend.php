<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$dataFile = "data.json";

// Make sure the file exists
if (!file_exists($dataFile)) {
  file_put_contents($dataFile, json_encode([]));
}

// Read data
$items = json_decode(file_get_contents($dataFile), true);
if (!is_array($items)) $items = [];

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
  // 🔹 Read all items
  case "GET":
    echo json_encode($items);
    break;

  // 🔹 Create new item (with duplicate check)
  case "POST":
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input || empty($input["title"])) {
      http_response_code(400);
      echo json_encode(["error" => "Invalid input"]);
      exit;
    }

    $title = strtolower(trim($input["title"]));

    // Check for duplicates (case-insensitive)
    foreach ($items as $item) {
      if (strtolower(trim($item["title"])) === $title) {
        http_response_code(409);
        echo json_encode(["error" => "Title already exists!"]);
        exit;
      }
    }

    $newItem = [
      "id" => uniqid(),
      "title" => $input["title"],
      "status" => $input["status"] ?? "Plan to Watch",
      "genre" => $input["genre"] ?? "",
      "notes" => $input["notes"] ?? ""
    ];

    $items[] = $newItem;
    file_put_contents($dataFile, json_encode($items, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true, "item" => $newItem]);
    break;

  // 🔹 Update existing item
  case "PUT":
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input || empty($input["id"])) {
      http_response_code(400);
      echo json_encode(["error" => "Invalid ID"]);
      exit;
    }

    foreach ($items as &$item) {
      if ($item["id"] == $input["id"]) {
        $item = array_merge($item, $input);
      }
    }

    file_put_contents($dataFile, json_encode($items, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true]);
    break;

  // 🔹 Delete item
  case "DELETE":
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input || empty($input["id"])) {
      http_response_code(400);
      echo json_encode(["error" => "Invalid ID"]);
      exit;
    }

    $items = array_values(array_filter($items, fn($i) => $i["id"] !== $input["id"]));
    file_put_contents($dataFile, json_encode($items, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true]);
    break;

  default:
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>

