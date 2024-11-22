
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
                // Remove any existing GeoJSON layers to prevent duplicates
                map.eachLayer(function(layer) {
                    if (layer instanceof L.GeoJSON) {
                        map.removeLayer(layer);
                    }
                });
    
                if (data && data.features && data.features.length > 0) {
                    ///Border for countries (may change as not sure on the appearance)
                    var geojsonLayer = L.geoJSON(data, {
                        style: {
                            color: "#0d6efd",       
                            weight: 3,              
                            opacity: 0.8,          
                            fillColor: "#F8F8FF",   
                            fillOpacity: 0.3  
                        }
                    }).addTo(map);
    
                    // Zoom to the bounds of the country
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
    
    //Modal 3 - Currency Dropdown
    let baseCurrency = 'USD'; // Default base currency
    document.getElementById('countrySelect').addEventListener('change', function() {
    const selectedCountry = this.value;
    if (selectedCountry) {
        plotCountry(selectedCountry); // Keep existing functionality
        // Map country ISO to currency (replace this with a backend mapping if needed)
        fetch('getCountryCurrency.php?iso=' + selectedCountry)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.currency) {
                    baseCurrency = data.currency; // Update the base currency dynamically
                } else {
                    console.error('Error fetching country currency:', data.message);
                }
            })
            .catch(error => console.error('Error fetching country currency:', error));
         }
    });
    //

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
    async function loadMarkers(countryCode) {
        if (currentCountryCode === countryCode) return;
        currentCountryCode = countryCode;
        cityMarkers.clearLayers();
        naturalFeatureMarkers.clearLayers();
        airportMarkers.clearLayers();
    
        try {
            const [citiesResponse, naturalFeaturesResponse, airportsResponse] = await Promise.all([
                fetch(`get_cities.php?country_code=${countryCode}`),
                fetch(`get_natural_features.php?country_code=${countryCode}`),
                fetch(`get_airport.php?country_code=${countryCode}`)
            ]);
            
            const citiesData = await citiesResponse.json();
            const naturalFeaturesData = await naturalFeaturesResponse.json();
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
    
            cityMarkers.addTo(map);
            naturalFeatureMarkers.addTo(map);
            airportMarkers.addTo(map);
    
        } catch (error) {
            console.error("Error loading markers:", error);
        }
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

//Modal 1 - Country Information
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
                    var formattedPopulation = numeral(country.population).format('0,0');
                    var formattedArea = numeral(country.area).format('0,0') + ' km²';
                    $('#countryName').text(country.name);
                    $('#capitalCity').text(country.capital);
                    $('#population').text(formattedPopulation);
                    $('#area').text(formattedArea);
                    $('#currency').text(country.currency);
                    $('#countryInfoModal').modal('show');
                } else {
                    alert('Error: ' + data.message);
                }
            },
            error: function() {
                alert('There was an error processing your request.');
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

//Modal 3 - Currency Converter
    L.easyButton('<i class="fa-solid fa-coins"></i>', function () {
        populateCurrencyDropdown();
        $('#currencyModal').modal('show');
    }).addTo(map);
    function populateCurrencyDropdown() {
    fetch('get_all_currencies.php')
        .then(response => response.json())
        .then(response => {
            if (response.success && response.currencies) {
                const dropdown = document.getElementById('exchangeRate');
                dropdown.innerHTML = '<option value="" disabled selected>Select Currency...</option>';
                for (const [code, name] of Object.entries(response.currencies)) {
                    const option = document.createElement('option');
                    option.value = code;
                    option.textContent = `${name} (${code})`;
                    dropdown.appendChild(option);
                }
            } else {
                console.error('Failed to load currencies:', response.message);
            }
        })
        .catch(error => console.error('Error fetching currencies:', error));
    }
    function performCurrencyConversion() {
    const targetCurrency = document.getElementById('exchangeRate').value;
    const amount = document.getElementById('fromAmount').value;
    if (!targetCurrency) {
        document.getElementById('toAmount').value = '';
        return;
    }
    if (!baseCurrency) {
        document.getElementById('toAmount').value = '';
        alert('Please select a country first to determine the base currency.');
        return;
    }
    if (!amount || amount <= 0) {
        document.getElementById('toAmount').value = '';
        return;
    }
    fetch('convert_currency.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            base_currency: baseCurrency, 
            target_currency: targetCurrency,
            amount: amount
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const convertedAmount = numeral(data.converted_amount).format('0,0.00');
            document.getElementById('toAmount').value = convertedAmount;            
        } else {
            const errorMessage = data.message || 'Error performing conversion.';
            document.getElementById('toAmount').value = 'Conversion failed.';
            alert(errorMessage);
        }
    })
    .catch(error => {
        console.error('Error during conversion:', error);
        alert('An error occurred while processing the conversion.');
    });
}
document.getElementById('fromAmount').addEventListener('input', performCurrencyConversion);
document.getElementById('exchangeRate').addEventListener('change', performCurrencyConversion);
//End of modal 3 - Currency Converter


