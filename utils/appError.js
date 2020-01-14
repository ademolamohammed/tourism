class AppError extends Error {
  constructor(message,statusCode,status){   //anything you want to pass to a class in form of an argument will be in the constructor
	super(message) 
		this.statusCode = statusCode
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error' //this is for the part of the message 
		this.isOperational = true

		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = AppError