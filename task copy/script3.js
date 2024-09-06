$('#btnThreeRun').click(function() {

    //Third API script 
    $.ajax({
        url: '/task/info3.php',
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#latitudeTwo').val(),
            lng: $('#longitudeTwo').val()
          
        },
            success: function(result) {

                console.log(JSON.stringify(result));
    
                if (result.status.name == "ok") {

                $('#txtTemperature').html(result['data']['temperature']);

                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        }); 
    
    });
    