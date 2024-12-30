<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_error) {
    echo json_encode([
        'status' => [
            'code' => 300,
            'name' => 'failure',
            'description' => 'Database unavailable'
        ],
        'data' => []
    ]);
    exit;
}

$id = isset($_GET['id']) && is_numeric($_GET['id']) ? intval($_GET['id']) : null;

if (!$id) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'failure',
            'description' => 'Invalid input: ID must be a numeric value.'
        ],
        'data' => []
    ]);
    exit;
}

$query = $conn->prepare('
    SELECT 
        personnel.id, 
        personnel.firstName, 
        personnel.lastName, 
        personnel.email, 
        IFNULL(personnel.jobTitle, "") AS jobTitle,
        personnel.departmentID,
        department.name AS departmentName
    FROM personnel
    LEFT JOIN department ON personnel.departmentID = department.id
    WHERE personnel.id = ?
    ORDER BY personnel.lastName, personnel.firstName
');

$query->bind_param("i", $id);
$query->execute();

$result = $query->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        'status' => [
            'code' => 404,
            'name' => 'not found',
            'description' => 'Personnel not found.'
        ],
        'data' => []
    ]);
    $query->close();
    $conn->close();
    exit;
}

$data = $result->fetch_assoc();

echo json_encode([
    'status' => [
        'code' => 200,
        'name' => 'success',
        'description' => 'Success'
    ],
    'data' => $data
]);

$query->close();
$conn->close();

?>
