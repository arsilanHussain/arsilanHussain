$('#btnRun').click(function() {

    //First API Script 
    $.ajax({
        url: '/task/info.php',
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selCountry').val(),
            lang: $('#selLanguage').val()
       
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                
                $('#txtCapital').html(result['data'][0]['capital']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});
    
    

