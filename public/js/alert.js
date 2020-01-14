

export const hideAlert= ()=> {
	const el = document.querySelector('.alert')
	if (el) el.parentElement.removeChild(el)
}


export const showAlert = (type,msg) => {
	hideAlert()
	const markup = `<div class="alert alert--${type}"> ${msg} </div>` //this ${type} is what is been parsed to it, and its takes 
	//effect from our css. search your style.css with ctrl + f and find alert, the you also will find alert--success and danger
	
	document.querySelector('body').insertAdjacentHTML('afterbegin',markup);  //this is a jquey that tells it to update the markup
	//define ealier to the top of the body of the page
	window.setTimeout(hideAlert,5000)
}