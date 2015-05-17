//Here we should write the module that retrieves the next appointment 
// in Google Calendar

function getCalendar() {
    
    // Call the print function to add text to the HTML div with the "nextAppoint" id in index.html    
    var print = function(text) {
        $("#nextAppoint").html(text);
    }
    
    alert("asking for calendar");
     $.ajax({
    url: 'http://145.97.237.141:8080',
    data: 'start',
    contentType: 'text/plain',
    type: 'POST',      
    success: function (data) {
        print(data.toString());
    },
    error: function (xhr, status, error) {
        alert('Error: ' + error.message);
    }
    });   
       
}

window.onload = getCalendar;
