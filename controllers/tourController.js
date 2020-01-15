//const fs = require("fs")

//const tours= JSON.parse(fs.readFileSync(`${__dirname}/../4-natours/after-section-06/dev-data/data/tours-simple.json`))
const Tour = require('./../models/tourModel')
// const apiFeatures =require('./../utils/APIFeatures')
const multer = require('multer')
const sharp = require('sharp') 
const catchAsync = require('./../utils/catchAsync')
const AppError= require ('./../utils/appError')
const factory = require('./handlerFactory')


// exports.checkID = (req,res,next,val) => {
// 	console.log(`tour id is ${val}`)
// 	if(req.params.id * 1>tours.length) {
//  		return res.status(400).json({
//  			status : "action failed",
//  			message: "invalid array lenght"
//  		})
//  	}
//  	next()
// }



const multerStorage = multer.memoryStorage()	//here the image is stored in memory and not on the disk. and it is available
//on req.buffer

const multerFilter = (req,file,cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null,true)
	}else {

		cb(new AppError('Not an image,please upload an image',400),false)
	}
	}
	
const upload = multer({
	storage: multerStorage,
	fileFilter:multerFilter
})



exports.uploadTourImages = upload.fields([
	{name:'imageCover', maxCount:1},
	{name:'images', maxCount:3}
])
//Note when there is one file to be uploaded we use upload.single('image')
//Note when there is multiple file to upload we use upload.array('image',5)
//Note when there is a mix of files to upload we use upload.fields({
	//{name:'imageCover', maxCount:1},
	//{name:'images', maxCount:3}
//})

exports.resizeTourImages = catchAsync(async(req,res,next)=> {
	//console.log(req.files)
	if(!req.files.imageCover || !req.files.images) return next()
		//console.log(req.files.imageCover)
		// 1) Cover image

	 req.body.imageCover =  `tours-${req.params.id}-${Date.now()}-cover.jpeg`
   await sharp(req.files.imageCover[0].buffer)
				.resize(2000,1333)
				.toFormat('jpeg')
				.jpeg({quality:90})
				.toFile(`public/img/tours/${req.body.imageCover}`)


		//2) Images  NOTE:: we tend to loop once we have two or more images
	req.body.images = []

	await Promise.all(

				req.files.images.map(async(el,i)  => {
				const filename = `tours-${req.params.id}-${Date.now()}-${i + 1}.jpeg`

				await sharp(el.buffer)
						.resize(2000,1333)
						.toFormat('jpeg')
						.jpeg({quality:90})
						.toFile(`public/img/tours/${filename}`)

				req.body.images.push(filename)
				//console.log(req.files.imageCover)
	}))

	next()
})

exports.aliasTopTours = (req,res,next)=> {
	req.query.limit = '5'
	req.query.sort ='-ratingsAverage,price'
	req.query.fields = 'name,price,summary,difficulty,ratingsAverage'
	
	next()
}



exports.getAllTours = factory.getAll(Tour)
//catchAsync(async (req,res,next)=> {

	// 1A) filtering
	// const queryObj = {...req.query}
	// const excludedFields = ['page','sort','limit','fields']
	// excludedFields.forEach(el=> delete queryObj[el])
 	
	// // 1B) Advance filtering
	// let queryStr = JSON.stringify(queryObj)
	// queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`)
	// //console.log(JSON.parse(queryStr))

	// let query =  Tour.find(JSON.parse(queryStr))

	//2  sorting
	// if(req.query.sort){
	// 	const sortBy = req.query.sort.split(',').join(' ')
	// 	query=query.sort(sortBy)
	// }else {
	// 	query = query.sort('-createdAt')
	// } 

	//3 Field Limiting   i.e projection
	// if(req.query.fields) {
	// 	const fields = req.query.fields.split(',').join(' ')
	// 	query=query.select(fields)
	// }else {
	// 	query = query.select('-__v')
	// }


	//4 Pagination
	// const page = req.query.page *1 || 1
	// const limit = req.query.limit*1 || 100  //the 100 is a default value
	// const skip= (page-1) * limit
	// query = query.skip(skip).limit(limit)

	// if(req.query.page) {
	// 	const numTours = await Tour.countDocuments();
	// 	if(skip >= numTours ) throw new Error ('you have exceeded maximum page limit')


	
	
 
	
	

	// const query =  Tour.find().where('duration').equals(5)
	// 				.where('difficulty').equals('easy')
	//console.log(req.requestTime)
// 	const features= new APIFeatures(Tour.find(),req.query)
// 	.filter()
// 	.sort()
// 	.limitFields()
// 	.paginate()
// 	const tour = await features.query
//  res.status(200).json ({
//  	status: 'success',
//  	// results: tours.length,
//  	data:{
//  		   tour
// 		// //tours:tours 	you can as well do like this
//  	}
//  })


// })

// exports.checkBody = (req,res,next)=> {
// 	if (req.body.name == null || req.body.price == null ) {
// 		return res.status(400).json({
// 			status: 'Failed',
// 			meassage:'Failed, should have a name poperty or price',
// 		})
// 	}
// 	next()
// }


// exports.createTour = catchAsync(async (req,res,next)=> {


// 	// const newTour = new Tour({})
// 	// newTour.save().then

// 		const newTour = await Tour.create(req.body)

// 		if (! newTour) {

