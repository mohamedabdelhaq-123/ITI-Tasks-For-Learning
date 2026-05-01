<?php
if ($_POST['captcha_input'] != "Ch68Sc") {
    echo "<h1>Invalid Captcha</h1>";
    exit;
}


$gender  = $_POST['gender'] ?? '';
if ($gender == "male") {
echo "<h1>Thanks " . "Mr." . " " . $_POST['first_name'] . " " . $_POST['last_name'] . "</h1>";
} elseif ($gender == "female") {
echo "<h1>Thanks " . "Miss" . " " . $_POST['first_name'] . " " . $_POST['last_name'] . "</h1>";
}

echo "<p>Please Review Your Information:</p>";

echo "<div><strong>Name:</strong>" . $_POST['first_name'] . " " . $_POST['last_name'] . "</div>";

echo "<div><strong>Address:</strong> " . $_POST['address'] . "</div>";

echo "<div><strong>Your Skills:</strong> ";
if (!empty($_POST['skills'])) {
    echo implode(", ", $_POST['skills']);
} else {
    echo "No skills selected";
}
echo "</div>";

echo "<div><strong>Department:</strong>" . $_POST['department'] . "</div>";

?>


<!-- var_dump($_POST); more data -->
 <!-- print ret 1  -->

 <!-- dd ret val. + break;/exit; -->

 <!-- html forms get/post only , decorator to solve issue  -->
  