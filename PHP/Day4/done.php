
<?php
// if(empty($_GET['msg']) ) 


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


// placeholders
// sql injection
// bindings
// fetch all
// fetch by id (one by one)



$connection = mysqli_connect("localhost", "iti_user", "123456", "hotel");

if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}
$sql = "INSERT INTO users (name, email, password, room_number) VALUES ('$name', '$email', '$hashedPass', '$room_number')";

$res= mysqli_query($connection, $sql);

if(!$res) {
    die("Error: " . mysqli_error($connection));
}




// $user= [
//     $name,
//     $email,
//     $hashedPass,
//     $room_number,
// ];

// $newFile= fopen("users.txt","a");

// if (fstat($newFile)['size'] == 0) {
//     $headers = ["Name", "Email", "Hashed Pass",  "Room Number"];
//     fputcsv($newFile, $headers        mysqli_close($conn););
// }

// fputcsv($newFile,$user);
// fclose($newFile);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>All Users</title>
</head>
<body>
    <h2>Users List</h2>
    <table border="1">
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Room No.</th>
        </tr>

        <?php
        $sql2 = "SELECT * FROM users";
        $result = mysqli_query($connection, $sql2);

        while ($row = mysqli_fetch_assoc($result)) {
            echo "<tr>";
            echo "<td>" . $row['name'] . "</td>";
            echo "<td>" . $row['email'] . "</td>";
            echo "<td>" . $row['room_number'] . "</td>";
        
            echo "<td>
                    <a href='edit.php?id=" . $row['id'] . "'>Edit</a> | 
                    <a href='delete.php?id=" . $row['id'] . "'>Delete</a>
                  </td>";
            echo "</tr>";
        }

        mysqli_close($connection);
        ?>
    </table>
    <br>
</body>
</html>



