/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

/*place java script functions in here*/
var jasondata;


function back() {
    var el = $(".input-form")
    var el2 = $(".timetable")

    el.css("visibility", "hidden");
    el2.css("visibility", "visible");

}

function storeDataLocalStorage() {
    var information = JSON.stringify(jsondata);
    localStorage.setItem('data', information);
}

function save() {
    //get values from 

    jsondata = JSON.parse(localStorage.getItem('data'));

    if (jsondata == null) {
        jsondata = [];
    }

    var dateValue = document.getElementById("date-input").value;
    var startTimeValue = document.getElementById("start-time-input").value;
    var endTimeValue = document.getElementById("end-time-input").value;
    var subjectValue = document.getElementById("subject-text-input").value;
    var classroomValue = document.getElementById("classroom-text-input").value;

    var obj = new Object();
    obj.id = Date.now();
    obj.date = dateValue;
    obj.start = startTimeValue;
    obj.end = endTimeValue;
    obj.subject = subjectValue;
    obj.classroom = classroomValue;

    //var hour = startTimeValue.split(":")[0];
    //var min = startTimeValue.split(":")[1];

    //var dateFormatted = ((((new Date(dateValue)).setHours(hour)).setMinutes(min)).setSeconds(0)).setMilliseconds(0);
    //obj.milliseconds = dateFormatted.getTime();

    //insert new object
    jsondata.push(obj);
    storeDataLocalStorage();

    fillTable();
    back();
    var x = "123";
}

function showTimetableEntry() {

    var el = $(".input-form")
    var el2 = $(".timetable")

    el.css("visibility", "visible");
    el2.css("visibility", "hidden");

}

function delTimetableEntry() {

    var listItems = document.getElementsByClassName('is-selected');
    console.log(jsondata);

    for (var i = 0; i < listItems.length; i++) {

        var timestampvalue = listItems[0].getAttribute("data-id");
        for (var j = 0; j < jsondata.length; j++) {
            if (jsondata[j].id == timestampvalue) {
                jsondata.splice(j, 1);
                console.log(jsondata);
            }
        }
    }
    storeDataLocalStorage();
    fillTable();
}

function getWeekDay(date) {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[date.getDay()]
}

function getDateDescriptionHeader(date) {
    var taskDate = new Date(date);
    return getWeekDay(taskDate).toString() + ", " + taskDate.getDate().toString() + "-" + taskDate.getMonth().toString() + "-" + taskDate.getFullYear().toString();

}

function fillTable() {
    var row = "";
    var item;
    var dateText = "";
    var strText = "";

    //clean the timetable
    document.getElementById("data-container").innerHTML = "";
    //get the data from the local storage
    jsondata = JSON.parse(localStorage.getItem('data'))
        //if data exists
    if (jsondata != null) {
        var count = jsondata.length;
        for (i = 0; i < count; i++) {
            item = jsondata[i];

            if (dateText != item.date) {
                //getWeekDay(item.date);
                strText = '<div class="col-sm-12 row-day">' + getDateDescriptionHeader(item.date) + '</div>';
                dateText = item.date;
            } else {
                strText = "";
            }
            row = row +
                //item.id is the timestamp (primary key)
                '<div data-id="' + item.id + '" class="row row-prop" >' +
                strText +
                '<div class="col-xs-5 time">' +
                item.start +
                '</div>' +
                '<div class="col-xs-7 detail-column">' +
                '<ul>' +
                '<li>' +
                item.subject +
                '</li>' +
                '<li>' +
                item.classroom +
                '</li>' +
                '<li>' +
                item.start + "-" + item.end +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</div>';

        }
        // add the timetable data to the webpage
        document.getElementById("data-container").innerHTML = row;
    }
}

function setEvents() {
    document.getElementById("floating-button-right").addEventListener("click", showTimetableEntry);
    document.getElementById("floating-button-left").addEventListener("click", delTimetableEntry);
    document.getElementById("back").addEventListener("click", back);
    document.getElementById("save").addEventListener("click", save);

    /*Default values*/
    document.getElementById("date-input").valueAsDate = new Date();
    document.getElementById("start-time-input").value = "09:00";
    document.getElementById("end-time-input").value = "11:00";
}

$(document).on('ready', function () {
    //fill the timetable data
    fillTable();
    //register the event for the components
    setEvents();

    (function () {

        // Create variable for setTimeout
        var delay;

        // Set number of milliseconds for longpress
        var longpress = 1300;

        var listItems = document.getElementsByClassName('row-prop');
        var listItem;

        for (var i = 0, j = listItems.length; i < j; i++) {
            listItem = listItems[i];

            //            listItem.addEventListener('mousedown', function (e) {
            listItem.addEventListener('touchstart', function (e) {
                var _this = this;
                delay = setTimeout(check, longpress);

                function check() {
                    _this.classList.add('is-selected');
                }

            }, true);

            //listItem.addEventListener('mouseup', function (e) {
            listItem.addEventListener('touchend', function (e) {
                // On mouse up, we know it is no longer a longpress
                clearTimeout(delay);
            });

            listItem.addEventListener('mouseout', function (e) {
                clearTimeout(delay);
            });

        }

    }());


})