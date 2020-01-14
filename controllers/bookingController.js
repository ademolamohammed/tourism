const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY) 
// means of payment. create an account on stripe.com to get started and get a secret key
const Tour = require('../models/tourModel')
const Booking = require('../models/bookingModel')
const catchAsync = require('../utils/catchAsync')
const AppError= require ('../utils/appError')
const factory = require('./handlerFactory')



exports.getCheckoutSession = catchAsync(async(req,res,next)=> {
// 1) get the current  tour 
const tour = await Tour.findById(req.params.tourId)


//2) create checkout session
const session =  await stripe.checkout.sessions.create({						// this are about the sesssions
payment_method_types: ['card'],										
success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
// when te payment is sucesful, link to the	 homepage
cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`, //when payment is cancelled or declined  link to the tour page
customer_email:req.user.email,										
client_reference_id: req.params.tourId,		
//line 9-18 is for information about the session



line_items: [

	{
		name: `${tour.name} Tour`,									
		description: tour.summary,											
		images: [`https://www.natours.dev/img/tours/${tour.imageCover}`], // images must be uploaded to a live website 
		//and natours is live, so we choose an image from our database which is the same image on the natours  website
		amount: tour.price * 100,											
		currency: 'usd',													
		quantity:1															
	}
]
//line 21-3i is for information about the product itself

})
//3) create session response
res.status(200).json({
	status: 'success',
	session
})


})

exports.createBookingCheckout = catchAsync(async(req,res,next)=> {
	//this is only tempoary as everyone can make booking without paying 
	const {tour,user,price} = req.query // req.query is the one on line 17, there you can get your tour,user and price from there

	if (!tour && !user && !price) return next()

	await Booking.create({tour,user,price})
	// the create function will automatically create the collection on the database once this route is called. and it's will create
	//the databsse based on the parameter specified on the req.body. here we are creating the bookings with tour,user and price
	//NOTE: we have alredy populated the bookings with the tour and user on the bookings model using mongoose.Schema.objectId
	//to create a reference, we just then populate it 
	res.redirect(req.originalUrl.split('?')[0])
})

exports.createBooking = factory.createOne(Booking)
exports.getBooking = factory.getOne(Booking)
exports.getAllBookings = factory.getAll(Booking)
exports.updateBooking = factory.updateOne(Booking)
exports.deleteBooking = factory.deleteOne(Booking)