<?php
  session_start();

  if(isset($_SESSION["user"]) && $_SESSION["user"]["identity"] == "pupil"){
    echo $_SESSION["user"]["exam_no"];
  }else{
    echo false;
  }
?>
