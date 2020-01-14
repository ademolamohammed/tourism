const multer = require('multer') // use in photo upload
const sharp = require('sharp') //image processing library for node js 
const catchAsync = require('./../utils/catchAsync')
const User = require('./../models/userModel')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')



// const multerStorage = multer.diskStorage({
// 	destination: (req,file,cb) => {
// 		cb(null, 'public/img/users')   		//cb() the first parameter is used for handling errors
// 	},
// 	filename: (req,file,cb) => {	
// 	// file= 'images/jpg'
// 	const ext = file.mimetype.split('/')[1]
// 	//user-76ew45shy6sh(userId)-67395542(Timestamp).jpg
// 		cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)
// 	}
// })

const multerStorage = multer.memoryStorage()	//here the image is stored in memory and not on the disk. and it is available
//on req.buffer

const multerFilter = (req,file,cb) => {			//multerFilter to make sure the file uploding is only a photo
	console.log('req.file')
	if (file.mimetype.startsWith('image')) {	//mimetype is available on req.files 
		cb(null,true)
	}else {

		cb(new AppError('Not an image,please upload an image',400),false)
	}
	}
	
	const upload = multer({
		storage: multerStorage,
		fileFilter:multerFilter
	})  // configuring the multer for image upload
	//NOTE:: images are not uploaded directly to our database, instead they are uploaded into our  file system e.g Public. and a link
	//is then added to our database i.e a link to that image
	
	
	exports.uploadUserPhotos = upload.single('photo')
	
	exports.resizeUserPhoto = catchAsync(async(req,res,next) => {

		if(!req.file) return next()
		req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`	//how the file is saved on the dataBase the filename helps with the real storage
	await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`)

	next()

	})
	
	const filterObj = (obj, ...allowedFields) => {
		const newObj = {}
		Object.keys(obj).forEach(el=>{
			if (allowedFields.includes(el)) newObj[el] = obj[el]
		});
		return newObj
	}



exports.getAllUser= catchAsync(async(req,res,next)=> {
	const user = await User.find()

		 res.status(200).json({
		 	status: 'success',
		 	data: {
		 		user
		 	}
		 })
	})


exports.getMe= (req,res,next)=> {
	req.params.id = req.user.id
	next()
} 


exports.updateMe = catchAsync(async(req,res,next) => {
	// console.log(req.file)
	// console.log(req.body)

	//1)  create error if user tries to update password
if(req.body.password || req.body.confirmPassword) {
	next (new AppError('this route is not for password updates, pls go to /updateMyPassword',400))
}
const filteredBody = filterObj(req.body, 'name', 'email')
if (req.file) filteredBody.photo = req.file.filename
const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
	new:true,
	runValidators:true
})
res.status(200).json({
	status:'success',
	data: {
		user:updatedUser
	}
})
})




exports.deleteMe = catchAsync(async(req,res,next)=> {
	await User.findByIdAndUpdate(req.user.id, {active:false})

	res.status(204).json({
		status:'success',
		data:'null'
	})
})


exports.getUser= factory.getOne(User)


exports.createUser= factory.getAll(User)


exports.updateUser= factory.updateOne(User)


exports.deleteUser=factory.deleteOne(User)
