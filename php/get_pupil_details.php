<?php
  require_once("config.php");

  $conn = connect();

  $table = "pupils_".$_POST["test_id"];
  $exam_no = $_POST["exam_no"];

  $sql = "SELECT * FROM $table WHERE exam_no = '$exam_no'";

  $result = $conn->query($sql);
  $result = $result->fetch();

  if($result){
    echo json_encode($result);
  }else{
    echo false;
  }
?>
