<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$db_username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$input = json_decode(file_get_contents("php://input"), true);
$search = $input['search'];

if (ctype_space($search) || $search == '') {
    http_response_code(400);
    die(json_encode([
        "status" => "failure",
        "message" => "Search was only whitespace."
    ]));
}

$search = "%" . $search . "%";

$connection = new mysqli("localhost:3306", $db_username, $password, $db_name);

$stmt = $connection->prepare("SELECT * FROM notebooks WHERE UPPER(title) LIKE UPPER(?) AND isPrivate = 1");
$stmt->bind_param("s", $search);
$stmt->execute();
$result = $stmt->get_result();

$notebooks = [];

if ($result->num_rows > 0) {

    $notebooks = [];
    

    while($row = $result->fetch_assoc()) {
        
        $timeCreated = new DateTime($row['time_created']);
        $lastModified = new DateTime($row['last_modified']);

        $notebookId = $row['id']; // Initialize notebookId

        $stmtGroups = $connection->prepare("SELECT id as group_id, group_name FROM notebook_groups WHERE notebook_id = ? ORDER BY group_order ASC");
        $stmtGroups->bind_param("i", $notebookId);
        $stmtGroups->execute();
        $resultGroups = $stmtGroups->get_result();
        
        $groups = [];
        while($group = $resultGroups->fetch_assoc()) {
            $groupId = $group['group_id'];

            // Fetch pages for each group
            $stmtPages = $connection->prepare("SELECT page_number, page_content FROM pages WHERE group_id = ? ORDER BY page_number ASC LIMIT 1");
            $stmtPages->bind_param("i", $groupId);
            $stmtPages->execute();
            $resultPages = $stmtPages->get_result();

            if ($resultPages->num_rows > 0) {
                $page = $resultPages->fetch_assoc();
                $group['first_page'] = $page;
            }

            $groups[] = $group;
        }

        $row['groups'] = $groups;
        $notebooks[] = [
            'groups' => $row['groups'],
            'title' => $row['title'],
            'description' => $row['description'],
            'color' => $row['color'],
            'time_created' => $timeCreated->format('Y-m-d H:i:s'), // Format as needed
            'last_modified' => $lastModified->format('Y-m-d H:i:s'), // Format as needed
            'id' => $row['id']
        ];
    }

    /* SAMPLE RESPONSE JSON; example below has 3 rows
    [
        {
            "title": "Chemistry",
            "description": "Chemistry notes for class",
            "color": "#cccccc"
        },
        {
            "title": "Geography",
            "description": "Geography notes on Europe",
            "color": "#cccccc"
        },
        {
            "title": "CSE 442",
            "description": "Notes on CSE 442 programming",
            "color": "#cccccc"
        }
    ]
    */

    die(json_encode(["status" => "success","notebooks" => json_encode($notebooks)]));

}