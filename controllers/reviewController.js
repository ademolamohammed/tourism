const mongoose = require('mongoose')
const Review = require('./../models/reviewModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')










exports.setToursUserId = (req,res,next)=> {
	if(!req.body.tour) req.body.tour = req.params.tourId
	if(!req.body.user) req.body.user = req.user.id 
		next()
}


// exports.createReview = catchAsync(async(req,res,next)=> {
// 	// Allow nested routes
// if(!req.body.tour) req.body.tour = req.params.tourId
// if(!req.body.user) req.body.user = req.user.id    //Note the req.user.id is from the protect middleware where it is been global, 
// 	//which is the Id of a logged in fresh user/ current user
//  const newReview = await Review.create(req.body)
//  if (!newReview) {
//  	next (new AppError('there must be a reviw field',400))
//  }
//  res.status(201).json({
//  	status:'success',
//  	data:{
//  		newReview
//  	}
//  })

// })
exports.getAllReview = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
exports.deleteReview = factory.deleteOne(Review)
exports.updateReview= factory.updateOne(Review)





