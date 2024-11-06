<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);

if ($connection->connect_error) {
    die("Could not connect to the database: " . $connection->connect_error);
}

// Read input data
$input = json_decode(file_get_contents("php://input"), true);
$groupId = $input['group_id'];
$reorderedPages = $input['reorderedPages']; // array of { page_number, page_order }

try {
    foreach ($reorderedPages as $pageData) {
        $pageOrder = $pageData['page_order'];
        $pageNumber = $pageData['page_number'];

        $stmt = $connection->prepare("UPDATE pages SET page_order = ? WHERE page_number = ? AND group_id = ?");
        $stmt->bind_param("iii", $pageOrder, $pageNumber, $groupId);

        if (!$stmt->execute()) {
            throw new Exception("SQL Execution Error: " . $stmt->error);
        }
    }

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    error_log("Error while updating page order: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to update page order: " . $e->getMessage()]);
}

$connection->close();
?>
