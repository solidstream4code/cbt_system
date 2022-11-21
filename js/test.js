setCookie = (cname, cvalue) => {
  document.cookie = `${cname} = ${cvalue}`
}

getCookie = (cname) => {
  var name = cname + "=";
  var ca = document.cookie.split(";");

  for(var i = 0; i < ca.length; i++){
    var c = ca[i];

    while(c.charAt(0) == ' '){
      c = c.substring(1);
    }

    if(c.indexOf(name) == 0){
      return c.substring(name.length, c.length)
    }
  }

  return ""
}

set_test_setting = (test_id) => {
  let promise = new Promise( (resolve, reject = ()=>{})=>{
    $.post("php/get_test_settings.php", {"test_id":test_id}, function(result){
      let outcome = JSON.parse(result)
      let test_id = outcome.test_id
      let subject = outcome.subject
      let subject_class = outcome.class
      let total_questions = outcome.total_questions
      let quest_per_pupil = outcome.Question_per_pupil
      let hour = outcome.duration_hour
      let minutes = outcome.duration_minutes

      setting_data = {test_id, subject, subject_class, total_questions, quest_per_pupil, hour, minutes}
      setCookie("setting", JSON.stringify(setting_data))
      resolve()
    })
  })
  return promise;
}

const set_questions_no = ({quest_per_pupil})=>{
  let question_no = []
  for(var i = 1; i <= quest_per_pupil; i++){
    question_no.push(i);
  }

  // For each element in the array, swap with a randomly chosen lower element
  len = question_no.length;

  for(var i = len-1; i > 0; i--) {
    var r = Math.floor(Math.random()*(i+1)), temp; // Random number
    temp = question_no[i], question_no[i] = question_no[r], question_no[r] = temp; // Swap
  }

  setCookie("question_numbers", JSON.stringify(question_no))
}

const is_logged_in = ()=> {
  let promise = new Promise((resolve, reject) => {
    $.post("php/check_pupil_login.php", {}, function(result){
      if(result){
        resolve(result)
      }else{
        reject()
      }
    })
  })

  return promise
}

const not_logged_in = () => {
  showModal("error", "You must be logged in to take exams", "error8676", function(){
    window.location.href="index.html"
    hideModal()
  })
}

const pupil_not_found = () => {
  showModal("error", "No pupil details found for this test. Please try logging in again", "error2276", function(){
    window.location.href="index.html"
    hideModal()
  })
}

const get_pupil_details = (exam_no, test_id) => {
  let promise = new Promise((resolve, reject)=>{
    $.post("php/get_pupil_details.php", {"test_id":test_id, "exam_no":exam_no}, function(result){
      if(result){
        let output = JSON.parse(result)
        resolve(output)
      }else{
        reject()
      }
    })
  })
  return promise
}

const display_pupil_name = ({name}) => {
  $(".pupil_name").text(name)
}

const display_subject_name = ({subject}) =>{
  $(".subject").text(subject)
}

const display_subject_class = ({subject_class}) => {
  $(".class").text("Primary " + subject_class)
}

const display_question_buttons = ({quest_per_pupil}) => {
  $(".questions").empty()
  for(var i = 1; i <= quest_per_pupil; i++){
    let button = `<button type="button" name="button" id=Q${i} class="quest_no"> ${i} </button>`
    $(".questions").append(button)
  }
}


const display_timer = ({hour}, {minutes}, exam_no, test_id) => {
  var miliseconds = 0
  if(getCookie("cur_time")){
    miliseconds = getCookie("cur_time");
  }else{
    var hours_mili = hour * 60 * 60 * 1000
    var minutes_mili = minutes * 60 * 1000
    var miliseconds = hours_mili + minutes_mili
  }

  var time = setInterval(function(){
    miliseconds = miliseconds - 1000
    hours = Math.floor((miliseconds / (60 * 60 * 1000)))
    minutes = Math.floor((miliseconds % (60 * 60 * 1000)) / (60 * 1000))
    seconds = Math.floor((miliseconds % (60 * 60 * 1000)) % (60 * 1000) / 1000)

    $(".time-value").text(`${hours} : ${minutes} : ${seconds}`)
    setCookie("cur_time", miliseconds)

    if(hours == 0 && minutes == 0 && seconds == 0){
      submit(exam_no, test_id)
      clearInterval(time)
    }
  }, 1000)
}

//display_timer(0, 1)

//check pupil session and tune test setting if session available, else redirect to login

is_logged_in().then(
  (exam_no)=>{
    set_test_setting(JSON.parse(getCookie("setting")).test_id).then(function(){
      render_interface()

      get_all_questions(settings).then(function(output){
        set_questions_no(JSON.parse(getCookie("setting")))

        //set questions
        set_question(output)

        //display question
        display_question(getCookie("cur_quest"))

      },() => {
          showModal("error", "Failed to set question", "error8273939", function(){
            window.location ="index.html"
            hideModal()
          })
        }
      )
    })
  },
  not_logged_in
)

//rendering the interface after page load
const render_interface = () => {
  $(document).ready(function(){
    is_logged_in().then(
      (exam_no) => {
        let settings = JSON.parse(getCookie("setting"))

        //getting pupils details and modifying the interface
        let test_id = settings.test_id;
        get_pupil_details(exam_no, test_id).then(
          display_pupil_name, pupil_not_found
        )

        //loopng through the question number buttons and displaying each button
        display_question_buttons(settings)

        //displaying subject name
        display_subject_name(settings)

        //displaying subject class
        display_subject_class(settings)

        //next button click
          $(document).on("click", ".next", function(){
            next(getCookie("cur_quest"))
          })

        //next button click
          $(document).on("click", ".back", function(){
            back(getCookie("cur_quest"))
          })

        //scoring test
        $(document).on("click", ".submit_exam", function(){
          showQuery("notice", "Are you sure you want to submit test?", "yes627623762", "no7888222",
            function(){
              submit(exam_no, test_id)
            },

            function(){
              hideModal()
            }
          )
        })

        //settings = JSON.parse(getCookie("settings"))
        display_timer(settings, settings, exam_no, test_id)

      }, not_logged_in
  )
  })
}
