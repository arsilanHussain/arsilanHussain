<?php
//Get City Locations (Major Cities) for City Markers

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");
$apiEndpoint = "http://api.geonames.org/citiesJSON";
$username = "arsilanhussain"; 
$countryCode = $_GET['country_code'];
if (!$countryCode) {
    echo json_encode(["error" => "Country code is required"]);
    exit();
}
$geojsonFile = 'countryBorders.geo.json';
$geojsonData = json_decode(file_get_contents($geojsonFile), true);
if (!$geojsonData) {
    echo json_encode(["error" => "Failed to load GeoJSON file"]);
    exit();
}
$countryFeature = null;
foreach ($geojsonData['features'] as $feature) {
    if (isset($feature['properties']['iso_a2']) && $feature['properties']['iso_a2'] === $countryCode) {
        $countryFeature = $feature;
        break;
    }
}
if (!$countryFeature) {
    echo json_encode(["error" => "Country not found in GeoJSON"]);
    exit();
}
$south = $north = $west = $east = null;
if ($countryFeature['geometry']['type'] === 'Polygon') {
    foreach ($countryFeature['geometry']['coordinates'][0] as $point) {
        $lng = $point[0];
        $lat = $point[1];
        $south = is_null($south) ? $lat : min($south, $lat);
        $north = is_null($north) ? $lat : max($north, $lat);
        $west = is_null($west) ? $lng : min($west, $lng);
        $east = is_null($east) ? $lng : max($east, $lng);
    }
} elseif ($countryFeature['geometry']['type'] === 'MultiPolygon') {
    foreach ($countryFeature['geometry']['coordinates'] as $polygon) {
        foreach ($polygon[0] as $point) {
            $lng = $point[0];
            $lat = $point[1];
            $south = is_null($south) ? $lat : min($south, $lat);
            $north = is_null($north) ? $lat : max($north, $lat);
            $west = is_null($west) ? $lng : min($west, $lng);
            $east = is_null($east) ? $lng : max($east, $lng);
        }
    }
} else {
    echo json_encode(["error" => "Unsupported geometry type"]);
    exit();
}
if (!is_numeric($south) || !is_numeric($north) || !is_numeric($west) || !is_numeric($east)) {
    echo json_encode(["error" => "Invalid bounding box coordinates"]);
    exit();
}
error_log("Bounding box for $countryCode: south=$south, north=$north, west=$west, east=$east");
$apiUrl = "$apiEndpoint?username=$username&south=$south&north=$north&west=$west&east=$east";
error_log("API URL: $apiUrl");
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
if ($response) {
    echo $response;
} else {
    echo json_encode(["error" => "Failed to retrieve city data"]);
}
?>
