const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
	name: {
		type:String,
		required:[true, 'name must not be empty']
		},

	email: {
		type:String,
		required: true,
		validation: [true, 'email must not be empty'],
		unique:true,
		lowercase: true,
		validate: [validator.isEmail, 'please provide a valid email']
	},
	photo: {type:String},

	role: {
		type:String,
		enum: ['user','guide', 'tour-guide', 'admin'],
		default: 'user'
	},
		
		
	
	password: {
		type:String,
		required: [true, 'Must not be empty'],
		minlength:8,
		trim:true,
		select:false

		
	},
	confirmPassword: {
		type:String,
		required: [true, 'please comfirm your password'],
		validate: {
			// this validator only woks on SAVE or CREATE. and you can use SAVE to update a user
			validator: function(el){
				return el === this.password
			},
			message: 'password are not the same'
		}
		
	},

	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type:Boolean,
		default:true,
		select:false
	}
		

	



})



userSchema.pre('save', async function(next) {
	//only run when there is a change in the passwrd field
	if(!this.isModified('password')) return next()

// hash password with cost of 12
this.password = await bcrypt.hash(this.password,12 )

//delete password field
this.confirmPassword = undefined
next()

})

userSchema.pre('save',  function(next) {
if(!this.isModified('password' || this.isNew)) return next()

this.passwordChangedAt = Date.now() - 1000
next()


})


userSchema.pre(/^find/, function(next) {
// this point to the current Query
this.find({active: {$ne: false}})
next()
})


//this is an instance method, and it will be available on all documents in a collection. i.e its will be global
//note, correct password is name of function

userSchema.methods.correctPassword =  async function(candidatePassword,userPassword) {
	return await bcrypt.compare(candidatePassword,userPassword)
}


userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
if(this.passwordChangedAt) {

	const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10)
	
	return JWTTimestamp < changedTimestamp
}
 // false means not changed
	return false
}

userSchema.methods.createPasswordResetToken = function() {
	const resetToken =  crypto.randomBytes(32).toString('hex')
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	this.passwordResetExpires = Date.now() + 10 *60 * 1000

	console.log({resetToken},this.passwordResetToken)

	return resetToken

}


User = mongoose.model('User', userSchema)

module.exports = User