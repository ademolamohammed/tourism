// NOTE:: The index.js file is has to do with more of getting data from the user interface

import '@babel/polyfill' //use to make newer javascript features work perfectly in older browsers
import {displayMap } from './mapbox'
import {login,logout} from './login'
import {updateSettings} from './updateSettings'
import {bookTour}  from './stripe'


//DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logOutBtn = document.querySelector('.nav__el--logout')

const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')

const bookBtn = document.getElementById('book-tour')



//VALUES


//DELEGATION
if(mapBox) {
const locations = JSON.parse(mapBox.dataset.locations)    //for the map
displayMap(locations) 	
}

if (loginForm) {
	loginForm.addEventListener('submit', el => {		//for logging in users
	el.preventDefault()
	const email = document.getElementById('email').value
	const password = document.getElementById('password').value
	login(email,password)
})
}

if(logOutBtn) logOutBtn.addEventListener('click', logout)

if(userDataForm) {
	userDataForm.addEventListener('submit', el =>{
		el.preventDefault()
		const form = new FormData()  //the FormData()is from the multer. must be included before image  or any files can be uploaded
		form.append('name',document.getElementById('name').value)
		form.append('email',document.getElementById('email').value)
		form.append('photo',document.getElementById('photo').files[0])
		updateSettings(form,'data')

	})
}

if(userPasswordForm) {
	userPasswordForm.addEventListener('submit', async el =>{
		el.preventDefault()
		document.querySelector('.btn--save-password').textContent = 'updating....'
		const passwordConfirm = document.getElementById('password-current').value 
		const password = document.getElementById('password').value
		const confirmPassword = document.getElementById('password-confirm').value
		await updateSettings({passwordConfirm,password,confirmPassword},'password') 

		document.querySelector('.btn--save-password').textContent = 'Save Password'
		document.getElementById('password-current').value =''
		document.getElementById('password').value = ''
		document.getElementById('password-confirm').value= ''
		
	})
}


if(bookBtn) {
	bookBtn.addEventListener('click', el=> {
		el.target.textContent = 'processing...' //text content is use to change the content of an element.  
		const tourId = el.target.dataset.tourId // can also use const tourId=document.getElementById('book-tour').dataset.tourId
		bookTour(tourId)

	})

}


