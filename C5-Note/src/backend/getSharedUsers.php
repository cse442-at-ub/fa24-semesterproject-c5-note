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

$input = json_decode(file_get_contents("php://input"), true);
$notebookId = $input['notebook_id'];

try {
    // Fetch usernames from shared_users table for the given notebook_id
    $stmt = $connection->prepare("SELECT username FROM shared_users WHERE notebook_id = ?");
    $stmt->bind_param("i", $notebookId);
    $stmt->execute();
    $result = $stmt->get_result();

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row['username'];
    }

    echo json_encode(["success" => true, "users" => $users]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch shared users"
    ]);
}

$connection->close();

?>
