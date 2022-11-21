<?php
  require_once("config.php");

  $conn = connect();

  $test_id = $_POST["test_id"];
  $db_name = 'questions_'.$test_id;

  $sql = "SELECT * FROM $db_name ORDER BY question_id";

  $result = $conn->query($sql);
  $result = $result->fetchAll();

  if($result){
    echo json_encode($result);
  }else{
    echo false;
  }
?>
