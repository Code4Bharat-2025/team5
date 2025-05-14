const model = require('../../model');
const { Text, Button } = require('../../utils/message-types');
const { getQuestionOptionsArray } = require('../../utils/helpers');
const logger = require('../../utils/logger');

const entryPoint = async ({
  waNumber,
  userMobile,
  userContext,
  userMedium,
  userMessage,
  isReturn = false,
}) => {
  const responseMessage = [];

  // Set the step name
  if (!userContext.stepName) {
    userContext.stepName = 'entryPoint';
  }
  console.log('Printing userMessage in entryPoint:', userMessage);

  // Check if the user selected a button option
  if (userMessage === "1") {
    try {
      // Call Numbers API for a random fact
      const response = await fetch(`http://numbersapi.com/random?json`);
      const data = await response.json(); // Parse JSON

      // Send the random fact to the user
      responseMessage.push(new Text(`Here's an interesting fact: **${data.text}**`));
    } catch (err) {
      logger.error('Failed to fetch random fact from Numbers API', { err });
      responseMessage.push(new Text("Sorry, I couldn't fetch a fact right now. Please try again later."));
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

  // Check if the user selected "Get Fun Facts About Date"
  if (userMessage === "2") {

    try {
      // Call Numbers API for today's date fact
      // Send the fact about today's date
      responseMessage.push(new Text(`Enter a number to get a trivia fact about it!`));
    } catch (err) {
      logger.error('Failed to fetch fact about today\'s date from Numbers API', { err });
      responseMessage.push(new Text("Sorry, I couldn't fetch a fact about today's date. Please try again later."));
    }

    // Send the response
    userContext.stepName = 'awaiting_number_for_trivia';
    await model.updateUserContext(userMobile, userContext);
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
  console.log('Printing userContext:');
  console.log(userContext);
    if (userContext.stepName === 'awaiting_number_for_trivia') {

      console.log('Inside awaiting_number_for_trivia');
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

  // Default response with text, surprise text, and buttons
  responseMessage.push(new Text("Welcome! to Number Nuggets"));

  const today = new Date();
  const month = today.getMonth() + 1; // Months are 0-indexed
  const day = today.getDate();

  try {
    const response = await fetch(`http://numbersapi.com/${month}/${day}/date?json`);
    const data = await response.json(); // Parse JSON
    responseMessage.push(new Text(`Here's a surprise fact about today: **${data.text}**`));
  } catch (err) {
    logger.error('Failed to fetch fact from Numbers API', { err });
    responseMessage.push(new Text("Here's a surprise text: Life is full of surprises!"));
  }

  // Add buttons
  responseMessage.push(
    new Button(
      new Text('Please select an option:'),
      getQuestionOptionsArray(['Surpirse Me', 'Trivia'])
    )
  );

  // Send the response
  model.sendMessage(waNumber, userMobile, responseMessage).catch((err) =>
    logger.error('Send Message Failure ', {
      waNumber,
      userMobile,
      responseMessage,
      err: model.constructError(err),
    })
  );
};

module.exports = entryPoint;