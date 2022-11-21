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

const get_cat = (address) => {
    var id = "";
  	var queries = getQueries(address);
  	for(i in queries){
  		if(queries[i][0] == "cat"){
  			id = queries[i][1];
  		}
  	}

    if(id){
      return id
    }else{
      return false
    }
}

const sel_active = (cat) => {
  $(".head-create-test").removeClass("active")

  if(cat == "all"){
    $(".header-text").text("ALL TESTS")
    $(".all_toggle").addClass("active")
  }else if(cat == "active"){
    $(".header-text").text("ACTIVE TESTS")
    $(".active_toggle").addClass("active")
  }else if(cat == "inactive"){
    $(".header-text").text("INACTIVE TESTS")
    $(".inactive_toggle").addClass("active")
  }
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

is_logged_in().then(
	function(){

	}, function(){
		showModal("error", "This page is only available to Admin. Please log in", "err393922", function(){
			window.location.href = "index.html"
		})
	}
)

const get_tests = (cat) => {
  $(".create-test-body").empty()
  sel_active(cat)

  $.post("../php/get_tests_by_category.php", {"cat":cat}, function(res){
    let result = JSON.parse(res)
    let status = result.status
    let outcome = result.output

    if(status){
      for(var row = 0; row < outcome.length; row++){
        let exam_title = outcome[row].title
        let exam_status = (outcome[row].active == "true")? "active" : "inactive"
        let exam_subject = outcome[row].subject
        let exam_class = "Primary " + outcome[row].class
        let exam_date = outcome[row].date_created
        let exam_id = outcome[row].test_id

        var each_test = `<div class="each-test">
          <div class="test-head">
            <div class="test_title"> ${exam_title} </div>
              <div class="test_status status-${exam_status}"> ${exam_status} </div>
          </div>
          <div class="test-options">
            <div class="option test_subject"> ${exam_subject} </div>
            <div class="test_class"> ${exam_class} </div>
            <div class="date">${exam_date} </div>
          </div>
          <div class="test-button">
            <button class="manage" test_id = ${exam_id}> Manage </button>
          </div>
        </div>`

        $(".create-test-body").append(each_test)
      }
    }else{
      if(outcome == "error0"){
        showModal("error", "Unknown Category name supplied", "err761717", function(){
          hideModal();
        })
      }else if(outcome == "error1"){

        let message = "No test found on the system. You can create a test and try again"

        if(cat == "active"){
          message = "No active test currently"
        }else if(cat == "inactive"){
          message = "No Inactive test currently"
        }
        let warning = `<div class="no-test"> ${message} </div>`
        $(".create-test-body").append(warning)
      }
    }
  })
}

var cat = ""

const default_function = () =>{
  if(get_cat(window.location.href)){
    cat = get_cat(window.location.href)

    if(cat == "all" || cat == "active" || cat == "inactive"){
    }else{
      cat = "all"
    }
  }else{
    cat = "all"
  }

  get_tests(cat)
}


$(document).ready(function(){
  default_function();

  $(document).on("click", ".head-create-test", function(e){
    if($(this).hasClass("all_toggle")){
      cat = "all"
    }else if($(this).hasClass("active_toggle")){
      cat = "active"
    }else if($(this).hasClass("inactive_toggle")){
      cat = "inactive"
    }
    get_tests(cat)
  })

  $(document).on("click", ".manage", function(e){
    let test_id = $(this).attr("test_id")
    window.location.href = "test.html?t_id="+test_id
  })


})
