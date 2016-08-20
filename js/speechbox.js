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

    //State variable tracks the mode of the button
    //It change from stop, recording, processing
    const recordState = {
        STOP: 0,
        RECORDING: 1,
        PROCESSING: 2,
    }
    var micState = recordState.STOP;

    function initSpeechToTextclient() {
        client = Microsoft.ProjectOxford.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
                        speechToTextMode,
                        languangeLocale,
                        subscriptionKey,
                        subscriptionKey);

        client.onPartialResponseReceived = function (response) {
            setText(response);
        }

        client.onFinalResponseReceived = function (response) {
            console.log("Client Final Response Log");
            setText(response[0]);
        }

        client.onIntentReceived = function (response) {
            setText(response);
        };        
    }

    function setText(response) {
        console.log(response);
        var text = " " + response.display;
        $outputTextArea.append(text);
    }

    function clearText() {
        $outputTextArea.text("");
    }

    function toogleRecordState() {

        //Change the image button src and text
        $imgBtn.attr("src", "images/micanimated.gif");
        $imgBtn.addClass('record');
        $imgBtn.siblings("#infotext").text("Recording");
        micState = recordState.RECORDING;
        client.startMicAndRecognition();
        setTimeout(function () {
            toogleStopState();
        }, 3000);
    }

    function toogleStopState() {

        //Change the image button src and text
        $imgBtn.attr("src", "images/micstill.png");
        $imgBtn.removeClass('record');
        $imgBtn.siblings("#infotext").text("Press mic button to record, release to stop");
        micState = recordState.STOP;
        client.endMicAndRecognition();
    }

    return {
        init: function () {
            //Register the click handler on the mic
            $imgBtn.on('click', function () {                
                if (micState == recordState.STOP){
                    toogleRecordState();
                }
                else {
                    toogleStopState();
                }                
            });

            //Initialize Speech to text client
            initSpeechToTextclient();
        }
    }
}