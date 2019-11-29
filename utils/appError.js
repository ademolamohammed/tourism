class AppError extends Error {
	constructor(message,statusCode,status){
	super(message) 
		this.statusCode = statusCode
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error' //this is for the part of the message 
		this.isOperational = true

		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = AppError