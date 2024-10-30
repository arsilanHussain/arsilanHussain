<?php
//Get Airport locations for Airport markers

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
if (!isset($_GET['country_code'])) {
    echo json_encode(['error' => 'Country code is required']);
    exit;
}
$countryCode = htmlspecialchars($_GET['country_code']);
$apiKey = 'arsilanhussain';
$url = "http://api.geonames.org/searchJSON?formatted=true&country=$countryCode&featureClass=S&maxRows=50&username=$apiKey";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(['error' => 'Failed to retrieve data from API', 'details' => curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);
$responseData = json_decode($response, true);
if (isset($responseData['geonames']) && !empty($responseData['geonames'])) {
    echo json_encode(['success' => 'Landmarks found', 'geonames' => $responseData['geonames']]);
} else {
    $url = "http://api.geonames.org/searchJSON?formatted=true&country=$countryCode&featureClass=P&maxRows=50&username=$apiKey";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo json_encode(['error' => 'Failed to retrieve data from API', 'details' => curl_error($ch)]);
        curl_close($ch);
        exit;
    }

    curl_close($ch);

    $responseData = json_decode($response, true);

    if (isset($responseData['geonames']) && !empty($responseData['geonames'])) {
        echo json_encode(['success' => 'Landmarks found (from featureClass=P)', 'geonames' => $responseData['geonames']]);
    } else {
        echo json_encode(['error' => 'No landmarks found for this country with current criteria']);
    }
}
?>
