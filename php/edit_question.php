<?php
  require_once("config.php");

  $conn = connect();

  $table = "questions_".$_POST["test_id"];
  $question = $_POST["question"];
  $a = $_POST["a"];
  $b = $_POST["b"];
  $c = $_POST["c"];
  $d = $_POST["d"];
  $image = $_POST["image"];
  $test_id = $_POST["q_no"];

  $sql = "UPDATE $table SET question = '$question', image = '$image', A = '$a', B = '$b', C = '$c', D = '$d' WHERE question_id = $test_id";

  $conn->query($sql);

  echo true;
?>
