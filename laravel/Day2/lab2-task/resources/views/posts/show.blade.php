<!DOCTYPE html>
<html>
<head>
    <title>Posts</title>
</head>
<body> 
    <h1> posts </h1>
    <ul>
            <li>Post ID: {{$post['id']}}</li>
            <li>Post Title: {{$post['title']}}</li>
            <li>Post Content: {{$post['content']}}</li>
            <li>Post Author: {{$post->author->name}}</li>
            <li>Created At: {{$post->created_at->format('l, F jS, Y  .. h:i:s A') }}</li>
    </ul>

</body>      
</html>
