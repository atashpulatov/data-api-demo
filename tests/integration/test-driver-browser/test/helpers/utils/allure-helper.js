import allureReporter from '@wdio/allure-reporter';

/**
   * This function is used to show console log with the desired text and to add a step in the allure-report tool with the same text.
   * It also closes the latest step, so this function is used in the middle of the steps
   *
   * @param {Text} message indicates the message shown in the console log and in the step of the allure-report tool.
   */
export function logStep(message) {
  allureReporter.endStep();
  console.log(message);
  allureReporter.startStep(message);
}

/**
     * This function is used to show console log with the desired text and to add a step in the allure-report tool with the same text.
     * This function is used as the first step because it doesn't close the previous step
     *
     * @param {Text} message indicates the message shown in the console log and in the step of the allure-report tool.
     */
export function logFirstStep(message) {
  console.log(message);
  allureReporter.startStep(message);
}

/**
       * This function ends the last step added to the allure-report tool with the same text
       */
export function logEndStep() {
  allureReporter.endStep();
}
