$('#btnTwoRun').click(function() {

    //Second API script 
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
    
    

