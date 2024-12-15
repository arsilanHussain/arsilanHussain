<?php
if (!headers_sent()) {
    ob_start();
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$cd_host = 'db5016845977.hosting-data.io';
$cd_port = 3306; 
$cd_socket = '';
$cd_dbname = 'dbs13603156';
$cd_user = 'dbu1307816';
$cd_password = 'Arsilan-Hussain';


$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if (!headers_sent()) {
    ob_end_clean();
}
