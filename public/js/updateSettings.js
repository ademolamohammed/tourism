import axios from 'axios'
import {showAlert} from './alert'

//type is either 'password' or 'data'
export const updateSettings = async (data,type) => {
 try{	
	
	const url = type === 'password' ? 'http://localhost:3000/api/v1/users/updateMypassword' 
	: 'http://localhost:3000/api/v1/users/updateMe'

	const res= await axios({
	method:'PATCH',
	url,
	 data
})
	if(res.data.status === 'success') {
		showAlert('success', `${type.toUpperCase()} updated successfully!`)
	}
}catch (err) {
	showAlert('error',err.response.data.message)
}
}


// this is for only updating the name and email field, the updateSettings work for the two
// export const updateData = async (name,email) => {
//  try{	
// 	const res= await axios({
// 	method:'PATCH',
// 	url:'http://localhost:3000/api/v1/users/updateMe',
// 	data : {
// 		name,
// 		email
// 	}
// })
// 	if(res.data.status === 'success') {
// 		showAlert('success', 'Data updated successfully!')
// 	}
// }catch (err) {
// 	showAlert('error',err.response.data.message)
// }
// }