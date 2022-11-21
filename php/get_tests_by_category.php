<?php
  require_once("config.php");

  $conn = connect();

  $cat = $_POST["cat"];

  if($cat == "all"){
    $sql = "SELECT * FROM tests ORDER BY date_created DESC";
  }else if($cat == "active"){
    $sql = "SELECT * FROM tests WHERE active = 'true' ORDER BY date_created DESC";
  }else if($cat == "inactive"){
    $sql = "SELECT * FROM tests WHERE active = 'false' ORDER BY date_created DESC";
  }else{
    $output = json_encode(array("status"=>false, "output"=>"error0"));
    die($output);
  }

  $result = $conn->query($sql);
  $result = $result->fetchAll();

  if($result){
    $output = json_encode(array("status"=>true, "output"=>$result));
    echo $output;
  }else{
    $output = json_encode(array("status"=>false, "output"=>"error1"));
    echo $output;
  }
?>
