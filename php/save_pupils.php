<?php
  require_once("config.php");
  $conn = connect();

  $list_id = $_POST["list_id"];
  $pupils = json_decode($_POST["pupils"]);
  $table_name = "pupils_list_".$list_id;


  $sql = "SELECT * FROM pupil_lists WHERE list_id = '$list_id' AND populated = 'true'";
  $result = $conn->query($sql);
  $result = $result->fetch();

  if($result){
    $sql = "DROP TABLE $table_name";
    $conn->query($sql);
  }

  try{
    $sql = "CREATE TABLE $table_name(
      pupil_id INT(100) NOT NULL AUTO_INCREMENT,
      name VARCHAR(250) NOT NULL,
      exam_no VARCHAR(250) NOT NULL,
      PRIMARY KEY (pupil_id)
    )";

    $conn->query($sql);
  }catch(Exception $e){
    $status = false;
    $output = $e; //"Failed to create student records. Cannot create list. Please try again";
    die(json_encode(array("status"=> $status, "output"=>$output)));
  }

  try{
    $sql = "INSERT INTO $table_name(name, exam_no)";
    $values = "";
    $no = 0;

    forEach($pupils as $pupil){
      $name = $pupil[0];
      $exam_no = $pupil[1];

      if($no == 0){
        $values = $values . "VALUES ('$name', '$exam_no')";
      }else{
        $values = $values.", ('$name', '$exam_no')";
      }

      $no = $no + 1;
    }

    $sql = $sql . $values;
    $conn->query($sql);

    $sql = "UPDATE pupil_lists SET populated = 'true' WHERE list_id = '$list_id'";
    $conn->query($sql);

    $status = true;
    $output = "Pupils have been successfully added to test";
    echo json_encode(array("status"=> $status, "output"=>$output));
  }catch(Exception $e){
    $sql = "DROP TABLE $table_name";
    $conn->query($sql);

    $status = false;
    $output = "Failed to create student records list. Please Check the uploaded file to ensure its a .csv file";
    die(json_encode(array("status"=> $status, "output"=>$output)));
  }
?>
