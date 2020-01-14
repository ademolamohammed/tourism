const crypto = require('crypto')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Email = require('./../utils/email')

const signToken = id=> {
	return  jwt.sign({id}, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN
	 })
}





const createSendToken= (user,statusCode,res)=> {
	const token = signToken(user._id)
	const cookieOption= {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
		httpOnly:true
	}





	
if(process.env.NODE_ENV === 'production') cookieOption.secure = true //the if statement ends here

	res.cookie('jwt',token,cookieOption)
	user.password = undefined
	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user
		}
	})
}







// const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {
// 	expiresIn: process.env.JWT_EXPIRES_IN
// })







exports.logout= (req,res)=> {
	res.cookie('jwt', 'loggedout',{
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly:true
	})
	res.status(200).json({status: 'success'})
}








exports.signup = catchAsync(async(req,res,next) => {
	const newUser = await User.create({
		name:req.body.name,
		email:req.body.email,
		password:req.body.password,
		confirmPassword: req.body.confirmPassword,
		passwordChangedAt:req.body.passwordChangedAt,
		role:req.body.role
	})
	const url = `${req.protocol}://${req.get('host')}/me`
	await new Email(newUser,url).sendWelcome()
	createSendToken(newUser,201,res)

	
})








exports.login = catchAsync(async(req,res,next)=> {
	// 1) check must contain username and password before submitting
	const email= req.body.email
	const password = req.body.password

	if(!email || !password) {
		return next(new AppError('field must contain an email or a password', 400))
	}

	// 2) check if user exits && password is correct
	const user = await User.findOne({email}).select('+password')
	//const correct = await user.correctPassword(password,user.password)

	if (!user || !(await user.correctPassword(password,user.password))) {
	return	next(new AppError('incorrect email or password',401))
	}
	
	 createSendToken(user,200,res )
})







exports.isLoggedIn = async(req,res,next)=> {
//accepting a token and using the token to access protected route
 if (req.cookies.jwt) {
 	try {
 //verifiying if the token is genuine or not  this line of code makes sure the token i specifically correct and genuine
const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
// check if user still exists
const freshUser = await User.findById(decoded.id)
//NOTE:: the user's id is also in the decoded. freshUser then confirm if the user trying to login has the same id with the
//one in the decoded, if yes then the user is logged in and is an an active user, if not then there is no active logged in user
if (!freshUser) {
	return next()
}
//check if user changed password after token was issued
if(freshUser.changedPasswordAfter(decoded.iat)) {
	return next()
}
res.locals.user = freshUser   //req.locals can be accessed everywhere on the pug templates.and it inturns hold the freshUser
//which iturnes tells if a user is logged in or not
return next()
} catch(err) {
	return next()
}
// Grant access to protected route
}
next()

}











exports.restrictTo = (...roles) => {
	//here the role must have been set on the user routes  and note req.user i.e freshUser has the role status in it just has it
	// has an id and password and the rest. so you can access the role in it
 return	(req,res,next) => {
 	if(!roles.includes(req.user.role)) {
 	return	next (new AppError('you do not have access to access this route', 403))
 	}
 	next()
 }
 
}











exports.protect = catchAsync(async(req,res,next)=> {
//accepting a token and using the token to access protected route
 let token

 if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
 	token = req.headers.authorization.split(' ')[1]

 } else if (req.cookies.jwt) {
 	token = req.cookies.jwt 
 }

 if(!token) {
 	return next(new AppError("you're not loged in, login to access,400"))
 }
 

 //verifiying if the token is genuine or not  this line of code makes sure the token is specifically correct and genuine
const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

// check if user still exists
const freshUser = await User.findById(decoded.id)
if(!freshUser) {
return	next (new AppError('the user beloging to this token does not exist', 401))
}

//check if user changed password after token was issued
if(freshUser.changedPasswordAfter(decoded.iat)) {
	return next(new AppError('user recently changed password!, please login again',401))
}

req.user = freshUser
res.locals.user = freshUser
next()
// req.user is available globally every where, so far protected route has already been ran
// Grant access to protected route

})










exports.restrictTo = (...roles) => {
	//here the role must have been set on the user routes  and note req.user i.e freshUser has the role status in it just has it
	// has an id and password and the rest. so you can access the role in it
 return	(req,res,next) => {
 	if(!roles.includes(req.user.role)) {
 	return	next (new AppError('you do not have access to access this route', 403))
 	}
 	next()
 }
 
}








exports.forgotPassword = catchAsync(async(req,res,next)=> {
	// check if user exist
	//const user = User.findOne({email:req.body.email})
	const email = req.body.email
	const user = await User.findOne({email})
	if (!user) {
		return next(new AppError('there is no user  with the email address',401))
	}

	//call the fuction frm the user model
	const resetToken = user.createPasswordResetToken()  
	//validation turned off till before save
	await user.save({validateBeforeSave: false})


	// const message = `forgot your password? submit a PATCh request wih your password and your PasswordConfirm to ${resetURL}.\n if 
	// didnt forget your paswword,please ignore this email`

	//creating an instance of the sendEmail
	try {
		// await sendEmail({
		// email:user.email,  //email,subject,message are all our options
		// subject: 'your password reset token, (valid for 10min)',
		// message 
	//})
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

	await new Email(user,resetURL).sendPasswordReset()

res.status(200).json({
	status: 'success',
	message:  'token sent to email'
})
} catch(err) {
	user.passwordResetToken = undefined  
	user.passwordResetExpires = undefined
	await user.save({validateBeforeSave: false})

	return next(new AppError('There was an error sending the email,try later!',500))
}


})










exports.resetPassword = catchAsync(async(req,res,next)=> {
	//1) get user based on the token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')


	const user = await User.findOne({passwordResetToken:hashedToken, passwordResetExpires: { $gt: Date.now() }})
	 
	

	//2)if token has not expired,and there is user,  set the password
	if (!user) {
		return next(new AppError('Token is invalid or has expired', 400))
	}

	

	//3) update password changedAt for the current user
	user.password = req.body.password
	user.confirmPassword = req.body.confirmPassword
	user.passwordResetToken = undefined
	user.passwordResetExpires = undefined
	await user.save()

	//4) log user in, jwt token
	createSendToken(user,200,res)
})







exports.updatePassword = catchAsync(async(req,res,next)=> {
	//1) get user from collection 
	
	const user = await User.findById(req.user.id).select('+password')
	

	//2) check if posted current user is correct
	if(!(await user.correctPassword(req.body.passwordConfirm,user.password))){
		return next (new AppError('your current password is wrong.',401))
	}

	//3)if so update password
	user.password = req.body.password
	user.confirmPassword = req.body. confirmPassword
	await user.save()

	//4) log user in seending jwt token
	createSendToken(user,200,res)
})





