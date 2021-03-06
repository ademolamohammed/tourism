const express = require("express")

const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')



const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

//protect all routes after this middleware
router.use(authController.protect)

router.patch('/updateMypassword', authController.updatePassword)
router.get('/me',userController.getMe, userController.getUser)
router.patch('/updateMe',userController.uploadUserPhotos, userController.resizeUserPhoto, userController.updateMe)
router.delete('/deleteMe', userController.deleteMe)
//router.post('/resetPassword', authController.resetPassword)


router.use(authController.restrictTo('admin'))
router
	.route('/')
	.get(userController.getAllUser)
	.post(userController.createUser)



router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)

	.delete(authController.protect, 
	authController.restrictTo('admin','lead-guide'), 
	userController.deleteUser)



module.exports = router