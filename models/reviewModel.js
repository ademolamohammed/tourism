const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
		review: {
			type:String,
			required:[true, 'review must not be empty']
		},
	
		rating: {
			type:Number,
			required: [true, 'rating must not be empty'],
			min:1,
			max:5
		},
	
	
		createdAt: {
			type:Date,
			default: Date.now()
		},
	
	
		tour: {
		
			type:mongoose.Schema.ObjectId,
			ref:'Tour',
			required:[true,'Reviw must belong to a tour']
		},
		
	
	
		user: {
		 
			type:mongoose.Schema.ObjectId,
			ref:'User',
			required:[true,'Review must belong to a user']
		}
		
	
},{
	toJSON: {virtuals:true},
	toObject: {virtuals:true}
}) 

reviewSchema.pre(/^find/,function(next){
// if you want the reviews to be populated with the tours and the id you should do this by chaining 2populates as commented out 
//below, so in here, the
	// this.populate({ 
	// 		path: 'tour',
	// 		select: 'name',

	// 	}).populate({ 
	// 		path: 'user',
	// 		select: 'name photo'
	// 	})
// here only the user will be populated, and the reviews collection will have just ID's of the tour without been populated
	this.populate({ 
			path: 'user',
			select: 'name photo'
		})


	next()
})


const Review = mongoose.model('Review',reviewSchema)

module.exports = Review