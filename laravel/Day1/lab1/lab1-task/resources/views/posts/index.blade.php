<!DOCTYPE html>
<html>
<head>
    <title>Posts</title>
</head>
<body> 
    <h1> posts </h1>
    <ul>
        @foreach ($posts as $post)
            <li>--------------------------</li>
            <li>Post Title: {{$post['title']}}</li>
            <a href="/posts/{{$post['id']}}">View Post</a>
            <a href="/posts/{{$post['id']}}/edit">Edit</a>
        @endforeach
    </ul>

</body>      
</html>
