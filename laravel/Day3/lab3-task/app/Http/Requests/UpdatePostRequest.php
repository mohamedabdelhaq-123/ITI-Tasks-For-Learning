<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\ImageValidator;


class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $post= $this->route('post'); // grab post from req.
        return [
            'title' => ['required', 'string', 'min:3', Rule::unique('posts', 'title')->ignore($post->id)],
            'content' => ['required', 'string', 'min:10'],
            'author_id' => ['required', 'integer', 'exists:users,id'],
            'image'=>['nullable', 'file',new ImageValidator]
        ];
    }
}


// route to store 
// laravel intercepts req before store runs
// make instance storepostrequest
// (if need to extract sth from route)
// run auth & rules
