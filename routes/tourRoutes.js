const express = require("express")
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')
//const reviewController = require('./../controllers/reviewController')
const reviewRouter = require('./../routes/reviewRoutes')



const router = express.Router()
//router.param('id',tourController.checkID)

// creating Nested Routes. example
//POST tour/23hfi7hd8/reviews	post a review  on a tour with the tourId
//Get tour/6728gucdhw8/reviews   get reviews for a given tourID
//Get tour/542ggw/review/hhhke643  get a review of an id for a given tourId
//here we actuall will use mergeParams, 
// router.route('/:tourId/reviews')
// .post(authController.protect,authController.restrictTo('user'),reviewController.createReview)

router.use('/:tourId/reviews', reviewRouter)  //when /:tourId/reviews is invoked reviewRouter is called




router
.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)

router.route('/getMonthlyPlan/:year').get(tourController.getMonthlyPlan)

router
	.route('/')
	.get(authController.protect, tourController.getAllTours)
	.post(//tourController.checkBody,
		tourController.createTour)
//app.route('/api/v1/tours').post(createTour)
// app.route('/api/v1/tours/:id').get(getTour)
// app.route('/api/v1/tours/:id').patch(updateTour) 
// app.delet('/api/v1/tours/:id').delete(deleteTour)
router
	.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(authController.protect, authController.restrictTo('admin','lead-guide'), tourController.deleteTour)






module.exports = router 