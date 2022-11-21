<?php
  require_once("config.php");
  $conn = connect();

  $test_id = $_POST["test_id"];
  $questions = json_decode($_POST["questions"]);
  $table = "questions_".$test_id;
  $no_of_questions = $_POST["no_of_questions"];

  $sql = "SELECT Question_per_pupil FROM tests WHERE test_id = '$test_id'";
  $result = $conn->query($sql);
  $result = $result->fetch();
  $per_pupil = $result['Question_per_pupil'];

  if($per_pupil > $no_of_questions){
    $status = false;
    $output = "Failed to add Questions. This test requires at least {$per_pupil} questions. You attempted to submit {$no_of_questions} questions. Please try again with more questions";
    die(json_encode(array("status"=> $status, "output"=>$output)));
  }

  try{
    $sql = "CREATE TABLE $table (
      question_id INT(100) NOT NULL AUTO_INCREMENT,
      question LONGTEXT NOT NULL ,
      image VARCHAR(100) NOT NULL ,
      A VARCHAR(250) NOT NULL ,
      B VARCHAR(250) NOT NULL ,
      C VARCHAR(250) NOT NULL ,
      D VARCHAR(250) NOT NULL ,
      Answer VARCHAR(2) NOT NULL ,
      PRIMARY KEY (question_id)
    )";

    $conn->query($sql);
  }catch(Exception $e){
    $status = false;
    $output = "Failed to create Questions records. Please Check the uploaded file to ensure its a .csv file";
    die(json_encode(array("status"=> $status, "output"=>$output)));
  }

  try{
    $sql = "INSERT INTO $table (question, A, B, C, D, Answer)";
    $values = "";
    $no = 0;

    forEach($questions as $question){
      $quest = $question[0];
      $a = $question[1];
      $b = $question[2];
      $c = $question[3];
      $d = $question[4];
      $answer = $question[5];

      if($no == 0){
        $values = $values . "VALUES ('$quest', '$a', '$b', '$c', '$d', '$answer')";
      }else{
        $values = $values.", ('$quest', '$a', '$b', '$c', '$d', '$answer')";
      }

      $no = $no + 1;
    }

    $sql = $sql . $values;
    $conn->query($sql);

    $sql = "UPDATE tests SET active = 'false', total_questions = $no_of_questions WHERE test_id  = '$test_id'";
    $conn->query($sql);

    $status = true;
    $output = "Questions have been successfully added to test";

    $sql = "UPDATE tests SET quest_added = 'true' WHERE test_id = '$test_id'";
    $conn->query($sql);

    echo json_encode(array("status"=> $status, "output"=>$output));
  }catch(Exception $e){
    $sql = "DROP TABLE $table";
    $conn->query($sql);

    $status = false;
    $output = "Failed to create Questions records list. Please Check the uploaded file to ensure its a .csv file";
    die(json_encode(array("status"=> $status, "output"=>$output)));
  }
?>
