const submit_test = () => {

}

const get_question_ids = () =>{
  let question_ids = [];

  let questions = JSON.parse(localStorage["questions"])

  for(var row = 0; row < questions.length; row++){
    let each_question = questions[row];
    question_ids.push(each_question[0])
  }

  return question_ids
}

const get_responses = () => {
  let responses = [];

  let questions = JSON.parse(localStorage["questions"]);
  for(var row = 0; row < questions.length; row++){
    let each_question = questions[row];
    responses.push(each_question.Answer)
  }

  return responses
}

const get_all_answers = () => {
  let promise = new Promise((accept, reject) => {
    let settings = JSON.parse(getCookie("setting"))
    let test_id = settings.test_id;

    $.post("php/get_all_questions.php", {test_id}, function(output){
      if(output){
        let result = JSON.parse(output)
        var all_answers = []

        for(var row = 0; row < result.length; row++){
          let each_question = result[row];
          all_answers.push(each_question.Answer)
        }
        accept(all_answers)
      }else{
        reject("Cannot fetch Questions. Please inform the invigilator")
      }
    })
  })
  return promise
}

const mark = (all_questions, all_answers, all_responses) => {
  let score = 0;

  for(var i = 0; i < all_questions.length; i++){
    let question_id = all_questions[i] - 1
    let answer = all_answers[question_id]
    let response = all_responses[i]

    if(answer == response){
      score = score + 1
    }
  }

  let score_percent = (score / all_questions.length) * 100
  return {score, score_percent}
}

const submit = (exam_no, test_id) => {
  get_all_answers().then(
    (all_answers) => {
      let answers = all_answers
      let questions = get_question_ids()
      let responses = get_responses()

      result =  mark(questions, answers, responses)

      let score = result.score
      let percent = result.score_percent

      $.post("php/score_test.php", {exam_no, test_id, score, percent}, function(output){
        if(output){
          showModal("success", "Congratulations your test has been submitted succesfully", "success27832378", function(){
            window.location.href="index.html";
          })
        }
      })

    }, function(message){
      showModal("error", message, "error72727823", function(){
        hideModal()
      })
    }
  )
}

$(document).ready(function(){
  //submitting tes

})
