<?php
//PHP Routine for getting geoJSON Information for selected country.

header('Content-Type: application/json');
$geojsonFile = 'countryBorders.geo.json';
$geojsonData = file_get_contents($geojsonFile);
if ($geojsonData === false) {
    echo json_encode(['error' => 'Unable to load GeoJSON file']);
    exit;
}
$geojsonArray = json_decode($geojsonData, true);
if ($geojsonArray === null) {
    echo json_encode(['error' => 'Invalid GeoJSON format']);
    exit;
}
$selectedCountry = isset($_GET['country']) ? $_GET['country'] : '';
if ($selectedCountry === '') {
    echo json_encode(['error' => 'No country selected']);
    exit;
}
error_log("Selected Country: " . $selectedCountry);
$matchingFeatures = [];
foreach ($geojsonArray['features'] as $feature) {
    error_log("Checking Country: " . $feature['properties']['name'] . " - ISO: " . $feature['properties']['iso_a2']);
    if (strtolower($feature['properties']['name']) === strtolower($selectedCountry) || 
        strtolower($feature['properties']['iso_a2']) === strtolower($selectedCountry)) {
        $matchingFeatures[] = $feature;
        }
}
if (!empty($matchingFeatures)) {
    $filteredGeoJSON = [
        'type' => 'FeatureCollection',
        'features' => $matchingFeatures
    ];
    echo json_encode($filteredGeoJSON);
} else {
    error_log("No matching country found for: " . $selectedCountry);
    echo json_encode(['type' => 'FeatureCollection', 'features' => []]);
};
?>
