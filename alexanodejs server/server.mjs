import express from "express";
import Alexa, { SkillBuilders } from 'ask-sdk-core';
import morgan from "morgan";
import { ExpressAdapter } from "ask-sdk-express-adapter";

const app = express();
app.use(morgan("dev"))
const PORT = process.env.PORT || 8080;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome buddy! can you tell your whole name dude?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye and have a great day!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const SendRequestIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SendRequestIntent';
    },
    handle(handlerInput) {
        // Retrieve the name slot value from the request
        const name = Alexa.getSlotValue(handlerInput.requestEnvelope, 'name');

        if (!name) {
            // If the name slot value is not provided or not valid, prompt the user to provide it.
            return handlerInput.responseBuilder
                .speak('Please provide your name.')
                .reprompt('To get started, please tell me your name.')
                .getResponse();
        }

        // Here, you can process the name value and use it in any way you need
        // For this example, we'll just return a simple response with the name
        const speakOutput = `Hello, ${name}! How are you doing today?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
 

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
}; 

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



const skillBuilder = SkillBuilders.custom()
.addRequestHandlers(
    LaunchRequestHandler,
    CancelAndStopIntentHandler,
    SendRequestIntentHandler,
    HelpIntentHandler,
    
)
.addErrorHandlers(
    ErrorHandler
)

const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, false, false);
app.post('/api/v1/webhook-alexa', adapter.getRequestHandlers());

app.use(express.json())

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});