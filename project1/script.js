
    //Default location if user has chosen to not allow location 
    const UK = {
        latitude: 45,
        longitude: -1
    };

    //Map Initialization
    var map = L.map('map').setView([54.5, -4], 6);

    var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a> | Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    var labels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a>',
        maxZoom: 20
    });

    var satelliteWithLabels = L.layerGroup([satellite, labels]);

    //Map view (Street)
    var streets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    streets.addTo(map)
    satellite.addTo(map)

    //Map layers
    var basemaps = {
        "Satellite": satelliteWithLabels,
        "Streets": streets 
    };

    satelliteWithLabels.addTo(map);

    //Function to plot the selected country on map
    function plotCountry(countryCode) {
        fetch(`countryBorder.php?country=${countryCode}`)
            .then(response => response.json())
            .then(data => {
                map.eachLayer(function(layer) {
                    if (layer instanceof L.GeoJSON) {
                        map.removeLayer(layer);
                    }
                });
                if (data && data.features && data.features.length > 0) {
                    var geojsonLayer = L.geoJSON(data).addTo(map);
                    map.fitBounds(geojsonLayer.getBounds());
                } else {
                    alert('Country not found or no data available');
                }
            })
            .catch(error => console.error('Error fetching GeoJSON:', error));
    }
    //End of function to plot the selected country on map

    //Function to populate the dropdown menu with list of countries in alphabetical order
    function populateDropdown() {
        fetch('getCountries.php')
            .then(response => response.json())
            .then(countries => {
                const dropdown = document.getElementById('countrySelect');
                countries.features.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.properties.iso_a2;  
                    option.textContent = country.properties.name;
                    dropdown.appendChild(option);
                });
            })
            .catch(error => console.error('Error populating dropdown:', error));
    }
    document.getElementById('countrySelect').addEventListener('change', function() {
        const selectedCountry = this.value;
        if (selectedCountry) {
            plotCountry(selectedCountry);  
        }
    });
    document.addEventListener('DOMContentLoaded', populateDropdown);
    //End of function to populate the dropdown menu with list of countries in alphabetical order

    
    // Function to get user location and match it using geoJSON
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                let userLat = position.coords.latitude;
                let userLng = position.coords.longitude;
                matchLocationToCountry(userLat, userLng);
            }, function(error) {
                console.error("Geolocation error:", error.message);
                document.getElementById('preloader').style.display = 'none';
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
            document.getElementById('preloader').style.display = 'none';
        }
        }
    function matchLocationToCountry(lat, lng) {
        if (!countryGeoJSON) {
            console.error("GeoJSON data not loaded.");
            document.getElementById('preloader').style.display = 'none';
            return;
        }
        let userPoint = turf.point([lng, lat]);
        let matchedCountryCode = null;
        let matchedCountryName = null;
        countryGeoJSON.features.forEach(function(feature) {
            let countryPolygon = feature.geometry;
            if (turf.booleanPointInPolygon(userPoint, countryPolygon)) {
                matchedCountryCode = feature.properties.ISO_A2 || feature.properties.country_code || feature.properties.iso_a2;
                matchedCountryName = feature.properties.name;
                selectCountryInDropdown(matchedCountryName);
                loadMarkers(matchedCountryCode); 
            }
        });
        document.getElementById('preloader').style.display = 'none';
        if (!matchedCountryCode) {
            console.error("Could not match user's location to any country.");
        }
    }
    function selectCountryInDropdown(countryName) {
        let dropdown = document.getElementById('countrySelect'); 
        for (let i = 0; i < dropdown.options.length; i++) {
            if (dropdown.options[i].text === countryName) {
                if (dropdown.selectedIndex === i) return;
                dropdown.selectedIndex = i;
                dropdown.dispatchEvent(new Event('change')); 
                dropdown.classList.add('selected'); 
                break;
            }
        }
    }
    function loadMarkers(countryCode) {
        console.log("Markers loaded for country code:", countryCode);
    }
    window.onload = () => {
        document.getElementById('preloader').style.display = 'block';
        getUserLocation();
    };
    let countryGeoJSON = {
        "type": "FeatureCollection",
        "features": [
        ]
    };

//End of function to match the user's location with a country in GeoJSON


// Modal 1 - Country Information
L.easyButton('<i class="fa-solid fa-info"></i>', function(btn, map) {
    var selectedCountryCode = $('#countrySelect').val();
    if (selectedCountryCode) {
        $.ajax({
            type: 'GET',
            url: 'getCountryInfo.php',
            data: { countryCode: selectedCountryCode },
            success: function(response) {
                var data = JSON.parse(response);
                if (data.success) {
                    var country = data.country;
                    var formattedPopulation = new Intl.NumberFormat().format(country.population);
                    var formattedArea = new Intl.NumberFormat().format(country.area);
                    var infoHtml = '<p><strong>Country:</strong> ' + country.name + '</p>' +
                                   '<p><strong>Capital:</strong> ' + country.capital + '</p>' +
                                   '<p><strong>Population:</strong> ' + formattedPopulation + '</p>' +
                                   '<p><strong>Area:</strong> ' + formattedArea + ' km&sup2;</p>' +
                                   '<p><strong>Currency:</strong> ' + country.currency + '</p>';

                    $('#country-info').html(infoHtml);
                } else {
                    $('#country-info').html('<p>Error: ' + data.message + '</p>');
                }
                $('#infoModal').modal('show');
            },
            error: function() {
                $('#country-info').html('<p>There was an error processing your request.</p>');
                $('#infoModal').modal('show');
            }
        });
    } else {
        alert('Please select a country first.');
    }
}).addTo(map);

