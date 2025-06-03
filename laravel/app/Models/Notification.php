<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'leave_id',
        'type',
        'title',
        'message',
        'read'
    ];

    protected $casts = [
        'read' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function leave(): BelongsTo
    {
        return $this->belongsTo(Leave::class);
    }
}
