<?php
/**
 * Notification Model
 */

class Notification extends Model {
    protected $table = 'notifications';
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'read_at'
    ];
}
