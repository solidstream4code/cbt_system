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

const def_funct = () =>{
  $(".add-quests-cont").hide()
  $(".add-pupils-cont").hide();
}

function add_incomplete_tests_to_options(){
  $.post("../php/get_incomplete_test.php", function(result){
    $('.test_id_quest').empty()
    html_first = `<option> </option>`
    $('.test_id_quest').append(html_first)

    if(result){
      result = JSON.parse(result)
      for(var i = 0; i < result.length; i++){
        let test_name = result[i].title
        let test_id = result[i].test_id

        html = `<option  value=${test_id}> ${test_name} </option>`
        $('.test_id_quest').append(html)
      }
    }else{
      showModal("error", "There are no tests awaiting for questions to be added. Please create a test first", "error36762", function(){
        hideModal()
        window.location.href = "admin.html"
      })
    }
  })
}

function add_tests_to_options(){
  $.post("../php/get_tests_without_pupils.php", function(result){
    $('.test_id_select').empty()
    html_first = `<option> </option>`
    $('.test_id_select').append(html_first)

    if(result){
      result = JSON.parse(result)
      for(var i = 0; i < result.length; i++){
        let test_name = result[i].title
        let test_id = result[i].test_id

        html = `<option  value=${test_id}> ${test_name} </option>`
        $('.test_id_select').append(html)
      }
    }else{
      html = `<p> There are no tests requiring addition of pupils </p>`
      $('.test_id_select').append(html)
    }
  })
}

function add_lists_to_options(){
  $.post("../php/get_populated_lists.php", function(result){
    $('.list_id_select').empty()
    html_first = `<option> </option>`
    $('.list_id_select').append(html_first)

    if(result){
      result = JSON.parse(result)
      for(var i = 0; i < result.length; i++){
        let test_name = result[i].name
        let list_id = result[i].list_id

        html = `<option  value=${list_id}> ${test_name} </option>`
        $('.list_id_select').append(html)
      }
    }else{
      html = `<p> There are no tests requiring addition of pupils </p>`
      $('.list_id_select').append(html)
    }
  })
}

function add_all_lists_to_options(){
  $.post("../php/get_pupils_lists.php", function(result){
    $('.pupils_list_name').empty()
    html_first = `<option> </option>`
    $('.pupils_list_name').append(html_first)

    if(result){
      result = JSON.parse(result)
      for(var i = 0; i < result.length; i++){
        let test_name = result[i].name
        let list_id = result[i].list_id

        html = `<option  value=${list_id}> ${test_name} </option>`
        $('.pupils_list_name').append(html)
      }
    }else{
      html = `<p> There are no tests requiring addition of pupils </p>`
      $('.pupils_list_name').append(html)
    }
  })
}

const show_add_pupils = () => {
  $(".add_pupils_to_system").hide()
  $(".add_pupils_to_test").show()

  add_tests_to_options()
  add_lists_to_options()
  add_all_lists_to_options()

  $(".head-create-test").removeClass("active")
  $(".add_pupil_toggle").addClass("active")
  $(".header-text").text("Add Pupils")
  $(".add-details-cont").hide();
  $(".add-quests-cont").hide();
  $(".add-pupils-cont").fadeIn(1000);

  $(".upload-pupils").hide();
}


const show_add_questions = () => {
  add_incomplete_tests_to_options()
  $(".head-create-test").removeClass("active")
  $(".add_quests_toggle").addClass("active")
  $(".header-text").text("Author Questions")
  $(".add-details-cont").hide();
  $(".add-quests-cont").fadeIn(1000);
  $(".add-pupils-cont").hide();

  $(".upload-questions").hide();
}

const show_add_details = () => {
  $(".head-create-test").removeClass("active")
  $(".create_test_toggle").addClass("active")
  $(".header-text").text("Create Test")
  $(".add-details-cont").fadeIn(1000);
  $(".add-quests-cont").hide();
  $(".add-pupils-cont").hide();
}

const not_logged_in = () => {
  showModal("error", "You must be logged in", "error8676", function(){
    window.location.href="index.html"
    hideModal()
  })
}

is_logged_in().then(
    function(){} , not_logged_in
)

