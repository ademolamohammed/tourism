const fs = require("fs")
const mongoose=require('mongoose')
const dotenv = require('dotenv')
//const app = require('./app')
const Tour = require('../../../../models/tourModel.js')
const Review = require('../../../../models/reviewModel.js')
const User = require('../../../../models/userModel.js')



dotenv.config({path:'./config.env'})
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

// mongoose.connect(DB,{
// 	useNewUrlParser:true,
// 	useCreateIndex:true,
// 	useFindAndModify:false
// }).then(()=> console.log('DB connection successful!')).catch(err=> console.log('there was an error in network',err))
// 	//console.log(con.connections)
	
	//HOW TO CONNECT YOUR LOCAL DATABASE TO YOUR APPLICATION	
mongoose.connect(process.env.DATABASE_LOCAL, {
useNewUrlParser:true,
	useCreateIndex:true,
	useFindAndModify:false
}).then(()=> console.log('DB connection successfullllll!'))



 const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
 const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
 const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))

const importData = async(req,res)=> {
	try{
		await Tour.create(tours)
		await User.create(users, {validateBeforeSave:false})
		await Review.create(reviews)
		console.log('data successfully loaded')
		process.exit()
		// res.status(200).json({
		// 	status: "success",
		// 	data: {
		// 		tour
		// 	} 
		//})
	}catch (err) {
		// res.status(400).json({
		// 	sttus: "failed",
		// 	messaga: err
		// })
		console.log(err)
	}
}

//delete all data from DB

const deleteData = async()=>{
try {
	await Tour.deleteMany()
	await User.deleteMany()
	await Review.deleteMany()
console.log('data successfull deleted')
process.exit()
}catch (err) {
	//console.log(err)
}
}

if (process.argv[2] ==='--import') {
	importData()
}else if (process.argv[2] === '--delete') {
	deleteData()
}
console.log(process.argv)
//NOTE: console.logging (process.argv) for ./4-natours/after-section-06/dev-data/data/import-dev-data will give you the 2nd index
// example type ./4-natours/after-section-06/dev-data/data/import-dev-data on the cmdprompt you will have a two array 
//typing another word beside ./4-natours/after-section-06/dev-data/data/import-dev-data will result in that word being 
//inluded in the array and the array becomes 3.
//then you can have if(process.argv[2]==='import') import is the word you must have typed along your 
//./4-natours/after-section-06/dev-data/data/import-dev-data. then the function is being ran