//End of modal 1 - Country Information

//Modal 2 - Country Wikipedia (Small article + Link)
     L.easyButton('<i class="fab fa-wikipedia-w"></i>', function(btn, map){
         var selectedCountry = document.getElementById('countrySelect').value;
            $.ajax({
                url: 'getWikiArticle.php', 
                type: 'POST',
                data: { country: selectedCountry },
                success: function(response) {
                    var data = JSON.parse(response);
                    if (data.success) {
                        var wikiSummary = data.extract;
                        var wikiLink = data.url;
                        $('#wikiModalContent').html(
                            '<p>' + wikiSummary + '</p>' +
                            '<a href="' + wikiLink + '" target="_blank">Read more on Wikipedia</a>'
                        );
                        $('#wikiModal').modal('show');
                    } else {
                        alert('Could not retrieve Wikipedia data: ' + data.message);
                    }
                },
                error: function(xhr, status, error) {
                    alert('Error retrieving Wikipedia article.');
                }
            });
    }).addTo(map);

//End of modal 2 - Country Wikipedia (Small article + Link)

// Modal 3 - Country Currency Converter (using currency code API and currency converter API)
L.easyButton('<i class="fa-solid fa-coins"></i>', function() {
    $('#currencyModal').modal('show');
}).addTo(map);
document.getElementById('convertCurrency').addEventListener('click', function() {
    var selectedCountryCode = document.getElementById('countrySelect').value; 
    var targetCurrency = document.getElementById('targetCurrency').value; 
    var amount = parseFloat(document.getElementById('amount').value); 
    if (isNaN(amount) || amount <= 0) {
        document.getElementById('currencyInfo').innerHTML = '<p>Please enter a valid amount to convert.</p>';
        return;
    }
    $.ajax({
        url: 'get_currency_code.php', 
        type: 'POST',
        data: { country_code: selectedCountryCode },
        success: function(response) {
            var data = JSON.parse(response);
            if (data.success) {
                var baseCurrency = data.currency_code;
                $.ajax({
                    url: 'currency_converter.php',
                    type: 'POST',
                    data: {
                        base_currency: baseCurrency,
                        target_currency: targetCurrency
                    },
                    success: function(response) {
                        var conversionData = JSON.parse(response);
                        if (conversionData.success) {
                            var convertedAmount = (amount * conversionData.rate).toFixed(2);
                            var formattedBaseAmount = new Intl.NumberFormat().format(amount);
                            var formattedConvertedAmount = new Intl.NumberFormat().format(convertedAmount);
                            var result = `${formattedBaseAmount} ${conversionData.base_currency} = ${formattedConvertedAmount} ${conversionData.target_currency}`;
                            document.getElementById('currencyInfo').innerHTML = '<p>' + result + '</p>';
                        } else {
                            document.getElementById('currencyInfo').innerHTML = '<p>Error: ' + conversionData.message + '</p>';
                        }
                    },
                    error: function() {
                        document.getElementById('currencyInfo').innerHTML = '<p>Error fetching conversion rate.</p>';
                    }
                });
            } else {
                document.getElementById('currencyInfo').innerHTML = '<p>Error: ' + data.message + '</p>';
            }
        },
        error: function() {
            document.getElementById('currencyInfo').innerHTML = '<p>Error fetching currency code.</p>';
        }
    });
});

//End of modal 3 - Country Currency Converter (using currency code API and currency converter API)

//Modal 4 - Country Capital Weather
    L.easyButton('<i class="fa-solid fa-umbrella"></i>', function() {
    var selectedCountryCode = document.getElementById('countrySelect').value;
    $.ajax({
        url: 'get_weather.php', 
        type: 'POST',
        data: { country_code: selectedCountryCode },
        success: function(response) {
            var data = JSON.parse(response);
            if (data.success) {
                var weatherHtml = `
                    <h4>Weather in ${data.city}</h4>
                    <h5>Today:</h5>
                    <img src="https://openweathermap.org/img/wn/${data.today.icon}.png" alt="Weather icon">
                    <p>Temperature: ${data.today.temp}°C</p>
                    <p>${data.today.description}</p>
                    <h5>Tomorrow:</h5>
                    <img src="https://openweathermap.org/img/wn/${data.tomorrow.icon}.png" alt="Weather icon">
                    <p>Temperature: ${data.tomorrow.temp}°C</p>
                    <p>${data.tomorrow.description}</p>
                `;
                document.getElementById('weatherInfo').innerHTML = weatherHtml;
                $('#weatherModal').modal('show');
            } else {
                document.getElementById('weatherInfo').innerHTML = `<p>Error: ${data.message}</p>`;
                $('#weatherModal').modal('show');
            }
        },
        error: function() {
            document.getElementById('weatherInfo').innerHTML = '<p>Error fetching weather data.</p>';
            $('#weatherModal').modal('show');
        }
    });
    }).addTo(map); 

