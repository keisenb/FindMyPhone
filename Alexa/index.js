'use strict';
var unirest = require("unirest");

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /*if (event.session.application.applicationId !== "amzn1.ask.skill.XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX") {
           context.fail("Invalid Application ID");
         }*/

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};


function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);
}

function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    var cardTitle = "Default"
    var speechOutput = "Welcome to Find My Phone. Ask me to find your phone or say help for more options."
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "", false));
}

function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'Find') {
        handleFindRequest(intent, session, callback);
    }
    else if(intentName == 'Add') {
        handleAddRequest(intent, session, callback);
    }
    else if(intentName == 'Help') {
        handleHelpRequest(intent, session, callback);
    }
    else if(intentName == 'Stop') {
        handleStopRequest(intent, session, callback);
    }
    else {
        throw "Invalid intent";
    }
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);
}

function handleFindRequest(intent, session, callback) {
    var cardTitle = "Find";
    var speechOutput = "";
    var req = unirest("GET", "http://api.whatdoestrumpthink.com/api/v1/quotes/random");

    req.headers({
      "postman-token": "5efe01e5-2128-dae6-14e1-9b4e61cca239",
      "cache-control": "no-cache"
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);
      console.log(res.body);

      callback(session.attributes,
          buildSpeechletResponse(cardTitle, res.body.message, "", true));
  });
}

function handleAddRequest(intent, session, callback) {
    var cardTitle = "Add";
    var speechOutput = "";
    var req = unirest("GET", "http://api.whatdoestrumpthink.com/api/v1/quotes/random");

    req.headers({
      "postman-token": "5efe01e5-2128-dae6-14e1-9b4e61cca239",
      "cache-control": "no-cache"
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);
      console.log(res.body);

      callback(session.attributes,
          buildSpeechletResponse(cardTitle, res.body.message, "", true));
  });
}

function handleHelpRequest(intent, session, callback) {
    var cardTitle = "Help";
    var speechOutput = "You can ask Find My Phone to call your phone or you can add your phone number by saying add.";

    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "", false));
}

function handleStopRequest(intent, session, callback) {
    var cardTitle = "Stop";
    var speechOutput = "";

    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "", true));
}


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
