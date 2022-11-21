//check for empty field
const isEmpty = (pupil_name, exam_no)=>{
    if(pupil_name != "" && exam_no != ""){
      return false
    }else if(pupil_name == ""){
      flag_empty_field("pupil_name")
      return false
    }else if(exam_no == ""){
      flag_empty_field("exam_no")
      return false
    }
}

//add red border around empty field
const flag_empty_field = (field)=>{
    $(".message").text("Write your fullname and examination Number before you continue.")
    if(field == "pupil_name"){
      $(".pupil_name").css({border: "1px solid red"})
      $(".exam_no").css({border: "1px solid grey"})
    }else if(field == "exam_no"){
      $(".exam_no").css({border: "1px solid red"})
      $(".pupil_name").css({border: "1px solid grey"})
    }
}

//checks if details is registered for any test
const check_user = (pupil_name, exam_no) => {
  let promise = new Promise((resolve, reject)=>{
    if(!isEmpty(pupil_name, exam_no)){
      $.post("php/login.php", {"pupil_name":pupil_name, "exam_no":exam_no}, function(result){
        let response = JSON.parse(result)
        let status = response.status
        let output = response.output

        if(status){
          resolve(output)
        }else{
          reject(output)
        }
      })
    }
  })

  return promise
}

const display_tests_registered = (output) => {
  let pupil_name = output["user"].name;
  let no_of_test = output["count"];

  let html = `
              <div class="avail_test_wrapper">
                <label class="login_name">${pupil_name}</label>
                <label class="avail_header"> You are registered for ${no_of_test} Tests </label>
                <p class="instruction"> Click on the test to start </p>
              </div>
            `
  $(".form-wrapper").html(html);

  for(i in output){
    if (i < no_of_test){
      let test_name = output[i].subject
      let test_id = output[i].test_id
      let pupil_class = "Primary " + output[i].class
      let duration = `${output[i].duration_hour} hr ${output[i].duration_minutes} mins`

      let each_test = `<div class="each_test" id=${test_id}>
            <div class="test_name">${test_name}</div>
            <div class="class"> ${pupil_class} </div>
            <div class="duration"> ${duration} </div>
          </div>`

      $(".form-wrapper").append(each_test)
    }
  }
}

const display_error = (message) =>{
  $(".message").text("SORRY!!! " + message)
}

const setCookie = (cname, cvalue) => {
  document.cookie = `${cname} = ${cvalue}`
}

const destroyCookie = (cname) =>{
  document.cookie = `${cname} = ; expires = Thu, 01 Jan 1970 00:00:00 UTC`
}

/************* Responding to events ******************/
$(document).on("click", ".login_button", function(e){
  e.preventDefault();
  let name = $(".pupil_name").val()
  let exam_no = $(".exam_no").val()

  if(!isEmpty(name, exam_no)){
    check_user(name, exam_no).then(display_tests_registered, display_error)
  }
})

$(document).on("click", ".each_test", function(e){
  destroyCookie("cur_time")
  destroyCookie("cur_quest")
  localStorage["questions"] = ""
  destroyCookie("question_numbers")
  destroyCookie("setting")
  setCookie("setting", JSON.stringify({"test_id": $(this).attr("id")}))
  window.location.href = "test.html"
})
