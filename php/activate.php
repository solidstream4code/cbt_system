<?php
  require_once("config.php");
  $conn = connect();
  $test_id = $_POST["test_id"];

  $sql = "SELECT COUNT(test_id) as count FROM tests WHERE pupil_added = 'true' AND test_id = '$test_id'";
  $result = $conn->query($sql);
  $result = $result->fetch();
  $no_pupil_added = $result["count"];

  $sql = "SELECT COUNT(test_id) as count FROM tests WHERE quest_added = 'true' AND test_id = '$test_id'";
  $result = $conn->query($sql);
  $result = $result->fetch();
  $no_quest_added = $result["count"];


  if($no_pupil_added == 0 and $no_quest_added == 0){
    die("missing both");
  }else if($no_quest_added == 0){
      die("missing questions");
  }else if($no_pupil_added == 0){
    die("missing pupils");
  }else if($no_pupil_added != 0 and $no_quest_added != 0){
      $sql = "UPDATE tests SET active = 'true' WHERE test_id = '$test_id'";
      $conn->query($sql);
      echo "success";
  }

?>
