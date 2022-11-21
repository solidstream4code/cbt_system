<?php
  require_once("config.php");

  $conn = connect();

  $test_name = $_POST["test-name"];
  $subject = $_POST["test-subject"];
  $class = $_POST["test-class"];
  $hour = $_POST["test-hour"];
  $minute = $_POST["test-minute"];
  $ques_no = $_POST["question_no"];

  $sql = "SELECT * FROM tests WHERE title = '$test_name'";
  $result = $conn->query($sql);
  $result = $result->fetchAll();

  if($result){
    $status = false;
    $output = "This test has been submitted before. Please use a different test Name or delete the former test";
    echo json_encode(array("status"=> $status, "output"=>$output));

  }else{
    $sql = "INSERT INTO tests(test_id, title, subject, class, total_questions, Question_per_pupil, duration_hour, duration_minutes, date_created, active, quest_added, pupil_added)
                        VALUES('', '$test_name','$subject', '$class', 0, '$ques_no', '$hour', '$minute', now(), 'false', 'false', 'false')";

    if($conn->query($sql)){
      $sql = "SELECT test_id FROM tests WHERE title = '$test_name'";
      $result = $conn->query($sql);
      $output = $result->fetch();

      $status = true;
      echo json_encode(array("status"=> $status, "output"=>$output));
    }else{
      $status = false;
      $output = "Unable to add details. please check that all fields are properly entered";
      echo json_encode(array("status"=> $status, "output"=>$output));
    }
  }

?>
