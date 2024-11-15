<?php

// Load database configuration
$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

// Create a connection to the database
$connection = new mysqli("localhost:3306", $username, $password, $db_name);

// Check connection
if ($connection->connect_error) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Could not connect to the database"]));
}

// Read the input data
$input = json_decode(file_get_contents("php://input"), true);

// Debug: Log the received input
error_log(print_r($input, true));

// Validate required fields
if (!isset($input['group_id']) || !isset($input['page_num']) || !isset($input['new_page_name'])) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Missing required fields"]));
}

// Extract variables from the input
$group_id = $input['group_id'];   // The ID of the group to edit
$page = $input['page_num'];       // The ID of the page to edit
$new_group_name = $input['new_page_name'];  // The new page name (should be page name in this context)

// Ensure page name is not empty
if (empty($new_group_name)) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Page name cannot be empty"]));
}

try {
    // Prepare the SQL statement to update the page name
    $stmt = $connection->prepare("UPDATE pages SET page_name = ? WHERE group_id = ? AND page_number = ?");
    if ($stmt === false) {
        // Check if statement preparation failed
        throw new Exception("Failed to prepare the SQL statement: " . $connection->error);
    }
    $stmt->bind_param("sii", $new_group_name, $group_id, $page); // 's' for string, 'i' for integer
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        // If no rows were affected, meaning no change happened
        echo json_encode(["success" => false, "message" => "Failed to update page name or no changes were made"]);
    }

    // Close the prepared statement
    $stmt->close();
} catch (Exception $e) {
    // Handle errors gracefully
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}

// Close the database connection
$connection->close();

?>
