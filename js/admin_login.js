//check for empty field
const isEmpty = (username, password)=>{
    if(username != "" && password != ""){
      return false
    }else if(username == ""){
      flag_empty_field("username")
      return false
    }else if(password == ""){
      flag_empty_field("password")
      return false
    }
}

//add red border around empty field
const flag_empty_field = (field)=>{
    $(".message").text("Write your fullname and examination Number before you continue.")
    if(field == "username"){
      $(".username").css({border: "1px solid red"})
      $(".password").css({border: "1px solid grey"})
    }else if(field == "password"){
      $(".password").css({border: "1px solid red"})
      $(".username").css({border: "1px solid grey"})
    }
}

//checks admin
const check_user = (username, password) => {
  let promise = new Promise((resolve, reject)=>{
    if(!isEmpty(username, password)){
      $.post("../php/admin_login.php", {"username":username, "password":password}, function(result){
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

const logged_in = (output) => {
  showModal("success", output, "sucess162w627", function(){
    window.location.href="admin.html"
    hideModal()
  })
}

const display_error = (message) =>{
  $(".message").text("SORRY!!! " + message)
}

/************* Responding to events ******************/
$(document).on("click", ".login_button", function(e){
  e.preventDefault();
  let username = $(".username").val()
  let password = $(".password").val()

  if(!isEmpty(username, password)){
    check_user(username, password).then(logged_in, display_error)
  }
})
