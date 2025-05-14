/* eslint-disable strict */
/* eslint-disable max-len */

const entryPoint = require('./entry-point');
const awaitMedium = require('./await-medium');
const awaitNext = require('./await-next');
const awaitName = require('./await-name');
const awaitViewMessageTypes = require('./await-view-message-types');
const awaiting_number_for_trivia = require('./awaiting-number-for-trivia');

const steps = {
  entryPoint,
  awaitMedium,
  awaitNext,
  awaitName,
  awaitViewMessageTypes,
  awaiting_number_for_trivia,
};

const processMessage = async (
  waNumber,
  userMobile,
  userMessage,
  userContext,
  userMedium,
  isReturn
) => {
  try {
    const currentStep = steps[userContext.stepName];
    return await currentStep({
      waNumber,
      userMobile,
      userMessage,
      userContext,
      userMedium,
      isReturn,
    });
  } catch (e) {
    throw e;
  }
};

module.exports = {
  processMessage,
};
