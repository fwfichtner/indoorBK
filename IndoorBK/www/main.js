/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var checkCalendar = function () {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var prevDay = day - 1; //this doesn't work for the first of the month (there is no 0th day)
    var year = dateObj.getUTCFullYear();

    prevDate = year + "/" + month + "/" + prevDay;
    curDate = year + "/" + month + "/" + day;
//    alert("Date today: "+curDate+", Date yesterday: "+ prevDate);
    
//    if (!window.plugins.calendar) {
//        alert("calendar plugin works");
//    } else {
//        alert("the calendar plugin doesn't work");
//    }
    
    var success = function(message) { alert("Success: " + JSON.stringify(message)); };
    var error = function(message) { alert("Error: " + message); };

    // list all events in a date range (only supported on Android for now)
    window.plugins.calendar.listEventsInRange(prevDate,curDate,success,error);
}

$( "#nextAppoint" ).load(checkCalendar());