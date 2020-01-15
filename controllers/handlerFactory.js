const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const apiFeatures =require('./../utils/APIFeatures')

exports.deleteOne = Model => catchAsync(async (req,res,next)=> {


	 const doc = await Model.findByIdAndDelete(req.params.id)
	 
		if (!doc) {

		return	next(new AppError('there is no document with that id', 404))
		}
	res.status(204).json({
		status:'success',
		data: null
	})

	
})


exports.updateOne = Model=>  catchAsync(async(req,res,next)=> {

	const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
		new:true, runValidators:true
	})
 
		if (!doc) {

		return	next(new AppError('there is no document with that id', 404))
		}
	res.status(200).json({
		status:'success',

		data:{
			data:doc
		}
	})

})


exports.createOne = Model => catchAsync(async (req,res,next)=> {

		const doc = await Model.create(req.body)

		if (!doc) {

		return	next(new AppError('there is no document with that id', 404))
		}
	  	res.status(201).json({
	 		status : "success",
	 		
	 		data: {
	 			 doc
	 		}
	 	})

 	})



exports.getOne = (Model,popOptions) => catchAsync(async(req,res,next)=> { 
	let query = Model.findById(req.params.id)
	if (popOptions) query= query.populate(popOptions)
		const doc = await query
		
		if (!doc) {

		return	next(new AppError('there is no document with that id', 404))
		}
		res.status(200).json({
 		status: "success",
 		
 		data: {
 			doc
 		}
 	})
	 	
 })





exports.getAll = Model=> catchAsync(async (req,res,next)=> {
	let filter= {}
	if(req.params.tourId) filter= {tour:req.params.tourId}
const features= new APIFeatures(Model.find(filter),req.query)
	.filter()
	.sort()
	.limitFields()
	.paginate()
	const doc = await features.query
	//const doc = await features.query.explain()
	//NOTE the explain method gives all internal details about the tour or anything attached to it, explain works for Indexing
 res.status(200).json ({
 	status: 'success',
 	result:doc.length,
 	data:{
 		   doc
		// //tours:tours 	you can as well do like this
 	}
 })


})