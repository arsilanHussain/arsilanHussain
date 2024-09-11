$('#btnRun').click(function() {

    //First API Script 
    $.ajax({
        url: '/task/info.php',
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#latitude').val(),
            lng: $('#longitude').val()
       
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                
            $('#txtTime').html(result['data']['time']);

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});

$('#btnTwoRun').click(function() {

    $.ajax({
        url: '/task/info2.php',
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#latitudeOne').val(),
            lng: $('#longitudeOne').val()
          
        },
            success: function(result) {

                console.log(JSON.stringify(result));
    
                if (result.status.name == "ok") {
                    
                $('#txtName').html(result['data']['name']);

                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        }); 
    
    });

    $('#btnThreeRun').click(function() {

     
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
        
    
    


    
    