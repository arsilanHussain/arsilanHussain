<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

include("config.php");

header('Content-Type: application/json');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    echo json_encode([
        'status' => [
            'code' => 300,
            'name' => 'failure',
            'description' => 'Database unavailable'
        ]
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['id'])) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'failure',
            'description' => 'Missing ID'
        ]
    ]);
    exit;
}

$id = (int)$input['id'];

$query = $conn->prepare('DELETE FROM personnel WHERE id = ?');
$query->bind_param("i", $id);

if (!$query->execute()) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'failure',
            'description' => 'Delete failed: ' . $query->error
        ]
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => 200,
            'name' => 'success',
            'description' => 'Personnel deleted successfully'
        ]
    ]);
}

$conn->close();

?>
