<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'start_time', 'end_time', 'reason', 'description', 'status', 'rejection_reason'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}