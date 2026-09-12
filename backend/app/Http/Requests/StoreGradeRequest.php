<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role?->name === 'Guru Mata Pelajaran';
    }

    public function rules(): array
    {
        return [
            'grades' => [
                'required',
                'array',
                'min:1',
            ],

            'grades.*.student_id' => [
                'required',
                'integer',
                'distinct',
                'exists:students,id',
            ],

            'grades.*.score' => [
                'required',
                'numeric',
            ],
        ];
    }
}