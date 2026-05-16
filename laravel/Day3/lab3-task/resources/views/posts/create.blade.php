<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1> Create Post </h1>
    <form action="/posts" method="POST" enctype="multipart/form-data">
        <!-- @csrf inject token to protect from csrf attacks else 419 error-->
         @csrf
         @if ($errors->any())
            <div class="alert alert-danger">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        <label for="title">Title</label>
        <input type="text" name="title" id="title" > <!-- old func. to keep the value in case of validation error -->
        <br>
        <label for="content">Content</label>
        <input type="text" name="content" id="content">
        <br>
        <label for="author_id">Post Creator:</label>
        <select name="author_id" id="author_id" required>
            <option value="" disabled selected>Select an Author</option>
            @foreach($users as $user)
                <option value="{{ $user->id }}">{{ $user->name }}</option>
            @endforeach
        </select>
        <br>
        <label for="image">Upload Post Image:</label>
        <input type="file" name="image" id="image" accept="image/*">
        <br>
        <button type="submit">Create Post</button>
    </form>
</body>
</html>