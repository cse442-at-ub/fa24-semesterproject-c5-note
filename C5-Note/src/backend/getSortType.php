<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

// Create a database connection
$connection = new mysqli("localhost", $username, $password, $db_name, 3306);

if ($connection->connect_error) {
    die(json_encode(["status" => "500", "message" => "Could not connect to the database"]));
}

// Reading input data
$input = json_decode(file_get_contents("php://input"), true);
$loggedInUsername = $input['username']; // This is the username sent from the frontend

try {
    $st = $connection->prepare("SELECT sort FROM users WHERE username = ?");
    $st->bind_param("s", $loggedInUsername);
    $st->execute();
    $st->bind_result($sort_type);
    $st->fetch();
    $st->close(); // Close the statement

    // If sort_type is null, handle it appropriately
    if ($sort_type === null) {
        echo json_encode([
            "status" => "404",
            "message" => "User not found or no sort type set",
            "sort_type" => null
        ]);
    } else {
        echo json_encode([
            "status" => "200",
            "sort_type" => $sort_type
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "500",
        "message" => "Database query failed: " . $e->getMessage()
    ]);
}

// Close the connection
$connection->close();
