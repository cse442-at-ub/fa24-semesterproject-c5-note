<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);

if ($connection->connect_error) {
    error_log("Database connection error: " . $connection->connect_error);
    die("Could not connect to the database: " . $connection->connect_error);
}

$input = json_decode(file_get_contents("php://input"), true);
error_log("Received input: " . print_r($input, true)); // logging input data

$username = $input['username'];
$notebookTitle = $input['title'];
$reorderedGroups = $input['reorderedGroups']; //array of group IDs in new order

try {
    // Update the group_order for each group in the reordered array
    foreach ($reorderedGroups as $order => $groupId) {
        error_log("Updating group ID $groupId to order $order"); // Log each update for debugging

        $stmt = $connection->prepare("UPDATE notebook_groups SET group_order = ? WHERE id = ?");
        if (!$stmt) {
            throw new Exception("SQL Prepare Error: " . $connection->error);
        }

        $stmt->bind_param("ii", $order + 1, $groupId);  // order starts at 0, adding 1
        if (!$stmt->execute()) {
            throw new Exception("SQL Execution Error: " . $stmt->error);
        }
        error_log("Successfully updated group ID $groupId to order " . ($order + 1));
    }

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    error_log("Error while updating group order: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to update group order: " . $e->getMessage()]);
}

?>
