<!DOCTYPE html>
<html>
<head>
    <title>{{ $post->title }}</title>
</head>
<body>
    <h1>posts</h1>
    <ul>
        <li>Post ID: {{$post['id']}}</li>
        <li>Post Title: {{$post['title']}}</li>
        <li>Post Content: {{$post['content']}}</li>
        <li>Post Author: {{$post->author->name}}</li>
        <li>Created At: {{$post->created_at->format('l, F jS, Y  .. h:i:s A') }}</li>
        @if($post->image)
        <li>Post Image: </li>
        <img src="{{ asset('storage/' . $post->image) }}" style="max-width: 200px;">
        @endif
    </ul>

    @php $liked = $post->likes()->where('user_id', auth()->id())->exists(); @endphp
    <form action="{{ route('posts.like', $post) }}" method="POST" style="display:inline;">
        @csrf
        <button type="submit" style="cursor:pointer; padding:6px 14px; background:{{ $liked ? '#e74c3c' : '#3498db' }}; color:#fff; border:none; border-radius:4px;">
            {{ $liked ? 'Unlike' : 'Like' }} ({{ $post->likes()->count() }})
        </button>
    </form>

    <hr>
    <h3>Comments ({{ $post->comments()->count() }})</h3>

    <form action="{{ route('posts.comments.store', $post) }}" method="POST" style="margin-bottom:16px;">
        @csrf
        <textarea name="body" rows="3" placeholder="Write a comment..." style="width:100%; padding:8px; box-sizing:border-box;" required></textarea>
        @error('body') <p style="color:red;">{{ $message }}</p> @enderror
        <button type="submit" style="margin-top:6px; padding:6px 14px; background:#2ecc71; color:#fff; border:none; border-radius:4px; cursor:pointer;">Post Comment</button>
    </form>

    @foreach($post->comments()->with('user')->latest()->get() as $comment)
        <div style="border:1px solid #ccc; padding:10px; margin-bottom:8px; border-radius:4px;">
            <strong>{{ $comment->user->name }}</strong>
            <span style="color:#999; font-size:0.85em;"> &mdash; {{ $comment->created_at->diffForHumans() }}</span>
            <p style="margin:6px 0 0;">{{ $comment->body }}</p>
        </div>
    @endforeach

</body>
</html>
