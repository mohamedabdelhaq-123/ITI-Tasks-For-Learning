<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1> Edit Post </h1>
    <form action="/posts/{{$id}}" method="POST">
         @csrf
         @method('PUT') <!-- put instead of post (default) -->
        <label for="title">Title</label>
        <input type="text" name="title" id="title">
        <br>
        <label for="content">Content</label>
        <input type="text" name="content" id="content">
        <br>
        <button type="submit">Update Post</button>
    </form>
    
</body>
</html>