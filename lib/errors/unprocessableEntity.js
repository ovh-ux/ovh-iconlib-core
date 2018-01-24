'use strict';

const CustomError = require('./custom');

class UnprocessableEntityError extends CustomError {
    constructor(message) {
        super(message, 422);
    }
}

module.exports = UnprocessableEntityError;
