<?php

// Load configuration
$config = file_get_contents("../config.json");
$data = json_decode($config);

// Database connection details
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

// Create a database connection
$connection = new mysqli("localhost", $username, $password, $db_name, 3306);

if ($connection->connect_error) {
    die("Could not connect to the database: " . $connection->connect_error);
}

// Reading input data
$input = json_decode(file_get_contents("php://input"), true);
$loggedInUsername = $input['username']; // This is the username sent from the frontend
$sort_type = $input['sort_type']; // This is the sort type sent from the frontend

// Prepare the SQL statement
try {
    $st = $connection->prepare("UPDATE users SET sort = ? WHERE username = ?");
    $st->bind_param("is", $sort_type, $loggedInUsername);
    
    if ($st->execute()) {
        echo json_encode([
            "status" => "200",
            "message" => "Sort type updated successfully"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "500",
            "message" => "Failed to update sort type"
        ]);
    }
    
    $st->close(); // Close the statement

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "500",
        "message" => "Database query failed: " . $e->getMessage()
    ]);
}

// Close the connection
$connection->close();
