import axios from 'axios'
const stripe = Stripe('pk_test_WcYD3aaObukec6r3r3th7NtQ00ZLJj6myT')
import {showAlert} from './alert'


export const bookTour = async(tourId)  => {

		try{
	// 1)  Get checkout session from API
	const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`)
	  //console.log(session)
	//2) create checkout form +  charge credit card
	console.log(session.data)
	await stripe.redirectToCheckout({
		sessionId :  session.data.session.id  //here we get the id of the session, only then will the payment be completed
	})
	} catch(err) {
		showAlert('error',err)
	}	
	

	}





