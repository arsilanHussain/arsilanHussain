<?php
if (!headers_sent()) {
    ob_start();
<?php

$cd_host = "127.0.0.1";
$cd_port = 3306;
$cd_socket = "";

$cd_dbname = "companydirectory";
$cd_user = "root";
$cd_password = "";

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
