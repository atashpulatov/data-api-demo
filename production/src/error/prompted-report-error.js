export function PromptedReportError(error = {}) {
  this.status = error.status;
  this.response = error.response;
  this.message = error.message;
};
PromptedReportError.prototype = new Error();

