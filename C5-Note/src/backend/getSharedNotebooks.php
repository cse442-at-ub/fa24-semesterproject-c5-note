<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);

if ($connection->connect_error) {
    die("Could not connect to the database");
}

// Reading input data
$input = json_decode(file_get_contents("php://input"), true);
if (isset($_COOKIE['token'])) {
    $token = hash("sha256",$_COOKIE['token']);
} else {
    die(json_encode(["error" => "Token cookie is not set.", "token" => null])); // Added null value for token
}

// Prepare statement to get user_id based on the token
$smto = $connection->prepare("SELECT user_id FROM active_users WHERE token = ?");
$smto->bind_param("s", $token);
$smto->execute();
$resulto = $smto->get_result();

if ($resulto->num_rows === 0) {
    die(json_encode(["error" => "Invalid token."]));
}

$user = $resulto->fetch_assoc();
$user_id = $user['user_id'];
$smto->close();

// Prepare statement to get username based on user_id
$smto = $connection->prepare("SELECT username FROM users WHERE user_id = ?");
$smto->bind_param("i", $user_id);
$smto->execute();
$username_result = $smto->get_result();

if ($username_result->num_rows === 0) {
    die(json_encode(["error" => "User not found."]));
}

$username_found = $username_result->fetch_assoc()['username'];
$smto->close();


$loggedInUsername = $username_found;

try {
    // Query to get notebook IDs from shared_users table where the user has access
    $stmt = $connection->prepare("SELECT notebook_id FROM shared_users WHERE username = ?");
    $stmt->bind_param("s", $loggedInUsername);
    $stmt->execute();
    
    $result = $stmt->get_result();

    $notebookIds = [];
    while ($row = $result->fetch_assoc()) {
        $notebookIds[] = $row['notebook_id'];
    }

    // If there are shared notebooks, fetch their details
    if (!empty($notebookIds)) {
        $placeholders = implode(',', array_fill(0, count($notebookIds), '?'));
        $types = str_repeat('i', count($notebookIds));  // Prepare types for the bind_param call
        $stmtNotebooks = $connection->prepare("SELECT id, title, description, color FROM notebooks WHERE id IN ($placeholders)");
        
        $stmtNotebooks->bind_param($types, ...$notebookIds); // Bind all notebook IDs dynamically
        $stmtNotebooks->execute();
        $resultNotebooks = $stmtNotebooks->get_result();
        
        $notebooks = [];
        while ($row = $resultNotebooks->fetch_assoc()) {
            $notebooks[] = $row;
        }

        echo json_encode($notebooks);
    } else {
        // No shared notebooks found
        echo json_encode([]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "500",
        "message" => "Database query failed"
    ]);
}

$connection->close();

?>