//Modal 4 - Country Capital Weather
L.easyButton('<i class="fa-solid fa-umbrella"></i>', function() {
    var selectedCountryCode = document.getElementById('countrySelect').value;
    if (!selectedCountryCode) {
        alert('Please select a country first.');
        return;
    }
    $.ajax({
        url: 'get_weather.php',
        type: 'POST',
        data: { country_code: selectedCountryCode },
        success: function(response) {
            var data = JSON.parse(response);
            if (data.success) {
                $('#weatherModalLabel').text(`Weather in ${data.city}, ${data.country}`);
                $('#todayConditions').text(data.today.description);
                $('#todayIcon').attr('src', `https:${data.today.icon}`);
                $('#todayMaxTemp').text(data.today.temp);
                $('#day1Date').text('Tomorrow');
                $('#day1Icon').attr('src', `https:${data.tomorrow.icon}`);
                $('#day1MaxTemp').text(data.tomorrow.temp);
                $('#weatherModal').modal('show');
            } else {
                $('#weatherInfo').html(`<p>Error: ${data.message}</p>`);
                $('#weatherModal').modal('show');
            }
        },
        error: function() {
            $('#weatherInfo').html('<p>Error fetching weather data.</p>');
            $('#weatherModal').modal('show');
        }
    });
}).addTo(map);
//End of modal 4 - Country Capital Weather

//Modal 5 - Country News
L.easyButton('<i class="fa-solid fa-newspaper"></i>', function () {
    var selectedCountryCode = $('#countrySelect').val();
    $('#newsModal').modal('show');
    $.ajax({
        url: 'getNews.php',
        type: 'POST',
        data: { countryCode: selectedCountryCode },
        success: function (response) {
            var data = response;
            const placeholderImage = 'images/placeholder.png'; 
            if (data.error) {
                $('#newsContent').html('<p>' + data.error + '</p>');
            } else {
                let seenTitles = new Set(); 
                let newsHTML = '';
                data.forEach(function (article) {
                    let title = article.title || 'No title available';
                    let imageUrl = article.image_url && article.image_url.trim() ? article.image_url : placeholderImage;
                    let articleUrl = article.link || '#';
                    if (seenTitles.has(title)) return;
                    seenTitles.add(title);
                    newsHTML += `
                        <table class="news-table">
                            <tr>
                                <td class="news-image">
                                    <img class="news-img" src="${imageUrl}" alt="News Image" onerror="this.src='${placeholderImage}'">
                                </td>
                                <td class="news-title">
                                    <a href="${articleUrl}" class="news-link" target="_blank">${title}</a>
                                </td>
                            </tr>
                        </table>
                    `;
                });
                if (newsHTML === '') {
                    newsHTML = '<p>No unique articles available for this country.</p>';
                }
                $('#newsContent').html(newsHTML);
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX error:', error);
            $('#newsContent').html('<p>Unable to fetch news at this time. Please try again later.</p>');
        }
    });
}).addTo(map);
//End of modal 5 - Country News

// Markers
var airportMarkers = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }
  });
  var cityMarkers = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }
  });
  var naturalFeatureMarkers = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }
  });
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

let currentCountryCode = null;
async function loadMarkers(countryCode) {
    if (currentCountryCode === countryCode) return;
    currentCountryCode = countryCode;
    cityMarkers.clearLayers();
    naturalFeatureMarkers.clearLayers();
    airportMarkers.clearLayers();
    try {
        const [citiesResponse, naturalFeaturesResponse, airportsResponse] = await Promise.all([
            fetch(`get_cities.php?country_code=${countryCode}`),
            fetch(`get_natural_features.php?country_code=${countryCode}`),
            fetch(`get_airport.php?country_code=${countryCode}`)
        ]);
        const citiesData = await citiesResponse.json();
        const naturalFeaturesData = await naturalFeaturesResponse.json();
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
        cityMarkers.addTo(map);
        naturalFeatureMarkers.addTo(map);
        airportMarkers.addTo(map);

    } catch (error) {
        console.error("Error loading markers:", error);
    }
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
//End of markers