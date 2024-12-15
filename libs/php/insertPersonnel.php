<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    echo json_encode([
        'status' => [
            'code' => 300,
            'name' => 'failure',
            'description' => 'Database unavailable',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (
    empty($input['firstName']) || 
    empty($input['lastName']) || 
    empty($input['email']) || 
    empty($input['departmentID']) || 
    empty($input['locationID'])
) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'bad request',
            'description' => 'Missing required fields',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    exit;
}

$firstName = $conn->real_escape_string($input['firstName']);
$lastName = $conn->real_escape_string($input['lastName']);
$email = $conn->real_escape_string($input['email']);
$departmentID = (int)$input['departmentID'];
$locationID = (int)$input['locationID'];


$query = $conn->prepare('
    SELECT d.id 
    FROM department d
    JOIN location l ON d.locationID = l.id
    WHERE d.id = ? AND l.id = ?
');
$query->bind_param("ii", $departmentID, $locationID);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'bad request',
            'description' => 'Invalid department or location. Ensure the department matches the location.'
        ]
    ]);
    exit;
}

$query = $conn->prepare('
    INSERT INTO personnel (firstName, lastName, email, departmentID)
    VALUES (?, ?, ?, ?)
');

$query->bind_param(
    "sssi", 
    $firstName, 
    $lastName, 
    $email, 
    $departmentID
);

if (!$query->execute()) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'failure',
            'description' => 'Insert failed: ' . $query->error,
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => 200,
            'name' => 'ok',
            'description' => 'Personnel added successfully',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => ['insertedID' => $conn->insert_id]
    ]);
}

$conn->close();

?>
