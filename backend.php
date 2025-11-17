<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

session_start();

$dataFile = __DIR__ . '/data.json';

if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode(['users' => [], 'items' => []], JSON_PRETTY_PRINT));
}

function readData() {
    global $dataFile;
    return json_decode(file_get_contents($dataFile), true);
}

function saveData($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

function response($arr) {
    echo json_encode($arr);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? ($_GET['action'] ?? '');

$data = readData();

switch ($action) {
    case 'signup':
        $name = trim($input['name'] ?? '');
        $email = strtolower(trim($input['email'] ?? ''));
        $password = $input['password'] ?? '';

        if (!$name || !$email || !$password) response(['success' => false, 'msg' => 'All fields required']);
        if (array_filter($data['users'], fn($u) => $u['email'] === $email)) response(['success' => false, 'msg' => 'Email already exists']);

        $id = uniqid();
        $data['users'][] = [
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'avatar' => ''
        ];
        saveData($data);

        $_SESSION['userId'] = $id;
        response(['success' => true, 'userId' => $id]);
        break;

    case 'login':
        $email = strtolower(trim($input['email'] ?? ''));
        $password = $input['password'] ?? '';
        $user = null;
        foreach ($data['users'] as $u) {
            if ($u['email'] === $email && password_verify($password, $u['password'])) {
                $user = $u;
                break;
            }
        }
        if (!$user) response(['success' => false, 'msg' => 'Invalid credentials']);

        $_SESSION['userId'] = $user['id'];
        response(['success' => true, 'user' => $user]);
        break;

    case 'logout':
        session_destroy();
        response(['success' => true]);
        break;

    case 'getItems':
        $uid = $_SESSION['userId'] ?? null;
        if (!$uid) response(['success' => false, 'msg' => 'Not logged in']);
        $items = array_values(array_filter($data['items'], fn($i) => $i['ownerId'] === $uid));
        response(['success' => true, 'items' => $items]);
        break;

case 'saveItem':
    $uid = $_SESSION['userId'] ?? null;
    if (!$uid) response(['success' => false, 'msg' => 'Not logged in']);

    $item = $input['item'] ?? null;
    if (!$item) response(['success' => false, 'msg' => 'Missing item']);

    $title = trim($item['title'] ?? '');

    if ($title === '') {
        response(['success' => false, 'msg' => 'Title cannot be empty']);
    }

    $items = $data['items'];

    foreach ($items as $i) {
        if (
            strtolower($i['title']) === strtolower($title) &&
            $i['ownerId'] === $uid &&
            $i['id'] !== ($item['id'] ?? '')
        ) {
            response(['success' => false, 'msg' => 'Duplicate title already exists']);
        }
    }

    $existingIndex = null;
    foreach ($items as $idx => $i) {
        if ($i['id'] === ($item['id'] ?? '') && $i['ownerId'] === $uid) {
            $existingIndex = $idx;
            break;
        }
    }

    $item['ownerId'] = $uid;

    if ($existingIndex !== null) {
        $items[$existingIndex] = $item;
    }
    else {
        $item['id'] = uniqid();
        $items[] = $item;
    }

    $data['items'] = $items;
    saveData($data);

    response(['success' => true]);
    break;


    case 'deleteItem':
        $uid = $_SESSION['userId'] ?? null;
        $id = $input['id'] ?? '';
        if (!$uid) response(['success' => false, 'msg' => 'Not logged in']);
        $data['items'] = array_values(array_filter($data['items'], fn($i) => !($i['id'] === $id && $i['ownerId'] === $uid)));
        saveData($data);
        response(['success' => true]);
        break;

    case 'getProfile':
        $uid = $_SESSION['userId'] ?? null;
        if (!$uid) response(['success' => false, 'msg' => 'Not logged in']);
        $user = array_values(array_filter($data['users'], fn($u) => $u['id'] === $uid))[0] ?? null;
        response(['success' => true, 'user' => $user]);
        break;

    case 'saveProfile':
        $uid = $_SESSION['userId'] ?? null;
        if (!$uid) response(['success' => false, 'msg' => 'Not logged in']);
        $name = trim($input['name'] ?? '');
        $avatar = $input['avatar'] ?? '';
        foreach ($data['users'] as &$u) {
            if ($u['id'] === $uid) {
                if ($name) $u['name'] = $name;
                if ($avatar) $u['avatar'] = $avatar;
                break;
            }
        }
        saveData($data);
        response(['success' => true]);
        break;

    default:
        response(['success' => false, 'msg' => 'Invalid action']);
}
?>

