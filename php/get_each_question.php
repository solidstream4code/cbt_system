<?php
  require_once("config.php");

  $conn = connect();

  $test_id = $_POST["test_id"];
  $quest_id = $_POST["quest_id"];
  $db_name = 'questions_'.$test_id;

  $sql = "SELECT * FROM $db_name WHERE question_id = '$quest_id'";

  $result = $conn->query($sql);
  $result = $result->fetch();

  if($result){
    echo json_encode($result);
  }else{
    echo false;
  }
?>
