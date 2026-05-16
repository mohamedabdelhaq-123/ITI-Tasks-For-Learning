<!DOCTYPE html>
<html>
<head>
    <title>Posts</title>
</head>
<body> 
    <h1> posts </h1>
    <form action="/posts/restore" method="POST">
        @csrf
        <button type="submit">Restore All Deleted Posts</button>
    </form>

    <ul>
        @foreach ($posts as $post)
            <li>--------------------------</li>
            <li>Post Title: {{$post['title']}}</li>
            <a href="{{ route('posts.show', [$post, $post->slug]) }}">View Post</a>
            <a href="/posts/{{$post->slug}}/edit">Edit</a>
                <form action="/posts/{{$post->slug}}" method="POST" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this post?');">
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
