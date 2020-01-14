const AppError = require('./../utils/appError')

const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}` //the err has the path attribute and the value attribute which we passed to it
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




const sendErrorDev = (err,req,res)=> {
	//A) for our Api
	//original url is the url excluding the hostname. eg api/users is the original url
	if(req.originalUrl.startsWith('/api')) {   
		return res.status(err.statusCode).json({
		status: err.status,
		message:err.message,
		error :err,
		stack: err.stack
	})
	} else {
		//B) for our rendered website
		console.error('ERROR!!', err)
		return res.status(err.statusCode).render('error',{
			title:'something went wrong',
			msg:err.message
		})
	}
	
}



const sendErrorProd = (err,req,res) => {




	//A) operational error. this is a trusted error and can be viewed by the client
if(req.originalUrl.startsWith('/api')) {
	if(err.isOperational) {
		return res.status(err.statusCode).json({
		status: err.status,
		message:err.message
		
	})
	} else

	//B) programming error. we dont want the client to know our flaws. intead we log it to see for ourselves
		//console.error('ERROR!!', err)
		return res.status(500).json({
			status: 'error',
			message: 'something went very wrong!'
		})
	
}









	//B)For Rendered Website
	if(err.isOperational) {
	return res.status(err.statusCode).render('error',{
			title:'something went wrong',
			msg:err.message
		})
	// programming error. we dont want the client to know our flaws. intead we log it to see for ourselves
	} else {
		console.error('ERROR!!', err)
		return res.status(err.statusCode).render('error',{
			title:'something went wrong',
			msg:'please try again later'
		})
	}


	
}


module.exports = (err,req,res,next)=> {
	 err.statusCode = err.statusCode || 500
	err.status = err.status || 'error'

if (process.env.NODE_ENV === 'development') {
	sendErrorDev(err,req,res)
}

else if (process.env.NODE_ENV === 'production') {
	let error = {...err}
	error.message = err.message
	if (error.name === 'CastError') {
		error = handleCastErrorDB(error)
	}
	if (error.code === 11000) {
		error =handleDuplicateFieldsDB(error)
	}
	if (error.name === 'ValidationError') error = handleValidationErrorDB(error) //error is the real error coming from line 108 and
		//its the one we actually passed to  handleValidationErrorDB,handleCastErrorDB and the rest. it is the one 
	//that has all of the error and  its details, and its is in there message is able to gets its data
	//  that message is able to use in the app error.
	// NOTE::  message requires info about the error to display a nice neat appError message. this info that message
	//use is the one coming from line 108. look it through, you will understand 

	if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError(error)

	if (err.name == 'TokenExpiredError') error = handleTokenExpiredError()
	sendErrorProd(error,req,res)	
}

	
}