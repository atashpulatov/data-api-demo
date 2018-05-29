const ALPHABET_RANGE_START = 1;
const ALPHABET_RANGE_END = 26;
const ASCII_CAPITAL_LETTER_INDEX = 65;

function getRange(headerCount) {
    let endRange = '';
    for (let firstNumber = ALPHABET_RANGE_START,
        secondNumber = ALPHABET_RANGE_END;
        (headerCount -= firstNumber) >= 0;
        firstNumber = secondNumber, secondNumber *= ALPHABET_RANGE_END) {
        endRange = String.fromCharCode(parseInt(
            (headerCount % secondNumber) / firstNumber)
            + ASCII_CAPITAL_LETTER_INDEX)
            + endRange;
    }
    return `A1:${endRange}1`;
}

function handleOfficeApiException(error) {
    console.log('error: ' + error);
    if (error instanceof OfficeExtension.Error) {
        console.log('Debug info: ' + JSON.stringify(error.debugInfo));
    }
}

export default {
    handleOfficeApiException: handleOfficeApiException,
    getRange: getRange,
};