// 		return	next(new AppError('there is no tour with that id', 404))
// 		}

//  // const newId= tours[tours.length-1].id + 1
//  //  const newTour = Object.assign({id:newId}, req.body)
//  // tours.push(newTour)
//  //  fs.writeFile(`${__dirname}/4-natours/after-section-06/dev-data/data/tours-simple.json`, JSON.stringify(tours), err=> { 
// 	  	res.status(201).json({
// 	 		status : "success",
// 	 		data: {
// 	 			tour: newTour
// 	 		}
// 	 	})
// 	})

exports.createTour  = factory.createOne(Tour)
	
 


// exports.getTour = catchAsync(async (req,res,next)=> { 

	

// 		const tour = await Tour.findById(req.params.id).populate('reviews')
// 		// .populate({   //simply do .populate('guides')
// 		// 	path: 'guides',
// 		// 	select: '-__v -passwordChangedAt'
// 		// })

// 		if (!tour) {

// 		return	next(new AppError('there is no tour with that id', 404))
// 		}
// 		//tour.findById({_id:req.params.id}) we could have use this but findById has simply things for us.. the _ is from mongod
// 		res.status(200).json({
//  		status: "success",
//  		data: {
//  			tour
//  		}
//  	})
	 
//  	//const id = req.params.id * 1
//  	// const tour =tours.find(el=> el.id == id)

 	
 	
//  })
exports.getTour =  factory.getOne(Tour,{path:'reviews'})


// exports.updateTour = catchAsync(async(req,res,next)=> {

// 	const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
// 		new:true, runValidators:true
// 	})
 
// 		if (!tour) {

// 		return	next(new AppError('there is no tour with that id', 404))
// 		}
// 	res.status(200).json({
// 		status:'success',
// 		data:{
// 			tour
// 		}
// 	})

// })

exports.updateTour = factory.updateOne(Tour)

// exports.deleteTour =  catchAsync(async (req,res,next)=> {


// 	 const tour = await Tour.findByIdAndDelete(req.params.id)
	 
// 		if (!tour) {

// 		return	next(new AppError('there is no tour with that id', 404))
// 		}
// 	res.status(204).json({
// 		status:'success',
// 		data: null
// 	})

exports.deleteTour = factory.deleteOne(Tour)

	
// })


exports.getToursWithin = catchAsync(async(req,res,next)=> {
	const {distance,latlng,unit} = req.params
	const [lat,lng] = latlng.split(',')
	if(!lat || !lng) {
		next (new AppError('please provide latitude and longitude in the lat,lng format',400))
	}

	const radius = unit === 'mi'? distance/3963.2 : distance/6378.1
	const tours = await Tour.find({
		startLocation:{$geoWithin: {$centerSphere: [[lng,lat],radius]}}
	})

	res.status(200).json({
		status:"success",
		result:tours.length,
		data: {
			tours
		}

	})
}) 


exports.getDistances = catchAsync(async(req,res,next)=> {
	const {latlng,unit} = req.params
	const [lat,lng] = latlng.split(',')
	const multiplier = unit === 'mi'? 0.000621371 : 0.001 
	if(!lat || !lng) {
		next (new AppError('please provide latitude and longitude in the lat,lng format',400))
	}
	const distances = await Tour.aggregate([
	{
		$geoNear: {
			near: {
				type:'Point',
				coordinates: [lng *1,lat *1]
			},
			distanceField:  'distance',
			distanceMultiplier: multiplier
		}
	},
		{
			$project: {	  //the project signifies the value that you want to let persist, here only distance will be displayed
				distance:1,
				name:1
			}
		}
	

		])

	res.status(200).json({
		status:"success",
		data: {
			distances
		}

	})
})





//NOTE::  go to the mongoose documentation and you can find all the query method you can have on a functio
// important you must look up mongoose documentation

exports.getTourStats = catchAsync(async(req,res,next)=> {
	
		 const stats = await Tour.aggregate([
		 {
		 	$match: {ratingsAverage: {$gte:4.5}}
		 },
		 {
		 	$group: {
		 		_id:{$toUpper: '$difficulty'},
		 		numTours : {$sum: 1},
		 		numRating: {$sum: '$ratingsQuantity'},
		 		avgRating:{$avg: '$ratingsAverage'},
		 		avgPrice : {$avg: '$price'},
		 		minPrice : {$min: '$price'},
		 		maxPrice: {$max: '$price'}
		 	}
		 },
		 {
		 	$sort: {avgPrice: 1}
		 },
		 // {
		 // 	$match: { _id: {$ne: 'EASY'}}
		 // }

		 	])
		 res.status(200).json({
		status:'success',
		data:{
			stats
		}
	})
		 	
		 


	
})


exports.getMonthlyPlan= catchAsync(async(req,res,next)=> {
	
		const year = req.params.year * 1;
		const plan = await Tour.aggregate([
		{
			$unwind: '$startDates'
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				}
			}
		},
		{
			$group: {
				_id: {$month: '$startDates'},
				numToursStarts: {$sum: 1},
				tours: {$push: '$name'}
			}
		},
		{
			$addFields: {month: '$_id'}
		},
		{
			$project: {
				_id: 0
			}
		},
		{
			$sort: {numToursStarts: -1}
		}


			])

		 res.status(200).json({
		status:'success',
		data:{
			plan
		}
	})
	
})