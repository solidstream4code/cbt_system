function getQueries(address){
	var url = address;
	var queryStrings = (url.slice(url.indexOf("?") + 1)).split("&");
	var queries = [];
	for(i in queryStrings){
		var queryName = queryStrings[i].split("=")[0];
		var queryValue = queryStrings[i].split("=")[1];
		var newArray = [queryName, queryValue];
		queries.push(newArray);
	}
	return(queries);
}

const get_test_id = (address) => {
  let promise = new Promise((accept, reject)=>{
    var id = "";
  	var queries = getQueries(address);
  	for(i in queries){
  		if(queries[i][0] == "t_id"){
  			id = queries[i][1];
  		}
  	}

    if(id){
      accept(id)
    }else{
      reject()
    }
  })
  return promise
}

const is_logged_in = ()=> {
  let promise = new Promise((resolve, reject) => {
    $.post("../php/check_admin_login.php", {}, function(result){
      if(result){
        resolve(result)
      }else{
        reject()
      }
    })
  })

  return promise
}

const get_test_details = (id) => {
  var promise = new Promise((accept, reject)=>{
    $.post("../php/get_test_settings.php", {"test_id":id}, function(output){
      if(output){
        let result = JSON.parse(output)
        accept(result)
      }else{
        reject()
      }
    })
  })
  return promise
}

const display_test_details = (details) =>{
  $(".title").text(details.title);
	$(".subject").text(details.subject);
	$(".class").text("Primary " + details.class);
	$(".total_quest").text(details.total_questions);
	$(".date").text(details.date_created);
	$(".quest_per_pupil").text(details.Question_per_pupil);
	$(".duration").text(`${details.duration_hour} Hour ${details.duration_minutes} Minutes`);

	let status = details.active

	if(status == "true"){
		status = "Active";
		$(".button-toggle-status").addClass("deactivate")
		$(".button-toggle-status").removeClass("activate")
		$(".button-toggle-status").text("Deactivate")

		$(".status-cont").removeClass("inactive")
		$(".status-cont").addClass("active")
	}else{
		$(".button-toggle-status").addClass("activate")
		$(".button-toggle-status").removeClass("deactivate")
		$(".button-toggle-status").text("Activate")
		status = "Inactive";

		$(".status-cont").removeClass("active")
		$(".status-cont").addClass("inactive")
	}

	$(".test-status").text(status)
}

const get_questions = (test_id) => {
	let promise = new Promise((accept, reject)=>{
		$.post("../php/get_all_questions.php", {"test_id":test_id}, function(output){
			if(output){
				accept(JSON.parse(output))
			}else{
				reject()
			}
		})
	})
	return promise;
}

const display_questions = (questions) => {
	for(var row = 0; row < questions.length; row++){
		let cur_quest = questions[row]
		let html = `
				<div class="each-quest">
					<p class="quest"> <span class="q_no">${row + 1}. </span> ${cur_quest.question}</p>
					<div class="img-cont"><img src="../images/${cur_quest.image}" class="q-img" alt="no image added"></div>
					<div class="buttons-cont">
						<button type="button" name="button" class="edit opt-button" quest_id=${cur_quest.question_id}><span class="fa fa-pencil"> </span></button>
					</div>
					<div class="opt-cont row">
						<p class="a col-xs-12 col-sm-6 col-md-6 col-lg-6"> <span class="opt-label label-a">A). </span> ${cur_quest.A} </p>
						<p class="b col-xs-12 col-sm-6 col-md-6 col-lg-6"> <span class="opt-label label-b">B). </span> ${cur_quest.B} </p>
						<p class="a col-xs-12 col-sm-6 col-md-6 col-lg-6"> <span class="opt-label label-a">C). </span> ${cur_quest.C} </p>
						<p class="b col-xs-12 col-sm-6 col-md-6 col-lg-6"> <span class="opt-label label-b">D). </span> ${cur_quest.D} </p>
					</div>
				</div>
		`
		$(".body-quest-cont").append(html);
	}
}

const get_pupils = (test_id) => {
	let promise = new Promise((accept, reject) => {
		$.post("../php/get_all_pupils.php", {"test_id":test_id}, function(output){
			if(output){
				accept(JSON.parse(output))
			}else{
				reject()
			}
		})
	})
	return promise
}

const display_pupils = (pupils) => {
	let table = `
						<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 table-responsive">
							<table class="table table-striped pupils">
								<tr>
									<th>S/No</th>
									<th>Name</th>
									<th>Exam Number</th>
									<th>Score</th>
									<th>Score (%) </th>
								</tr>
					`


	for(var each = 0; each < pupils.length; each++){
		let pupil = pupils[each];
		let row = `
				<tr>
					<td>${each + 1}</td>
					<td>${pupil.name}</td>
					<td>${pupil.exam_no}</td>
					<td>${pupil.total_answered}</td>
					<td>${pupil.score_percent}</td>
				</tr>
		`
		table = table + row;
	}

	table = table + "</table></div>"

	$(".score-cont").append(table)
}

