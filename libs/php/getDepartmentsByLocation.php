<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_error) {
    echo json_encode(['status' => ['code' => 300, 'name' => 'failure', 'description' => 'Database unavailable'], 'data' => []]);
    exit;
}

$locationID = isset($_GET['locationID']) ? intval($_GET['locationID']) : null;

if (!$locationID) {
    echo json_encode(['status' => ['code' => 400, 'name' => 'failure', 'description' => 'Invalid location ID.'], 'data' => []]);
    exit;
}

$query = $conn->prepare('SELECT id, name FROM department WHERE locationID = ?');
$query->bind_param("i", $locationID);
$query->execute();
$result = $query->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(['status' => ['code' => 200, 'name' => 'success', 'description' => 'Departments fetched successfully'], 'data' => $data]);

$query->close();
$conn->close();
?>
