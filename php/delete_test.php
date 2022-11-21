<?php
  require_once("config.php");

  $conn = connect();
  $test_id = $_POST["test_id"];
  $pupils_table = "pupils_".$test_id;
  $questions_table = "questions_".$test_id;

  try{
    $sql = "DELETE FROM tests WHERE test_id = '$test_id'";
    $conn->query($sql);
  }catch(Exception $e){
    die("false");
  }

  try{
    $sql = "DROP TABLE $pupils_table";
    $conn->query($sql);
  }catch(Exception $e){
    die("false");
  }

  try{
    $sql = "DROP TABLE $questions_table";
    $conn->query($sql);
  }catch(Exception $e){
    die("false");
  }

  echo true;
?>
