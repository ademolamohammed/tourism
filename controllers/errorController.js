const AppError = require('./../utils/appError')

const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}`
	return new AppError(message,400)
}

const handleDuplicateFieldsDB  = err => {
	const value = err.errmsg.match(/(["']) (\\?.)* ?\1/) [0]
	const message = `duplicate field value: ${value}. please use another value`
	return new AppError(message,400)
}

const handleValidationErrorDB = err => {
	const error = Object.values(err.errors).map(el => el.message) //the object.value takes one array in a data of lots of array 
	//and acts on the one array
	const message = `invalid input data ${error.join('. ')}`
	return new AppError(message,400)
}


const handleJsonWebTokenError = err => {
 return new AppError('invalid token,please sign in to get a valid token',400)
}

const handleTokenExpiredError = () => {
return 	 new AppError('Token is expired,please re-login',400)
}




const sendErrorDev = (err,res)=> {
	res.status(err.statusCode).json({
		status: err.status,
		message:err.message,
		error :err,
		stack: err.stack
	})
}



const sendErrorProd = (err,res) => {
	// operational error. this is a trusted error and can be viewed by the client
	if(err.isOperational) {
		res.status(err.statusCode).json({
		status: err.status,
		message:err.message
		
	})
	// programming error. we dont want te client to know our flaws. intead we log it to see for ourselves
	} else {
		//console.error('ERROR!!', err)
		res.status(500).json({
			status: 'error',
			message: 'something went very wrong!'
		})
	}


	
}


module.exports = (err,req,res,next)=> {
	 err.statusCode = err.statusCode || 500
	err.status = err.status || 'error'

if (process.env.NODE_ENV === 'development') {
	sendErrorDev(err,res)
}

else if (process.env.NODE_ENV === 'production') {
	let error = {...err}
	if (error.name === 'CastError') {
		error = handleCastErrorDB(error)
	}
	if (error.code === 11000) {
		error =handleDuplicateFieldsDB(error)
	}
	if (error.name === 'ValidationError') error = handleValidationErrorDB(error)

	if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError(error)

	if (err.name == 'TokenExpiredError') error = handleTokenExpiredError()
	sendErrorProd(error,res)	
}
	
}