<?php
  require_once("config.php");

  $conn = connect();

  $test_id = $_POST["test_id"];
  $exam_no = $_POST["exam_no"];
  $score = $_POST["score"];
  $percent = $_POST["percent"];

  $pupils_record = "pupils_".$test_id;

  $sql = "UPDATE $pupils_record SET total_answered = '$score', score_percent = '$percent', taken = 'true' WHERE exam_no = '$exam_no'";

  try{
    $conn->query($sql);
    echo true;
  }catch(Exception $e){
    die(false);
  }


 ?>