const isAnyEmpty = () => {
  let status = false
  $(".required").each(function(){
    if($(this).val() == ""){
      $(this).css({"border":"1px solid red"})
      $(".brief").text("Some Fields are empty please ensure you fill in all the fields")
      status = true;
    }
  })

  return status
}

const active = () =>{
  $(".required").each(function(){
    $(this).focus(function(){
      $(this).css({"border":"1px solid blue"})
    })
  })
}

const get_test_details = () =>{
  let details = {}
  $(".create_test").each(function(){
    let field = $(this).attr("id")
    let value = $(this).val()

    details[field] = value;
  })
  return details;
}

const display_count = () => {
  $.post("../php/count_tests.php", {"cat": "all"}, function(result){
    $(".count_all").text(result)
  })

  $.post("../php/count_tests.php", {"cat": "active"}, function(result){
    $(".count_active").text(result)
  })
}

const submit_test_details = () => {
  let promise = new Promise((accept, reject=function(){})=>{
    if(!isAnyEmpty()){
      $.post("../php/submit_test_details.php", get_test_details(), function(result){
        var output = JSON.parse(result)
        var status = output.status
        var response = output.output

        if(status){
          setCookie("test_id", response.test_id)
          showModal("success", "The test details has been added successfully", "succ2435", function(){
            hideModal()
            accept()
          })

        }else{
          showModal("error", response , "2366e73hngetet", function(){
            hideModal()
          })
        }
      })
    }
  })
  return promise
}

const submit_pupils = () => {
}

const add_pupil_to_test = (list_id, test_id)=>{
  $.post("../php/add_pupils.php", {"list_id":list_id, "test_id":test_id}, function(result){
    console.log(result)
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

$(document).ready(function(){
  def_funct();

  active()

  $(document).on("click", ".add_pupil_to_system", function(e){
    e.preventDefault()
    $(".add_pupils_to_system").fadeIn(1000);
    $(".add_pupils_to_test").fadeOut(500)
  })

  $(document).on("click", ".add_pupil_toggle", function(e){
    show_add_pupils()
  })

  $(document).on("click", ".add_quests_toggle", function(e){
    show_add_questions()
  })

  $(document).on("click", ".create_test_toggle", function(e){
    show_add_details()
  })

  $(document).on("click", ".create_test", function(e){
    e.preventDefault();
    submit_test_details().then(
      function(){
        window.location.href = "admin.html"
      }
    )
  })

  $(document).on("click", ".sel-pupil", function(e){
    e.preventDefault()
    if($('.pupils_list_name').val() !== ""){
      $(".list_name_value").attr("list_name", $('.pupils_list_name').val())
      $(".hidden-pupils").click()
    }else{
      showModal("notice", "Enter list name before selecting list file", "not4556", function(){
        hideModal()
      })
    }
  })

  $(document).on("click", ".sel-quest", function(e){
    e.preventDefault()
    if($('.test_id_quest').val() !== ""){
      $(".test_id_quest_hidden").attr("test_id", $('.test_id_quest').val())
      $(".hidden-questions").click()
    }else{
      showModal("notice", "Select test to add question before uploading question", "not4556", function(){
        hideModal()
      })
    }
  })

  $(document).on("click", ".add_pupil", function(e){
    e.preventDefault();
    let list_id = $(".list_id_select").val()
    let test_id = $(".test_id_select").val()

    if(list_id == "" || test_id == ""){
      showModal("error", "Select the Test and the List to add before submiting", "erro87628", function(){
        hideModal()
      })
    }else{
      add_pupil_to_test(list_id, test_id)
    }
  })

  readuploads("hiddden-pupils").then(
    function(pupil_data){
      $(document).on("click", ".upload-pupils", function(e){
        e.preventDefault();
        store_pupils(pupil_data)
      })

      display_pupils(pupil_data)
    }

  );

  readuploads("hidden-questions").then(
    function(question_data){
      $(document).on("click", ".upload-questions", function(e){
        e.preventDefault();
        store_questions(question_data, question_data.length)
      })

      display_questions(question_data)
    }
  )

  display_count();
})
