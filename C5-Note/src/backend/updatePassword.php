<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$json = json_decode(file_get_contents("php://input"));

$request_email = $json->email;
$request_code = $json->code;
$request_password = $json->password;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);

$statement = $connection->prepare("SELECT * FROM users WHERE email = ?");

$statement->bind_param("s", $request_email);

$result = $statement->execute();
if($result) {
        $output = $statement->get_result();
}

//IF the user exists in the database
if ($result && $output->num_rows == 1) {
    $record = $output->fetch_assoc();
    $request_username = $record["username"];

    $hashed_code = hash("sha256", $request_code);

    $connection = new mysqli("localhost:3306", $username, $password, $db_name);

    $statement = $connection->prepare("SELECT * FROM password_codes WHERE username = ? AND code = ?");

    $statement->bind_param("ss", $request_username, $hashed_code);

    $statement->execute();

    $result = $statement->execute();

    if($result) {
        $output = $statement->get_result();
    }

    if ($result && $output->num_rows == 1) {
        $record = $output->fetch_assoc();
        $start_time = $record["time"];


        if(!((time() - $start_time) > 60)) {
            
            $connection = new mysqli("localhost:3306", $username, $password, $db_name);

            $statement = $connection->prepare("UPDATE users SET password = ? WHERE username = ?");

            $statement->bind_param("ss", password_hash($password, PASSWORD_DEFAULT), $request_username);

            $result = $statement->execute();
            
            http_response_code(200);
            die(json_encode([
                "status" => "success",
                "message" => "An email has been sent containing a verification code."
            ]));
    }
}
}

http_response_code(400);
die(json_encode([
    "status" => "failure",
    "message" => "Either the code was invalid or there is no account with this email."
]));