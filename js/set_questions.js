var settings = JSON.parse(getCookie("setting"))

setCookie = (cname, cvalue) => {
  document.cookie = `${cname} = ${cvalue}`
}

const get_all_questions = ({test_id}) => {
  let promise = new Promise((resolve, reject)=>{
    $.post("php/get_all_questions.php", {test_id}, function(result){
      let output = JSON.parse(result)
      if(output){
        resolve(output)
      }else{
        reject()
      }
    })
  })
  return promise
}


const set_question = (all_questions) => {
  var questions = {}

  if(localStorage["questions"] != undefined && localStorage["questions"] != []){
    questions = JSON.parse(localStorage["questions"]);
  }else{
    let question_no = JSON.parse(getCookie("question_numbers"))
    let questions = question_no.map((question) =>{
      for(var i = 0; i < all_questions.length; i++){
        if(question == all_questions[i].question_id){
          all_questions[i].Answer = ""
          all_questions[i][7] = ""
          return all_questions[i];
        }
      }
    })

    localStorage["questions"] = JSON.stringify(questions)
  }
  return questions
}

const set_current_question = () => {
  let cur_quest = 1
  if(getCookie("cur_quest")){
    cur_quest = getCookie("cur_quest")
  }else{
    setCookie("cur_quest", cur_quest)
  }
}

const get_current_question = () => {
  return getCookie("cur_quest")
}

const get_my_questions = () => {
  let questions = JSON.parse(localStorage["questions"])
  return questions
}

const mark_answered_question = (answer) => {
  $(`.option_cont`).removeClass("answered")
  $(`.checked_opt`).remove()

  $(`.opt${answer}`).addClass("answered")
  $(`.opt${answer}`).append(`<div class='fa fa-check checked_opt'> </div>`)
}

const display_question = (current_quest) => {
  let myquestions = get_my_questions()
  let q_no = current_quest
  let cur_quest = current_quest - 1

  let question = myquestions[cur_quest].question;
  let image = myquestions[cur_quest].image;
  let option_A = myquestions[cur_quest].A;
  let option_B = myquestions[cur_quest].B;
  let option_C = myquestions[cur_quest].C;
  let option_D = myquestions[cur_quest].D;
  let answer = myquestions[cur_quest].Answer;

  $(".q_no").text(`Q ${q_no}`)
  $(".optionA").text(option_A)
  $(".optionB").text(option_B)
  $(".optionC").text(option_C)
  $(".optionD").text(option_D)
  $(".question-text").text(question)

  if(image){
    $(".quest-img").attr("src", "images/"+image)
  }else{
    $(".quest-img").attr("src", " ")
  }

  if(answer != ""){
    $(`.option_cont`).removeClass("answered")
    $(`.checked_opt`).remove()

    $(`.opt${answer}`).addClass("answered")
    $(`.opt${answer}`).append(`<div class='fa fa-check checked_opt'> </div>`)
  }
}

const next = (current_quest) => {
  if(!parseInt(settings.quest_per_pupil)){
    window.location.href = "test.html"
  }

  let q_no = current_quest
  let cur_quest = current_quest - 1

  if(q_no < parseInt(settings.quest_per_pupil)){
    setCookie("cur_quest", parseInt(q_no) + 1)
  }else{
    setCookie("cur_quest", 1)
  }

  $(`.option_cont`).removeClass("answered")
  $(`.checked_opt`).remove()

  display_question(getCookie("cur_quest"))
  $(".quest_no").removeClass("cur_option")
  $(`#Q${getCookie("cur_quest")}`).addClass("cur_option")
}

const back = (current_quest) => {
  let q_no = current_quest
  let cur_quest = current_quest - 1

  if(q_no <= 1){

  }else{
    setCookie("cur_quest", parseInt(q_no) - 1)
  }

  $(`.option_cont`).removeClass("answered")
  $(`.checked_opt`).remove()

  display_question(getCookie("cur_quest"))
  $(".quest_no").removeClass("cur_option")
  $(`#Q${getCookie("cur_quest")}`).addClass("cur_option")

}

const choose_answer = (current_quest, answer) => {
  let myquestions = get_my_questions()
  let q_no = current_quest
  let cur_quest = current_quest - 1
  myquestions[cur_quest].Answer = answer;

  localStorage["questions"] = JSON.stringify(myquestions)
  $(`.checked${getCookie("cur_quest")}`).remove()
  $(`#Q${getCookie("cur_quest")}`).append(`<div class='fa fa-check checked${getCookie("cur_quest")}'></div>`)

  $(`.option_cont`).removeClass("answered")
  $(`.checked_opt`).remove()

  $(`.opt${answer}`).addClass("answered")
  $(`.opt${answer}`).append(`<div class='fa fa-check checked_opt'> </div>`)
}

$(document).ready(function(){

//setting current question
  set_current_question()


//choose answer
  $(document).on("click", ".option_cont", function(e){
    let selected = ""
    if($(this).hasClass("optA")){
      selected = "A"
    }else if($(this).hasClass("optB")){
      selected = "B"
    }else if($(this).hasClass("optC")){
      selected = "C"
    }else if($(this).hasClass("optD")){
      selected = "D"
    }

    choose_answer(getCookie("cur_quest"), selected)
  })

})
