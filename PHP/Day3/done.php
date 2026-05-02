<!-- 
 1-Implement the form in php

2-Apply the validation on the
email ﬁeld on the php side using  2 ways

3- Room number should be a
drop down that contains
‘Application1, Application2 and
cloud)

4-Upload a proﬁle picture and
ensure that is a photo

Once the user submit his info, you should
store it in a ﬁle called users.

Create a login page with username and
password ((check valid login data from
the ﬁle))

Once the user logged in, start a session
and display a welcome message to him.
 -->
<?php

$name= $_POST['name'];
$email= $_POST['email'];
$password= $_POST['password'];
$hashedPass= password_hash($password, PASSWORD_DEFAULT);
$confirm_password= $_POST['confirm_password'];
$hashedConfirmPass= password_hash($confirm_password, PASSWORD_DEFAULT);
$room_number= $_POST['room_number'];
$profile_picture= $_FILES['profile_picture'];
$errors = [];


if (empty($name)) {
    $errors[] = "Name is required.";
} elseif (preg_match('~[0-9]~', $name)) {
    $errors[] = "First Name cannot contain numbers.";
}

if (empty($email)) {
    $errors[] = "Email is required.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $email)) {
    $errors[] = "Invalid email format.";
}

if(empty($password)) {
    $errors[] = "Password is required.";
}

if(empty($confirm_password)) {
    $errors[] = "You must confirm your password.";
} elseif (password_verify($confirm_password, $hashedPass) === false) {
    $errors[] = "Passwords do not match.";
}   

if(empty($room_number)) {
    $errors[] = "Room Number is required.";
} elseif (!in_array($room_number, ['Application1', 'Application2', 'Cloud'])) {
    $errors[] = "Invalid Room Number selected.";
}

if(!($profile_picture['size'])) {
    $errors[] = "Profile picture is required.";
} elseif (!in_array($profile_picture['type'], ['image/jpeg', 'image/png', 'image/gif'])) {
    $errors[] = "Profile picture must be a valid image (JPEG, PNG, GIF).";
}


if($errors) {
    foreach($errors as $error) {
        echo "<h1>$error</h1>";
    }
    exit;
}



$user= [
    $name,
    $email,
    $hashedPass,
    $room_number,
];

$newFile= fopen("users.txt","a");

if (fstat($newFile)['size'] == 0) {
    $headers = ["Name", "Email", "Hashed Pass",  "Room Number"];
    fputcsv($newFile, $headers);
}

fputcsv($newFile,$user);
fclose($newFile);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel</title>

        <style>
        body { font-family: sans-serif; padding: 20px; }
        .form-group { margin-bottom: 15px; display: flex; }
        label { width: 120px; font-weight: bold; }
        input[type="text"], input[type="password"], textarea, select { width: 300px; }
        .checkbox-group, .radio-group { display: inline-block; }
    </style>
</head>
<body>
    

    <h2>Cafeteria</h2>
    <form action="welcome.php" method="POST">

        <div class="form-group">
            <label>Email</label>
            <input type="email" name="email">
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password">
        </div>

        <div class="form-group">
            <label></label>
            <button type="submit">Login</button>
        </div>

    </form>
</body>
</html>