const activate_test = (test_id) =>{
	$.post("../php/activate.php", {"test_id":test_id}, function(output){
		if(output == "success"){
			get_test_id(window.location.href).then((id)=> window.location.href="test.html?t_id="+id, function(){})
		}else if(output == "missing both"){
			showModal("error", "No questions and participants has been added to this test. Add them before activation", "error76117", function(){
				hideModal()
				window.location.href = "admin.html";
			})
		}else if(output == "missing pupils"){
			showModal("error", "No participants has been added to this test. Add them before activation", "error76117", function(){
				hideModal()
				window.location.href = "admin.html";
			})
		}else if(output == "missing questions"){
			showModal("error", "No questions has been added to this test. Add them before activation", "error76117", function(){
				hideModal()
				window.location.href = "admin.html";
			})
		}
	})
}

const deactivate_test = (test_id) =>{
	$.post("../php/deactivate.php", {"test_id":test_id}, function(output){
		if(output){
			get_test_id(window.location.href).then((id)=> window.location.href="test.html?t_id="+id, function(){})
		}else{
			showModal("error", "Exam deactivation failed", "error76117", function(){
				hideModal()
			})
		}
	})
}

const show_edit = (test_id) =>{
	$(document).on("click", ".edit", function(){
		let quest_id = $(this).attr("quest_id");
		let id = test_id

		$(".edit-cont").show()
				$.post("../php/get_each_question.php", {"test_id":id, "quest_id":quest_id}, function(outcome){
					let result = JSON.parse(outcome);
					let question = result.question;
					let a = result.A
					let b = result.B
					let c = result.C
					let d = result.D
					let image = result.image

					$(".edit-question").val(question)
					$(".edit-a").val(a)
					$(".edit-b").val(b)
					$(".edit-c").val(c)
					$(".edit-d").val(d)
					$(".edit-q-no").text(quest_id)
					$(".each-img").attr("src", "../images/"+image)
					$(".each-img").attr("file_name", image)
				})
	})
}

const submit_edit = (test_id) => {
	$(document).on("click", ".submit-edit", function(){
	let question = $(".edit-question").val()
	let a = $(".edit-a").val()
	let b = $(".edit-b").val()
	let c = $(".edit-c").val()
	let d = $(".edit-d").val()
	let q_no = $(".edit-q-no").text()
	let image = $(".each-img").attr("file_name")

	if(question != "" && a != "" && b != "" && c != "" && d != ""){
		let input = {question, a, b, c, d, q_no, image, test_id}
		$.post("../php/edit_question.php", input, function(output){
			if(output){
				$(".edit-cont").hide()
				showModal("success", "The question has been edited successfully. Continue editing or refresh page to view changes", "succ762w272", function(){
					hideModal()
				})
			}else{
				showModal("error", "Error editing question. please try again", "err727278", function(){
					hideModal()
				})
			}
		})
	}
})
}

const delete_test = (test_id) =>{
	$(document).on("click", ".delete-icon", function(){
		$.post("../php/delete_test.php", {test_id}, function(output){
			if(output != false){
				showModal("success", "Test Deleted successfully", "suc788281", function(){
					window.location.href = "list.html";
				})
			}else{
				showModal("error", "Failed to delete Test", "error788281", function(){
					hideModal()
				})
			}
		})
	})
}

const upload_image = () => {
	var fd = new FormData();
	var files = $('.edit-file-field')[0].files[0];
	fd.append('file',files);

	$.ajax({
			url: '../php/upload_image.php',
			type: 'post',
			data: fd,
			contentType: false,
			processData: false,
			success: function(response){
				if(response != false){
					$(".each-img").attr("src", "../images/"+response)
					$(".each-img").attr("file_name", response)
				}else{
					showModal("error", "Image selected is not of supported type or size. select a png, jpg or gif file less than 1Mb", "err7872822", function(){
						hideModal();
					})
				}
			},
	})
}

$(document).ready(function(){
  is_logged_in().then(

    get_test_id(window.location.href).then(
      function(test_id){

          get_test_details(test_id).then(

              display_test_details, function(){
                showModal("error", "Test not found. please try again", "error617811", function(){
                  window.location.href="index.html"
                })
              }

          )

					get_questions(test_id).then(
						display_questions, function(){
							showModal("error", "Questions not found. please try again", "error61781267221", function(){
								window.location.href="index.html"
							})
						}
					)

					get_pupils(test_id).then(
						display_pupils , function(){
							showModal("error", "Pupils not found. please try again", "error61781267221", function(){
								window.location.href="index.html"
							})
						}
					)

					$(document).on("click", ".button-toggle-status", function(e){
						e.preventDefault();
						if($(this).hasClass("activate")){
							activate_test(test_id)
						}else if($(this).hasClass("deactivate")){
							deactivate_test(test_id)
						}
					})

					show_edit(test_id)
					submit_edit(test_id)
					delete_test(test_id)
      },  function(){
				showModal("error", "Test Id not provided", "error617811", function(){
					window.location.href="index.html"
				})
    }

  ), function(){
		showModal("error", "This page is only available to admins. You are not logged in", "error617811", function(){
			window.location.href="index.html"
		})
	}
)

$(document).on("click", ".close", function(){
	$(".edit-cont").hide();
})


$(document).on("click", ".edit-file", function(){
	$(".edit-file-field").click()
})

$(document).on("change", ".edit-file-field", function(){
	upload_image()
})

$(document).on("click", ".print-question", function(e){
	e.preventDefault()
	$(".media-css").attr("href", "../css/print_question.css")

	setTimeout(function(){
			print()
		}, 500)
})

$(document).on("click", ".print-scores", function(e){
	e.preventDefault()
	$(".media-css").attr("href", "../css/print_scores.css")
	setTimeout(function(){
			print()
		}, 1000)
})

})
