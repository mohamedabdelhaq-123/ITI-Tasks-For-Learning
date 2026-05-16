<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Rules\FirstLetterUppercase;
use App\Rules\ImageValidator;
use Illuminate\Foundation\Http\Attributes\StopOnFirstFailure;


// #[StopOnFirstFailure] // stop validating all attrib. once 1 valid. failed
class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // to allow the form submissions else 403 unauth error
    }// can handle permission before validation (logged in user / admin ...)

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'=>['required','string','min:3','unique:posts,title', new FirstLetterUppercase],
            'content'=>['required','string','min:10'],
            'author_id'=>['required','integer','exists:users,id'],
            'image'=>['nullable', 'file',new ImageValidator]
        ];
    }
}



