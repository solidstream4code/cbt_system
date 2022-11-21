<?php
  require_once("config.php");

  $conn = connect();

  $table = "pupils_".$_POST["test_id"];

  $sql = "SELECT * FROM $table ORDER BY pupil_id";

  $result = $conn->query($sql);
  $result = $result->fetchAll();

  if($result){
    echo json_encode($result);
  }else{
    echo false;
  }
?>
