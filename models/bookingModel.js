const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
	tour: {
		type:mongoose.Schema.ObjectId,
		ref: 'Tour',
		required: [true, 'Booking must belong to a Tour']
	},

	user:{
		type:mongoose.Schema.ObjectId,
		ref:'User',
		required: [true, 'Booking must belong to a User']
	},

	price:  {
		type:Number,
		required:[true,'booking must have a price']
	},

	createdAt: {
		type:Date,
		default:Date.now()
	},

	paid:  {
		type:Boolean,
		default:true		//this can be used by an administrator to pay a booking directly without having to supply a cc
	}


})

bookingSchema.pre(/^find/, function(next)  {
	//NOTE:: all pre middleware have access to the next middleware,else they wont run.. take note
 this.populate('user').populate({
 	path:'tour',
 	select:'name'
 })
 next()
})

const Booking = mongoose.model('Booking',bookingSchema)

module.exports = Booking