<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Registration Form</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        .form-group { margin-bottom: 15px; display: flex; }
        label { width: 120px; font-weight: bold; }
        input[type="text"], input[type="password"], textarea, select { width: 300px; }
        .checkbox-group, .radio-group { display: inline-block; }
    </style>
</head>
<body>

    <h2>User Registration</h2>
    <form action="done.php" method="POST" enctype='multipart/form-data'>
        
        <div class="form-group">
            <label>Name</label>
            <input type="text" name="name">
        </div>

        <div class="form-group">
            <label>Email</label>
            <input type="email" name="email">
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password">
        </div>

        <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirm_password">
        </div>

        <div class="form-group">
            <label>Room Number</label>
            <select name="room_number">
                <option value="">Select Room</option>
                <option value="Application1">Application1</option>
                <option value="Application2">Application2</option>
                <option value="Cloud">Cloud</option>
            </select>
        </div>


        <div class="form-group">
            <label>Profile Picture</label>
            <input type="file" name="profile_picture" accept="image/*">
        </div>


        <div class="form-group">
            <label></label>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </div>

    </form>

</body>
</html>
