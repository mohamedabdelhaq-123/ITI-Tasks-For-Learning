<?php
$fname = $_POST['first_name'];
$lname  = $_POST['last_name'];
$email = $_POST['email'];
$captcha= $_POST['captcha_input'] ;
$errors = [];

if ($captcha !== "mossee45c") {
    $errors[] = "Invalid Captcha.";
}

if (empty($fname)) {
    $errors[] = "First Name is required.";
} elseif (preg_match('~[0-9]~', $fname)) {
    $errors[] = "First Name cannot contain numbers.";
}

if (empty($lname)) {
    $errors[] = "Last Name is required.";
} elseif (preg_match('~[0-9]~', $lname)) {
    $errors[] = "Last Name cannot contain numbers.";
}

if (empty($email)) {
    $errors[] = "Email is required.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format.";
}

if(empty($_POST['skills'])) {
    $skills= "No skills selected";
}
else{
    $skills= implode(", ", $_POST['skills']);
}

if (!empty($errors)) {
    foreach ($errors as $error) {
        echo "<h1>$error</h1>";
    }
    exit;
}




$user= [
    $_POST['first_name'],
    $_POST['last_name'],
    $_POST['email'],
    $_POST['address'],
    $_POST['country'],
    $_POST['gender'],
    $_POST['username'],
    $_POST['department'],
    $skills
];

$newFile= fopen("customer.txt","a");

if (fstat($newFile)['size'] == 0) {
    $headers = ["First Name", "Last Name", "Email", "Address", "Country", "Gender", "Username", "Department", "Skills"];
    fputcsv($newFile, $headers);
}

fputcsv($newFile,$user);
fclose($newFile);


echo "<table border='1'>";
foreach(file("customer.txt") as $line){
    echo "<tr>";
    foreach(str_getcsv($line) as $value){
        echo "<td>$value</td>";
    }
    echo "</tr>";
}
echo "</table>";


?>

