class APIError extends Error {
    constructor(
        statusCode=500, 
        message="Unexpected Error Occurred", 
        errors=[], 
        stack="") 
        {
        super(message);
        this.statusCode = statusCode; 
        this.message = message
        this.errors = errors; 
        this.data=null;
        this.success=false;

        if(stack) {
            this.stack = stack; // Capture the stack trace if provided
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
     
    }}

export {APIError}
