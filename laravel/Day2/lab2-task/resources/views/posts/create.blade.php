<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1> Create Post </h1>
    <form action="/posts" method="POST">
        <!-- @csrf inject token to protect from csrf attacks else 419 error-->
         @csrf
        <label for="title">Title</label>
        <input type="text" name="title" id="title">
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
        <button type="submit">Create Post</button>
    </form>
</body>
</html>