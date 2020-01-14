const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const Booking = require('../models/bookingModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.getOverview = catchAsync(async(req,res,next)=> {
	//1) get data from collection
	const tours = await Tour.find()
	//2) build template
	//3)render that tempelate using tour data from 1 
	res.status(200).render('overview',{
		title:'All Tours',
		tours
	})
})


exports.getTour = catchAsync(async(req,res,next)=> {
	const tour = await Tour.findOne({slug:req.params.slug}).populate({
		path:'reviews',
		fields: 'review rating user'
	})

if(!tour) {
	return next(new  AppError('there is no tour with that name', 404))
}
	res.status(200).render('tour',{
		title:`${tour.name} Tour`,
		tour
	})
})


exports.getLoginForm= async(req,res)=> {
	//const user = await User.findOne(req.body)

	res.status(200).render('login', {
		title:'Log into your account',
		
	}) 
}


exports.getAccount= (req,res)=> {
	res.status(200).render('account',{
		title:'your account'
	})
}


exports.getMyTours= async(req,res,next) => {
	//we should have used virtual populate to insert a booking into a user as well just as we already habe a user inside a booking
	//but here we aretrying a new approach which gives same result

	//1) finding all bookings
	const bookings = await Booking.find({user:req.user.id})
//1)find the userID which comes from req.use.id and save it in the bookis
//2)this bookings now contains a user,tour and a price

	//2)find tours with the returned IDs
	const tourIDs= bookings.map(el=> el.tour)
//3)here then we can map the array to specifically get the tour

	const tours = await Tour.find({ _id: {$in:tourIDs} })
//4)then we can get the id of the tour dirctly from this nice handy operator { _id: {$in:tourIDs} }
	res.status(200).render('overview', {
//5) we can render on the overview's page directly or wecan create a new one if we want
		title: 'My Tours',
		tours
	})
}



exports.updateUserData = catchAsync(async(req,res,next)=>  {
	const updatedUser = await User.findByIdAndUpdate(req.user.id, {
		name: req.body.name,
		email:req.body.email
	}, {
		new:true,
		runValidators:true
	})
	res.status(200).render('account',{
		title:'your account',
		user: updatedUser
	})
})

