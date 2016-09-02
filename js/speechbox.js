/// <reference path="lib/jquery.js" />
/// <reference path="lib/speech.1.0.0.js" />

/**
@codeBy: Shabbir Akolawala
@date: 20th Aug 2016
@description: Demonstration of Text to script block
*/

/** @description Initialize text to script block
 * @param {string} midId jQuery selector for Mic Image Button
 * @param {string} outputTextId jQuery selector for Output text area
 */
var speechToTextBlock = function (micId, outputTextId) {

    //Private Variables
    var subscriptionKey = "af3a7c3b4760408bbca38e9a10a1158c";
    var speechToTextMode = "shortPhrase";
    var languangeLocale = "en-us";
    var client = null;
    var $outputTextArea = $(outputTextId);
    var $imgBtn = $(micId);
    var $errdiv = $(".errdiv")

    //State variable tracks the mode of the button
    //It change from stop, recording, processing
    const recordState = {
        STOP: 0,
        RECORDING: 1,
        PROCESSING: 2,
        ERROR: 3
    }
    var micState = recordState.STOP;

    function initSpeechToTextclient() {
        client = Microsoft.ProjectOxford.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
                        speechToTextMode,
                        languangeLocale,
                        subscriptionKey,
                        subscriptionKey);

        client.onError = function (errorCode, errorstring) {
            console.log(errorstring);
            showerrormessage(errorstring);
            toogleErrorState();
        }

        client.onPartialResponseReceived = function (response) {
            setText(response);
        }

        client.onFinalResponseReceived = function (response) {
            console.log("Client Final Response Log");
            //Now we have get the respose, check and set the state
            if (response[0]) {
                setText(response[0]);
            }
            toogleStopState();
        }          
    }

    function setText(response) {        
        var text = " " + response.display;
        $outputTextArea.append(text);
    }

    function clearText() {
        $outputTextArea.text("");
    }

    function showerrormessage(msg) {
        $errdiv.show();
        $("#errmsg").html(msg);
    }

    function hideerrormessage() {
        $errdiv.hide();
    }

    function toogleRecordState() {

        //Change the image button src and text
        hideerrormessage();
        $imgBtn.attr("src", "images/micanimated.gif");
        $imgBtn.addClass('record');
        $imgBtn.siblings("#infotext").text("Recording");
        micState = recordState.RECORDING;
        try {
            client.startMicAndRecognition();
        }
        catch (err) {
            console.log(err);
            showerrormessage(err);
            toogleErrorState();
        }
        setTimeout(function () {
            //Time out is set to 3 secs, and it should be in recording state
            if (micState == recordState.RECORDING) {
                toogleStopAndProcessState();
            }            
        }, 3000);
    }

    function toogleStopState() {

        //Change the image button src and text
        hideerrormessage();
        $imgBtn.attr("src", "images/micstill.png");
        $imgBtn.removeClass('record');
        $imgBtn.siblings("#infotext").text("Press mic button to record, release to stop");
        micState = recordState.STOP;
        client.endMicAndRecognition();
    }

    function toogleErrorState() {

        //Change the image button src and text
        $imgBtn.attr("src", "images/error.gif");
        $imgBtn.removeClass('record');
        $imgBtn.siblings("#infotext").text("Some error occured! Try again");
        micState = recordState.ERROR;        
    }

    function toogleStopAndProcessState() {

        //Change the image button src and text
        hideerrormessage();
        $imgBtn.attr("src", "images/processing.gif");
        $imgBtn.removeClass('record');
        $imgBtn.siblings("#infotext").text("Processing...");
        micState = recordState.PROCESSING;
        client.endMicAndRecognition();
    }

    return {
        init: function () {
            //Register the click handler on the mic
            $imgBtn.on('click', function () {                
                if (micState == recordState.STOP) {
                    toogleRecordState();
                }
                else if (micState == recordState.ERROR) {
                    toogleStopState();
                }
                else {
                    toogleStopAndProcessState();
                }                
            });

            //Initialize Speech to text client
            initSpeechToTextclient();
        }
    }
}