<?php
//Get Nature Locations (Natural Features) for Nature Markers

header("Content-Type: application/json");
$apiEndpoint = "http://api.geonames.org/searchJSON";
$username = "arsilanhussain"; 
$countryCode = $_GET['country_code']; 
if (!$countryCode) {
    echo json_encode(["error" => "Country code is required"]);
    exit();
}
$params = [
    "country" => $countryCode,
    "featureClass" => "T", 
    "maxRows" => 50,
    "username" => $username
];
$queryString = http_build_query($params);
$url = "$apiEndpoint?$queryString";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
if ($response) {
    echo $response;
} else {
    echo json_encode([]);
}
?>
