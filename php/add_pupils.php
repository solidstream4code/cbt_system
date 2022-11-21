<?php
  require_once("config.php");
  $conn = connect();

  $test_id = $_POST["test_id"];
  $list_id = $_POST["list_id"];
  $table = "pupils_list_".$list_id;
  $new_table = "pupils_".$test_id;

  $sql = "SELECT * FROM $table";
  $result = $conn->query($sql);
  $result = $result->fetchAll();
  $pupils = $result;

  try{
    $sql = "CREATE TABLE $new_table(
      pupil_id INT(100) NOT NULL AUTO_INCREMENT,
      name VARCHAR(250) NOT NULL,
      exam_no VARCHAR(250) NOT NULL,
      total_answered INT(100) NOT NULL,
      score_percent INT(100) NOT NULL,
      taken VARCHAR(250) NOT NULL,
      PRIMARY KEY (pupil_id)
    )";

    $conn->query($sql);
  }catch(Exception $e){
    $status = false;
    $output = "Failed to add pupil to test. Please retry again";
    die(json_encode(array("status"=> $status, "output"=>$output)));
  }

  try{
    $sql = "INSERT INTO $new_table (name, exam_no, total_answered, score_percent, taken)";
    $values = "";
    $no = 0;

    forEach($pupils as $pupil){
      $name = $pupil[1];
      $exam_no = $pupil[2];

      if($no == 0){
        $values = $values . "VALUES ('$name', '$exam_no', 0, 0, 'false')";
      }else{
        $values = $values.", ('$name', '$exam_no', 0, 0, 'false')";
      }

      $no = $no + 1;
    }

    $sql = $sql . $values;
    $conn->query($sql);

    $sql = "UPDATE tests SET pupil_added = 'true' WHERE test_id  = '$test_id'";
    $conn->query($sql);

    $status = true;
    $output = "Pupils have been added to test successfully added to test";
    echo json_encode(array("status"=> $status, "output"=>$output));
  }catch(Exception $e){
    $sql = "DROP TABLE $table";
    $conn->query($sql);

    $status = false;
    $output = "Failed to add pupil to test. Please retry again";
    die(json_encode(array("status"=> $status, "output"=>$output)));
  }
?>
