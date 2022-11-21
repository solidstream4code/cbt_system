<?php
  require_once("config.php");
  $conn = connect();
  $test_id = $_POST["test_id"];

  $sql = "UPDATE tests SET active = 'false' WHERE test_id = '$test_id'";

  if($conn->query($sql)){
    echo true;
  }else{
    echo false;
  }
?>
