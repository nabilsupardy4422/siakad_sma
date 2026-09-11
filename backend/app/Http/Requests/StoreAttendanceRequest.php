<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role?->name === 'Guru Mata Pelajaran';
    }

    public function rules(): array
    {
        return [
            'date' => [
                'required',
                'date_format:Y-m-d',
            ],

            'attendances' => [
                'required',
                'array',
                'min:1',
            ],

            'attendances.*.student_id' => [
                'required',
                'integer',
                'distinct',
                'exists:students,id',
            ],

            'attendances.*.status' => [
                'required',
                'string',
                'in:hadir,izin,sakit,alpa',
            ],
        ];
    }
}