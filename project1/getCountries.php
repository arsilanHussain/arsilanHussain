<?php
//PHP Routine for populating dropdown

$geojsonFile = 'countryBorders.geo.json';
$geojsonData = file_get_contents($geojsonFile);
if ($geojsonData === false) {
    die('Error loading GeoJSON file');
}
$geojsonArray = json_decode($geojsonData, true);
if (!isset($geojsonArray['features'])) {
    die('Invalid GeoJSON format: No features found');
}
usort($geojsonArray['features'], function($a, $b) {
    return strcmp($a['properties']['name'], $b['properties']['name']);
});
header('Content-Type: application/json');
echo json_encode($geojsonArray);
?>
