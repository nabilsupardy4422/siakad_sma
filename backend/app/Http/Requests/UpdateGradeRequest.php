<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role?->name === 'Guru Mata Pelajaran';
    }

    public function rules(): array
    {
        return [
            'score' => [
                'required',
                'numeric',
            ],
        ];
    }
}