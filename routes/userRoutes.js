const express = require("express")

const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')



const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)
router.patch('/updateMypassword', authController.protect, authController.updatePassword)
router.patch('/updateMe', authController.protect, userController.updateMe)
router.delete('/deleteMe', authController.protect, userController.deleteMe)
//router.post('/resetPassword', authController.resetPassword)


router
	.route('/')
	.get(userController.getAllUser)
	.post(userController.createUser)



router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser)



module.exports = router