const express = require('express')
const viewsController = require('../controllers/viewsController')
const authController = require('./../controllers/authController')
const bookingController = require('./../controllers/bookingController')





const router = express.Router()

//router.use(authController.isLoggedIn)  //this middleware confirm If one is logged In or not so it could implement login and logout 
//NOTE:: isLoggedIn id different from authController.protect isLoggedIn is use to know whether to to display the login or the logout

router.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewsController.getOverview )

router.get('/tour/:slug',authController.isLoggedIn, viewsController.getTour)

router.get('/login',authController.isLoggedIn, viewsController.getLoginForm)

router.get('/me', authController.protect, viewsController.getAccount)

router.get('/my-tours', authController.protect, viewsController.getMyTours)


router.post('/submit-user-data',authController.protect, viewsController.updateUserData)





module.exports = router