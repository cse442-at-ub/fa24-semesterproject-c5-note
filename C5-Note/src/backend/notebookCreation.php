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

//read input
$input = json_decode(file_get_contents("php://input"), true);

$loggedInUsername = $input['username'];
$notebookTitle = $input['title'];
$notebookDescription = $input['description'];
$isPrivate = $input['isPrivate'] ? 1 : 0;  //1 is true 0 is false
$notebookColor = $input['color'];

try {
    $stmt = $connection->prepare("INSERT INTO notebooks (username, title, description, isPrivate, color) VALUES (?, ?, ?, ?, ?)"); //prepared statements protect from SQL injection
    $stmt->bind_param("sssds", $loggedInUsername, $notebookTitle, $notebookDescription, $isPrivate, $notebookColor);
    $stmt->execute();

    $notebookId = $connection->insert_id;

    echo json_encode([
        "success" => true,
        "notebook" => [
            "id" => $notebookId,
            "title" => $notebookTitle,
            "description" => $notebookDescription,
            "isPrivate" => $isPrivate,
            "color" => $notebookColor
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to create notebook"
    ]);
}