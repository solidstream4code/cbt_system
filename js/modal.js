function showModal(type, message, button_name, callback){
	var fa = "";
	var headerText = "";
	var color = "";
	var message = message;
	var buttonName = button_name;

	if(type == "success"){
		fa = "fa fa-check";
		headerText = "SUCCESS"
		color = "white";
	}else if(type == "notice"){
		fa = "fa fa-warning";
		headerText = "NOTICE";
		color = "yellow";
	}else if(type == "error"){
		fa = "fa fa-close";
		headerText = "ERROR";
		color = "red";
	}

	var html = "<div class='custom_modal'>"+
				"<div class='modal_wrapper'>"+
					"<div class='modal_content'>"+
						"<p class='header'><span class='"+fa+"'></span> "+ headerText +"</p>"+
						"<p class='message'>"+ message +"</p>"+
						"<button class='ok "+button_name+"'> OK </button>"+
					"</div>"+
				"</div>"+
			"</div>"

	$("body").append(html);
	$(".header").css({"color":color});

	$(document).on("click", "."+button_name, function(){
		callback();
	})
}

function hideModal(){
	$(".custom_modal").remove();
}

function showQuery(type, message, button_yes, button_no, callback_yes, callback_no){
	var fa = "";
	var headerText = "";
	var color = "";
	var message = message;

	if(type == "success"){
		fa = "fa fa-check";
		headerText = "SUCCESS"
		color = "white";
	}else if(type == "notice"){
		fa = "fa fa-warning";
		headerText = "NOTICE";
		color = "yellow";
	}else if(type == "error"){
		fa = "fa fa-close";
		headerText = "ERROR";
		color = "red";
	}

	var html = "<div class='custom_modal'>"+
				"<div class='modal_wrapper'>"+
					"<div class='modal_content'>"+
						"<p class='header'><span class='"+fa+"'></span> "+ headerText +"</p>"+
						"<p class='message'>"+ message +"</p>"+
						"<button class='ok "+button_yes+"'> Yes </button>"+
						"<button class='ok "+button_no+"'> No </button>"+
					"</div>"+
				"</div>"+
			"</div>"

	$("body").append(html);
	$(".header").css({"color":color});

	$(document).on("click", "."+button_yes, function(){
		callback_yes();
	})

	$(document).on("click", "."+button_no, function(){
		callback_no();
	})
}

function hideModal(){
	$(".custom_modal").remove();
}
