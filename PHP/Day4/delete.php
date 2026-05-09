<?php
$id = $_GET['id'];
$connection = mysqli_connect("localhost", "iti_user", "123456", "hotel");
$sql = "DELETE FROM users WHERE id = $id";
mysqli_query($connection, $sql);
header("Location: done.php?msg=del");
exit;
?>
