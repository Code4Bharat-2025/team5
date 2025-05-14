const model = require('../../model');
const { Text, Button } = require('../../utils/message-types');
const { getQuestionOptionsArray } = require('../../utils/helpers');
const logger = require('../../utils/logger');

const awaiting_number_for_trivia = async ({
  waNumber,
  userMobile,
  userContext,
  userMedium,
  userMessage,
  isReturn = false,
}) => {
  const responseMessage = []; // Declare responseMessage here

  if (userContext.stepName === 'awaiting_number_for_trivia') {
    if (!isNaN(userMessage)) {
      const number = parseInt(userMessage, 10); // Convert the input to a number

      try {
        // Call Numbers API for the provided number
        const response = await fetch(`http://numbersapi.com/${number}?json`);
        const data = await response.json(); // Parse JSON

        // Send the trivia fact to the user
        responseMessage.push(new Text(`Here's a trivia fact about the number ${number}: **${data.text}**`));
      } catch (err) {
        logger.error('Failed to fetch trivia fact from Numbers API', { err });
        responseMessage.push(new Text("Sorry, I couldn't fetch a fact about that number. Please try again later."));
      }

      // Reset the user's context
      userContext.stepName = 'entryPoint';
    } else {
      // If the user input is not a valid number, ask again
      responseMessage.push(new Text("That doesn't seem like a valid number. Please provide a valid number."));
    }

    // Send the response
    model.sendMessage(waNumber, userMobile, responseMessage).catch((err) =>
      logger.error('Send Message Failure ', {
        waNumber,
        userMobile,
        responseMessage,
        err: model.constructError(err),
      })
    );
    return;
  }
};

module.exports = awaiting_number_for_trivia;