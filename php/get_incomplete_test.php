<?php
  require_once("config.php");

  $conn = connect();

  $sql = "SELECT * FROM tests WHERE quest_added = 'false'";

  $result = $conn->query($sql);
  $result = $result->fetchAll();

  if($result){
    echo json_encode($result);
  }else{
    echo false;
  }
?>
