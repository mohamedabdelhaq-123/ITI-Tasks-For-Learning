<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1> Edit Post </h1>
    <form action="/posts/{{$post->slug}}"  method="POST" enctype="multipart/form-data">
         @csrf
         @method('PUT') <!-- put instead of post (default) -->
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
        <input type="text" name="title" id="title" value="{{$post->title}}" > 
        <br>
        <label for="content">Content</label>
        <input type="text" name="content" id="content" value="{{$post->content}}" >
        <br>
        <label for="author_id">Post Creator:</label>
        <!-- <select name="author_id" id="author_id" required>
            <option value="" disabled selected>Select an Author</option>
            @foreach($users as $user)
                <option value="{{ $user->id }}">{{ $user->name }}</option>
            @endforeach
        </select> -->

        <select name="author_id" id="author_id" required>
            <option value="" disabled>Select an Author</option>
            @foreach($users as $user)
                <option value="{{ $user->id }}" @selected($user->id == $post->author_id)>
                    {{ $user->name }}
                </option>
            @endforeach
        </select>
        <br>
        <label for="image">Post Image:</label>
        <input type="file" name="image" id="image" value="{{$post->image}}" accept="image/*">
        <br>
        <button type="submit">Update Post</button>
    </form>
    
</body>
</html>