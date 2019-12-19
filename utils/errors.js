class SessionExpiredError extends Error {
    constructor(message){
        super(message);
        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, SessionExpiredError);
        }
        this.name = 'SessionExpiredError';
        this.message = message;
        this.date = new Date();
    }
}

class UnauthorizedAccessError extends Error {
    constructor(message){
        super(message);
        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, UnauthorizedAccessError);
        }
        this.name = 'UnauthorizedAccessError';
        this.message = message;
        this.date = new Date();
    }
}

class InvalidInputError extends Error {
    constructor(message){
        super(message);
        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidInputError);
        }
        this.name = 'InvalidInputError';
        this.message = message;
        this.date = new Date();
    }
}

class InvalidTokenError extends InvalidInputError {
    constructor(message){
        super(message, params);
        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidTokenError);
        }
        this.name = 'InvalidTokenError';
    }
}


Error.prototype.status = 400;
 
module.exports = {
    SessionExpiredError,
    UnauthorizedAccessError,
    InvalidTokenError,
    InvalidInputError
} 