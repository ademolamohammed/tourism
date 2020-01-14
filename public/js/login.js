import axios from 'axios'
import {showAlert} from './alert'




export const login = async(email,password)=> {
try{ 
	const res = await axios({
	method: 'POST',
	url: 'http://localhost:3000/api/v1/users/login',
	data: {
		email:email,
		password:password
	}
})

	if (res.data.status === 'success') {
		showAlert('success','Logged in successfully')
		window.setTimeout(()=> {
			location.assign('/')      //location.assign is use to load route that is parsed into it
		},1500) 
	}

} catch (err) {
	showAlert('error',err.response.data.message);
}
}


export const logout = async()=> {
try{ 
	const res = await axios({
	method: 'GET',
	url: 'http://localhost:3000/api/v1/users/logout',	
})

	if (res.data.status === 'success') location.reload(true)

} catch (err) {
	showAlert('error','error logging out! try again');
}
}






