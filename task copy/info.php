<?php
//PHP file for First API - "Country Info/Capital"
  
  // initiate comprehensive error reporting
ini_set('display_errors' , 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


//concatenates the url for the API call with the required parameters passed from the “data” section of the AJAX call in the script.js.
$url='http://api.geonames.org/countryInfoJSON?formatted-true&lang=' .$_REQUEST['lang'] .'&country=' . $_REQUEST['country'] . '&username=arsilanhussain';

//initiates the cURL object and sets some parameters(these are often documented by the API provider)
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

//executes the cURL object and stores the results to $result.
$result=curl_exec($ch);
curl_close($ch);

//this API returns data as JSON and so we decode it as an associative array so that we can append it to $output.
$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output["status"]['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . 'ms';

$output['data'] = $decode['geonames'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>

