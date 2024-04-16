class ErrorResponse
{
    constructor (error) {
        this.status = 'error',
        this.error = error
    }
}

module.exports = ErrorResponse;
