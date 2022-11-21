<?php
  require_once("config.php");
  session_start();

  $conn = connect();

  $name = $_POST["username"];
  $password = $_POST["password"];

  if(empty($name) or empty($password)){

    $status = false;
    $output = "incorrect username or password";
    echo json_encode(array("status"=> $status, "output"=>$output));

  }else{
    $sql = "SELECT id FROM admin WHERE username='$name' AND password ='$password'";
    $result = $conn->query($sql);
    $result = $result->fetch();

    if($result != ""){

      $_SESSION["user"] = array(
        "identity" => "admin",
        "id" => $result
      );

      $status = true;
      $output = "You are successfully logged in";
      echo json_encode(array("status"=> $status, "output"=>$output));
    }else{
      $status = false;
      $output = "Incorrect Username or Password";
      echo json_encode(array("status"=> $status, "output"=>$output));
    }
  }
?>
