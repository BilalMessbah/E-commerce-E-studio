<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'reservations';

    public function user()
    {
        return $this->belongsTo('App\User');
    }
    public function studio()
    {
        return $this->belongsTo('App\Studio');
    }
}
