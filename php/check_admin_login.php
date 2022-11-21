<?php
  session_start();

  if(isset($_SESSION["user"]) && $_SESSION["user"]["identity"] == "admin"){
    echo true;
  }else{
    echo false;
  }
?>
