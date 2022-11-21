const readuploads = (field) =>{
  let promise = new Promise((accept, reject = function(){}) => {
    var input = document.getElementById(field)
    input.addEventListener("change", function(){
      var file = input.files[0]
      var reader = new FileReader();
      reader.addEventListener("load", function(){
        var dataset = reader.result.split("\r\n")
        var dataObject = []

        for (var i = 1; i < dataset.length - 1; i++){
          var row = dataset[i]
          row = row.split(",")
          dataObject.push(row)
        }
        accept(dataObject)
      })
      reader.readAsText(file)
    })
  })
  return promise
}

const store_pupils = (pupils_object) => {
  pupils = JSON.stringify(pupils_object)
  let list_id = $(".list_name_value").attr("list_name")

  $.post("../php/save_pupils.php", {"list_id":list_id, "pupils":pupils}, function(result){
    let output = JSON.parse(result);
    let status = output.status;
    let response = output.output;

    if(status){
      showModal("success", response, "27782success", function(){
        window.location.href= "admin.html"
        hideModal()
      })
    }else{
      showModal("error", response, "78227828error", function(){
        hideModal();
      })
    }

  })
}

const display_pupils = (pupils_object) =>{
  let html = `<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tables_wrapper">
						<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 table-responsive">
							<table class="table table-striped pupils">
								<tr class="table-head">
                  <th>S/N</th>
									<th>Full Name</th>
                  <th>Examination Number</th>
								</tr>
							</table>
						</div>
					</div>`

  $(".switch-add-pupil").html(html);

  for(row = 0; row < pupils_object.length; row++){
    let cur_row = pupils_object[row]
    let name = cur_row[0]
    let exam_no = cur_row[1]

    var table_row = `<tr>
                        <td> ${row + 1} </td>
                        <td> ${name} </td>
                        <td> ${exam_no} </td>
                    </tr>
                    `
    $(".pupils").append(table_row)
  }

  $(".upload-pupils").show();
}

const display_questions = (question_data) => {
  let html = `<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 questions_wrapper">

					 </div>`

  $(".switch-add-question").html(html);

  for(row = 0; row < question_data.length; row++){
    let cur_row = question_data[row]
    let question = cur_row[0]
    let optionA = cur_row[1]
    let optionB = cur_row[2]
    let optionC = cur_row[3]
    let optionD = cur_row[4]
    let Answer = cur_row[5]

    var quest_row = `<div class="quest_row">
                        <p class="question"> ${row + 1 }.  ${question} </p>
                        <p class="q_options"> A).  ${optionA} </p>
                        <p class="q_options"> B).  ${optionB} </p>
                        <p class="q_options"> C).  ${optionC} </p>
                        <p class="q_options"> D).  ${optionD} </p>
                        <p class="q_answer">  Answer = ${Answer} </p>
                    </div>
                    `
    $(".questions_wrapper").append(quest_row)
  }

$(".upload-questions").show();
}

const store_questions = (question_data, length) => {
  let questions = JSON.stringify(question_data)
  $.post("../php/add_questions.php", {"test_id":$(".test_id_quest_hidden").attr("test_id"), "questions":questions, "no_of_questions":length}, function(result){
    console.log(result)
    let output = JSON.parse(result);
    let status = output.status;
    let response = output.output;

    if(status){
      showModal("success", response, "27782success", function(){
        window.location.href="admin.html"
        hideModal()
      })
    }else{
      showModal("error", response, "78227828error", function(){
        hideModal();
      })
    }

  })
}
