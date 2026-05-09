<?php
$connection = mysqli_connect("localhost", "iti_user", "123456", "hotel");
$id = $_GET['id'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $sql = "UPDATE users SET name='$name', email='$email' WHERE id=$id";
    mysqli_query($connection, $sql);
    header("Location: done.php?msg=udpated");
    exit;
}
$res = mysqli_query($connection, "SELECT * FROM users WHERE id = $id");
$user = mysqli_fetch_assoc($res);
?>

<!DOCTYPE html>
<html>
<body>
    <h2>Edit User</h2>
    <form method="POST">
        Name: <input type="text" name="name" value="<?php echo $user['name']; ?>"><br><br>
        Email: <input type="email" name="email" value="<?php echo $user['email']; ?>"><br><br>
        <button type="submit">Update User</button>
    </form>
    <a href="done.php">Cancel</a>
</body>
</html>

