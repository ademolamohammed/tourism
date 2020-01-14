const path = require('path') // use to access routes, use to know the actual path, works with __dir
const express = require("express") // the application itself
const morgan =require("morgan") //a middleware used for logging status and status codes to the console
const helmet = require('helmet')
const rateLimit = require('express-rate-limit') //use to limit access to our application to a number of time specified
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')
const bookingRouter = require('./routes/bookingRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const hpp =require('hpp')
const cookieparser = require('cookie-parser') //used to parse data from cookies

//NOTE==>to use middlewares, we go 'app.use' all app.use are middlewares
const app=express()

app.set('view engine', 'pug')  // pug is the templating engine we would be using

//serving static files
app.use(express.static(path.join(__dirname,'public'))) //note your css and images and javascript are in public so views could use 
app.set('views', path.join(__dirname, 'views'))

//set security HTTP headers
app.use(helmet())

//development logging
if (process.env ==='development') {
	app.use(morgan('dev'))
}
//this is use to block requests from a single IP
const limiter = rateLimit({
	max:100,
	windowsMs:60*60*1000,
	message:'Too many request from this ip, try again in an hour'

})

//you use the limiter on all routes starting with /api/
app.use('/api',limiter)

app.use(morgan('dev'))

//bodyparser, makes req.body available
app.use(express.json({limit: '10kb'})) // parses the data from the body
//this is like bodyParser, its comes inbuilt with express now. you can easily parse request with it.
//example of req is  req.body, and you'll be able to access your data.
app.use(express.urlencoded({extended:true, limit: '10kb'})) // use to parse value from a form input.wihtout this value from 
//a form will never be parsed down to req.body
app.use(cookieparser()) // passes the data from the cookie

//data sanitization against nosql query injection  
app.use(mongoSanitize())

//sanitization against cross script attack
app.use(xss())



//prevent parameter pollution
app.use(hpp({
	whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'Price', 'duration']
}))

//test middleware
app.use((req,res,next)=>{
	req.requestTime = new Date().toISOString();
	//console.log(req.cookies)  // tho console.log the cookie datas 
	
	next()
})


//console.log(tours)
//nNOTE:: this tours is defined as a global variable so that we can get it,post to it and also get a tour
//of a particular id. without having to define another tour from scratch eact time we want to run anything
app.use('/',  viewRouter)
app.use('/api/v1/tours',  tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)  //whenever a /api/v1/reviews is called,the middleware calls the reviewRouter beside it
//immediately which then run our functions
app.use('/api/v1/bookings', bookingRouter)

app.all('*',(req,res,next)=> {
	// res.status(404).json({
	// 	status: 'Failed',
	// 	message: `can't find the path ${req.originalUrl} on the server`
	// })
	// // const err = new Error (`can't find the path ${req.originalUrl} on the server`)
	// // err.status = 'fail',
	// // err.statusCode = 400
	// //next(err)
	// next()

next(new AppError(`can't find the path ${req.originalUrl} on the server!`, 404))

})


app.use(globalErrorHandler)
 







 //  //the file in the old 
 //${__dirname}/4-natours/dev-data/data/tours-simple.json is overriden by the newfile coming in, if we write on a 
 //file that contains a data, the old data is overriden and the new one takes its place

 	

//responding to url parameter


// //how to handle patch request
// app.patch('api/v1/tours/:id',(req,res)=> {
	
// })

// app.get('/', (req,res)=> {
// 	res.send('hello there')
// })



module.exports = app