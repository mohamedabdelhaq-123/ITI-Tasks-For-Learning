<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;
use Illuminate\Support\Str;


class ImageValidator implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $arr=['png','jpg','jpeg'];
        // if(!Str::endsWith(strtolower($value), $arr)){

        if ($value!==null && !in_array(strtolower($value->getClientOriginalExtension()), $arr) ) {
            $fail("Enter valid image with extensions png/jpg/jpeg");
        }
    }
}

// or: 'image' => ['required', 'file', 'mimes:png,jpg,jpeg', 'max:2048'],

