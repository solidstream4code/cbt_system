<?php
  require_once("config.php");

  $conn = connect();

  $cat = $_POST["cat"];

  if($cat == "all"){
    $sql = "SELECT COUNT(test_id) AS count FROM tests";
  }else if($cat == "active"){
    $sql = "SELECT COUNT(test_id) AS count FROM tests WHERE active = 'true'";
  }else if($cat == "inactive"){
    $sql = "SELECT COUNT(test_id) AS count FROM tests WHERE active = 'false' ORDER BY date_created";
  }

  $result = $conn->query($sql);
  $result = $result->fetch();
  $result = $result["count"];

  echo $result;
?>
