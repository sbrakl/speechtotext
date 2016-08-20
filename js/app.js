/// <reference path="lib/jquery.js" />
/// <reference path="speechbox.js" />


$(document).ready(function () {

    var stb = new speechToTextBlock("#micbtn", "#textOutput");
    stb.init();
   
});

