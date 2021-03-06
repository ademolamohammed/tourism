const mongoose=require('mongoose')
//const user = require('./userModel')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
	name: {
		type:String,
		required:[true,'name of tour must not be empty'],
		unique:true,
		trim:true,
		minlength:[10, 'a tour must have a length of above 10'],
		maxlength:[40, 'a tour must have a length of less than']
	},
	slug:String,
	duration:{
		type:Number,
		required:[true, 'must have a duration']
	},
	maxGroupSize: {
		type:Number,
		required:[true, 'tour must have a group size']
	},
	difficulty: {
		type:String,
		required:[true, 'a tour must have  difficulty'],
		enum: {
			values: ['easy','medium', 'difficult'],
			message: 'must consit of only easy,medium or difficult'
		}

	},
	ratingsAverage:{
		type: Number,
		default:4.5,
		min:[1,'ratings must be above 1.0'],
		max:[5,'ratings must be greater than 5'],
		set: val => Math.round(val *10)/10
	},
	ratingsQuantity:{
		type:Number,
		default:0
	},
	price: {
		type:Number,
		required:[true,'price of tour must not be empty']
	},
	priceDiscount:Number,
	summary: {
		type:String,
		required:[true, 'a tour must have a summary']
	},
	description: {
		type: String,
		trim:true
	},
	imageCover: {
		type:String,
		required:[true,'a tour must have a cover image']

	},
	images:[String],
	createdAt: {
		type:Date,
		default: Date.now(),
		select:false
	},
	startDates: [Date],
	startLocation: {
		//GoJson
		type: {
			type:String,
			default:'Point',
			enum: ['Point']
		},
		coordinates: [Number],
		address:String,
		description:String
	},
	//in order to embed another document into an existing one like this tour model, the new document must be embedded
	//in form of an array.NOTE, the  startLocation is not a document, its just an object discribing a certain point on earth
	locations: [ {
		type: {
			type:String,
			default:'Point',
			enum: ['Point']
		},
		coordinates: [Number],
		address:String,
		description:String,
		day:Number
	}],
	//guides: Array, for the embedded database   
	guides: [ 
	  {
			type: mongoose.Schema.ObjectId,
			ref: 'User'
	  }
	]

	
},{
	toJSON: {virtuals:true},
	toObject: {virtuals:true}
}) 

tourSchema.virtual('durationWeeks').get(function(){
	return this.duration /7;
})

//Documents middleware: runes before .save() and .create()
// user for creating a guide on our database using embeded format
//you have o enter the user id on the body to get the full details of the user, an embedded relatioship
// tourSchema.pre('save',async function(next) {
// const guidesPromises = this.guides.map(async id=> User.findById(id));
// this.guides = await Promise.all(guidesPromises)
// 	next()
// })


//use to slugify i.e to turn the name of the tour into what can be reused
tourSchema.pre('save',function(next) {
	this.slug=slugify(this.name, {lower:true}) 
	next();
})

//index({price:1}) use to order the price in an accending order -1 is order in a decending order, so that when we search
//?price[gt]=1000, it would have arranged it orderly so much work wouldnt be done to give back the result has it wouldn't 
//waste time running the all 9 search results, will only pick up the first three that matches the query
tourSchema.index({price:1})
tourSchema.index({price:1,  ratingsAverage:-1})
tourSchema.index({slug:1})
tourSchema.index({startLocation:'2dsphere'})  //use '2dindex'  if its just a frictional data and not a real point on earth  

//populating your getAllTours with the guides into upon serching and not just only having thier id like it is on the default search
tourSchema.pre(/^find/,function(next){
	this.populate({ 
			path: 'guides',
			select: '-__v -passwordChangedAt'
		})
	next()
})

//virtual populate is a reverse of the normal populate. the normal populate is having the tours on the review here you can 
//also find the review on each tours when you query the tours
tourSchema.virtual('reviews', {
	ref:'Review', 
	foreignField: 'tour',
	localField: '_id',
})

const Tour = mongoose.model('Tour',tourSchema)



module.exports = Tour
