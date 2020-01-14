const mongoose=require('mongoose')
const dotenv = require('dotenv')

// process.on('uncaughtException', err=> {
	
// 	console.log('UNCAUGHT EXCEPTION! shutting down')
// 	console.log(err.name, err.message)
	
// })



dotenv.config({path:'./config.env'})

const app = require('./app')
//const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

// mongoose.connect(DB,{
// 	useNewUrlParser:true,
// 	useCreateIndex:true,
// 	useFindAndModify:false,
// 	useUnifiedTopology:true
// }).then(()=> console.log('DB connection successful!')).catch(err=> console.log('there was an error in network',err))
// 	//console.log(con.connections)
	
	//HOW TO CONNECT YOUR LOCAL DATABASE TO YOUR APPLICATION	
mongoose.connect(process.env.DATABASE_LOCAL, {
useNewUrlParser:true,
	useCreateIndex:true,
	useFindAndModify:false,
	 useUnifiedTopology: true
	 
}).then(()=> console.log('DB connection successfullllll!'))



// this was for our first example
// const testTour = new Tour({
// 	name:"The park camper",
// 	price:497
// })

// testTour.save().then(doc=>{
// 	console.log(doc)
// }).catch(err=>{
// 	console.log('ERROR',err)
// })




//console.log(process.env)

//console.log(app.get('env'))

const port = 3000
const server=app.listen(port, ()=>{
console.log(`this application is running on port ${port}`)
})  

//uncaught rejection
process.on('unhandledRejection', err=> {
	
	console.log('UNCHANGED REJECTION! shutting down')
	console.log(err.name, err.message)
	server.close(()=> {
		process.exit(1)
	})
})

//uncaught exceptions
