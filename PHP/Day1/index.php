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
    <form action="done.php" method="POST">
        
        <div class="form-group">
            <label>First Name</label>
            <input type="text" name="first_name">
        </div>

        <div class="form-group">
            <label>Last Name</label>
            <input type="text" name="last_name">
        </div>

        <div class="form-group">
            <label>Address</label>
            <textarea name="address" rows="4"></textarea>
        </div>

        <div class="form-group">
            <label>Country</label>
            <select name="country">
                <option value="">Select Country</option>
                <option value="egypt">Egypt</option>
                <option value="usa">USA</option>
            </select>
        </div>

        <div class="form-group">
            <label>Gender</label>
            <input type="radio" name="gender" value="male"> Male
            <input type="radio" name="gender" value="female"> Female
        </div>

        <div class="form-group">
            <label>Skills</label>
            <input type="checkbox" name="skills[]" value="php"> PHP
            <input type="checkbox" name="skills[]" value="j2se"> J2SE <br>
            <input type="checkbox" name="skills[]" value="mysql"> MySQL
            <input type="checkbox" name="skills[]" value="postgresql"> PostgreSQL
        </div>

        <div class="form-group">
            <label>Username</label>
            <input type="text" name="username">
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password">
        </div>

        <div class="form-group">
            <label>Department</label>
            <input type="text" name="department" value="OpenSource" readonly>
        </div>

        <div class="form-group">
            <label>Captcha</label>
            <div>
                <p style="margin:0; color: gray;">mossee45c</p>
                <input type="text" name="captcha_input">
                <small>Please insert the code in the box below</small>
            </div>
        </div>

        <div class="form-group">
            <label></label>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </div>

    </form>

</body>
</html>
