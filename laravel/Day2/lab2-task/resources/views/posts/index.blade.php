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
                <form action="/posts/{{$post['id']}}" method="POST" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this post?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit">Delete</button>
                </form>
        @endforeach
    </ul>

    <div class="pagination-wrapper">
    {{ $posts->links() }}
</div>
</body>      
</html>
