/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//This file checks the user's calendar and outputs the next appointment to 
//index.html and to the server. 

function checkCalendar (startDate, endDate) {
    // list all events in a date range (only supported on Android for now)
    var events = window.plugins.calendar.listEventsInRange(startDate,endDate,success,error);
    alert(events);
}

function checkDate(i) {
    var today = new Date();
    var dd = today.getDate() + i;
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    today = mm+'/'+dd+'/'+yyyy;
    alert(today);
}
window.onload=checkCalendar(checkDate(0), checkDate(1));