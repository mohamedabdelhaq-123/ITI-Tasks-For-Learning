<?php

$email=$_POST['email'];
$password=$_POST['password'];
$flag= false;
foreach(file("users.txt") as $line){
    $values= str_getcsv($line);
    if($values[1] === $email && password_verify($password, $values[2])){
        session_start();
        $_SESSION['user']= $values;
        $flag= true;
    }
}

if($flag){
    echo "<h1>Welcome, " . $_SESSION['user'][0] . "!</h1>";
} else {
    echo "<h1>Invalid email or password.</h1>";
}


session_destroy();

?>