//End of modal 4 - Country Capital Weather

//Modal 5 - Country News
    L.easyButton('<i class="fa-solid fa-newspaper"></i>', function(){
    var selectedCountryCode = $('#countrySelect').val();
    $('#newsModal').modal('show');
    $.ajax({
        url: 'getNews.php',  
        type: 'POST',
        data: { countryCode: selectedCountryCode },
        success: function(response) {
            var data = response;
            if (data.error) {
                $('#newsContent').html('<p>' + data.error + '</p>');
            } else {
                let newsHTML = '';
                data.forEach(function(article) {
                    let title = article.title || 'No title available';
                    let description = article.description || 'No description available';
                    let imageUrl = article.image_url || 'https://via.placeholder.com/300x200.png?text=No+Image';
                    let articleUrl = article.link || '#';

                    newsHTML += `
                        <div class="news-article">
                            <img src="${imageUrl}" alt="News Image" style="width:100%; height:auto;" />
                            <h4>${title}</h4>
                            <p>${description}</p>
                            <a href="${articleUrl}" target="_blank">Read more</a>
                        </div>
                        <hr>
                    `;
                });
                $('#newsContent').html(newsHTML);
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX error:', error);
            $('#newsContent').html('<p>Unable to fetch news at this time. Please try again later.</p>');
        }
    });
}).addTo(map);

//End of modal 5 - Country News

//Markers
const cityIcon = L.divIcon({
    html: '<div class="custom-marker-icon city-marker-icon"></div>',
    className: '', 
    iconSize: [30, 30]
});
const naturalFeatureIcon = L.divIcon({
    html: '<div class="custom-marker-icon nature-marker-icon"></div>',
    className: '', 
    iconSize: [30, 30]
});
const airportIcon = L.divIcon({
    html: '<div class="custom-marker-icon airport-marker-icon"></div>',
    className: '', 
    iconSize: [30, 30]
});
const cityMarkers = L.markerClusterGroup();
const naturalFeatureMarkers = L.markerClusterGroup();
const airportMarkers = L.markerClusterGroup();
let currentCountryCode = null;
async function loadMarkers(countryCode) {
    if (currentCountryCode === countryCode) return;
    currentCountryCode = countryCode;
    cityMarkers.clearLayers();
    naturalFeatureMarkers.clearLayers();
    airportMarkers.clearLayers();
    try {
        const citiesResponse = await fetch(`get_cities.php?country_code=${countryCode}`);
        const citiesData = await citiesResponse.json();
        const naturalFeaturesResponse = await fetch(`get_natural_features.php?country_code=${countryCode}`);
        const naturalFeaturesData = await naturalFeaturesResponse.json();
        const airportsResponse = await fetch(`get_airport.php?country_code=${countryCode}`);
        const airportsData = await airportsResponse.json();
        if (citiesData && citiesData.geonames) {
            citiesData.geonames.forEach(city => {
                const formattedPopulation = new Intl.NumberFormat().format(city.population);
                const marker = L.marker([city.lat, city.lng], { icon: cityIcon })
                    .bindPopup(`<strong>${city.name}</strong><br>Population: ${formattedPopulation}`);
                cityMarkers.addLayer(marker);
            });
        }
        if (naturalFeaturesData && naturalFeaturesData.geonames) {
            naturalFeaturesData.geonames.forEach(feature => {
                const marker = L.marker([feature.lat, feature.lng], { icon: naturalFeatureIcon })
                    .bindPopup(`<strong>${feature.name}</strong><br>Type: ${feature.fcodeName}`);
                naturalFeatureMarkers.addLayer(marker);
            });
        }
        if (airportsData && airportsData.success && airportsData.geonames) {
            airportsData.geonames.forEach(airport => {
                const marker = L.marker([airport.lat, airport.lng], { icon: airportIcon })
                    .bindPopup(`<strong>${airport.name}</strong><br>Type: ${airport.fcodeName}`);
                airportMarkers.addLayer(marker);
            });
        }
    } catch (error) {
        console.error("Error loading markers:", error);
    }
    cityMarkers.addTo(map);
    naturalFeatureMarkers.addTo(map);
    airportMarkers.addTo(map);
}
const overlayMaps = {
    "Cities": cityMarkers,
    "Natural Features": naturalFeatureMarkers,
    "Airports": airportMarkers
};
var layerControl = L.control.layers(basemaps, overlayMaps).addTo(map);
window.onload = function () {
    loadGeoJSON('countryBorders.geo.json');
};
document.getElementById('countrySelect').addEventListener('change', (event) => {
    const selectedCountryCode = event.target.value;
    loadMarkers(selectedCountryCode);
});
function loadGeoJSON(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load GeoJSON');
            }
            return response.json();
        })
        .then(data => {
            countryGeoJSON = data;
            getUserLocation(); 
        })
        .catch(error => {
            console.error("Error loading GeoJSON:", error);
        });
}
// End of markers
