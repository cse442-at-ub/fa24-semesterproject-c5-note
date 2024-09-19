<?php

if(isset($_COOKIE["username"])) {

    $connection = new mysqli("localhost:3306", $username, $password, $db_name);

    $result = $connection->query("SELECT * FROM users WHERE username = $_COOKIE['username']");
    $logout_id = $result->fetch_assoc()["user_id"];

    $connection = new mysqli("localhost:3306", $username, $password, $db_name);
    $result = $connection->query("DELETE FROM active_users WHERE user_id = $logout_id");
}

setcookie("username", "", time() - 60);
setcookie("token", "", time() - 60);