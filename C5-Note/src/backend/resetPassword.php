<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$json = json_decode(file_get_contents("php://input"));

$request_email = $json->email;

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
    $value = -1;
    $code = "";

    for($count = 0; $count < 6; $count++) {

            $value = random_int(0,9);
            $code = $code . $value;
    }

    $hashed_code = hash("sha256", $code);

    $connection = new mysqli("localhost:3306", $username, $password, $db_name);

    $statement = $connection->prepare("INSERT INTO password_codes (username, code, time) VALUES ( ? , ? , ?)");

    $statement->bind_param("ssi", $request_username, $hashed_code, time());

    $statement->execute();

    mail($request_email,
        "C5-Note Password Reset",
        "The verification code to reset your password is " . $code . ".\n It expires in one minute.");

    http_response_code(200);
    die(json_encode([
        "status" => "success",
        "message" => "An email has been sent containing a verification code."
    ]));
}
else {

    http_response_code(400);
    die(json_encode([
        "status" => "failed",
        "message" => "There is no account associated with " . $request_email . "."
    ]));
}