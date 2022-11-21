<?php
  require_once("config.php");
  session_start();

  $conn = connect();

  $name = $_POST["pupil_name"];
  $exam_no = $_POST["exam_no"];

  if(empty($name) or empty($exam_no)){

    $status = false;
    $output = "Write Your Name and Examination Number before you continue";
    echo json_encode(array("status"=> $status, "output"=>$output));

  }else{
    $all_test_registered = array();
    $active_tests = get_active_tests();

    if($active_tests){
      forEach($active_tests as $test){
          $check = is_in($name, $exam_no, $test);
        if($check){
          $all_test_registered[] = $test;
        }
      }


      if($all_test_registered){
          $no_of_test = count($all_test_registered);
          $_SESSION["user"] = array(
            "identity" => "pupil",
            "exam_no" => $exam_no,
            "name" => $name
          );

          $all_test_registered["user"] = $_SESSION["user"];
          $all_test_registered["count"] = $no_of_test;
          echo json_encode(array("status"=>true, "output"=>$all_test_registered));
      }else{
        $status = false;
        $output = "You are currently not registered for any test. Please check your name and examination number";
        echo json_encode(array("status"=> $status, "output"=>$output));
      }

    }else{
      $status = false;
      $output = "There is currently no any active tests now. Inform the Supervisor";
      echo json_encode(array("status"=> $status, "output"=>$output));
    }
  }
?>


<?php

/****** FUNCTIONS ******************/
  function get_active_tests(){ //gets all active tests
    global $conn;
    $sql = "SELECT * FROM tests WHERE active = 'true'";
    $result = $conn->query($sql);
    $tests = $result->fetchAll();

    return $tests;
  }

  function is_in($name, $exam_no, $test){ //checks if details is in test
    global $conn;
    $pupils_records = "pupils_".$test["test_id"];
    $sql = "SELECT pupil_id FROM $pupils_records WHERE name = '$name' AND exam_no = '$exam_no' AND taken = 'false'";
    try{
      $result = $conn->query($sql);
      $pupil = $result->fetchAll();

      if($pupil){
        return true;
      }else{
        return false;
      }
    }catch(Exception $e){
      return false;
    }
  }

?>
