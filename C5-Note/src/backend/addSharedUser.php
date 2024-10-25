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

// Read input from frontend
$input = json_decode(file_get_contents("php://input"), true);
$notebookId = $input['notebook_id'];
$newUsername = $input['username'];

try {
    // Check if the user exists in the 'users' table
    $stmtUser = $connection->prepare("SELECT username FROM users WHERE username = ?");
    $stmtUser->bind_param("s", $newUsername);
    $stmtUser->execute();
    $resultUser = $stmtUser->get_result();

    if ($resultUser->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "User does not exist"]);
        exit();
    }

    // Check if the user already has access to the notebook
    $stmtCheck = $connection->prepare("SELECT * FROM shared_users WHERE notebook_id = ? AND username = ?");
    $stmtCheck->bind_param("is", $notebookId, $newUsername);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();

    if ($resultCheck->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "User already has access"]);
        exit();
    }

    // can now insert the new user into shared_users table
    $stmt = $connection->prepare("INSERT INTO shared_users (notebook_id, username) VALUES (?, ?)");
    $stmt->bind_param("is", $notebookId, $newUsername);
    $stmt->execute();

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to add shared user"
    ]);
}

$connection->close();

?>
