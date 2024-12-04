<?php

// Load configuration
$config = file_get_contents("../config.json");
$data = json_decode($config);

// Extract database credentials from config
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

// Create a new database connection
$connection = new mysqli("localhost:3306", $username, $password, $db_name);

// Check for connection error
if ($connection->connect_error) {
    // Return a detailed error message when the connection fails
    die(json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $connection->connect_error
    ]));
}

// Read the input JSON from the frontend
$input = json_decode(file_get_contents("php://input"), true);

// Validate input (ensure necessary fields are present)
if (!isset($input['group_id']) || !isset($input['page_num'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required parameters: group_id and/or page_num"
    ]);
    exit;
}

$groupId = $input['group_id'];
$pageId = $input['page_num'];

try {
    // Prepare and execute the delete statement
    $stmt = $connection->prepare("DELETE FROM pages WHERE group_id = ? AND page_number = ?");
    if ($stmt === false) {
        throw new Exception("Failed to prepare statement: " . $connection->error);
    }
    
    // Bind the parameters to the statement
    $stmt->bind_param("ii", $groupId, $pageId); // 'i' for integer parameters

    // Execute the statement
    $stmt->execute();

    // Check if any rows were deleted
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No pages were deleted (perhaps they do not exist)."
        ]);
    }

    $stmt->close();
} catch (Exception $e) {
    // Return error message if an exception occurs
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
} finally {
    // Close the database connection
    $connection->close();
}
?>
