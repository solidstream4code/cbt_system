<?php
    //declare the database connection variables

    define("DSN", "mysql:dbName=zakcbt");
    define("USERNAME", "zakcbt");
    define("PASSWORD", "zakcbt");

    //function to connect to database
    function connect(){
        $conn = new PDO(DSN, USERNAME, PASSWORD);
        $conn->setAttribute(PDO::ATTR_PERSISTENT, true);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "USE zakcbt";
        $conn->query($sql);

        return $conn;
    }

    function disconnect($conn){
        $conn = "";
    }
?>
