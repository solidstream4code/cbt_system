<?php
  require_once("config.php");

  $conn = connect();

  $test_id = $_POST["test_id"];

  $sql = "SELECT * FROM tests WHERE test_id = '$test_id'";

  $result = $conn->query($sql);
  $result = $result->fetch();

  if($result){
    echo json_encode($result);
  }else{
    echo false;
  }
?>
