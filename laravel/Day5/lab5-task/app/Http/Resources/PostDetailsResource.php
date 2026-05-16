<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostDetailsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            'title'=> strtoupper($this->title) ,
            'content'=>$this->content,
            "created_at"=> $this->created_at,
            "updated_at"=> $this->updated_at,
            'image'=> $this->image ? asset('storage/'.$this->image) : null
        ];
    }
}
