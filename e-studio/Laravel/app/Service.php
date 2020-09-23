<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    //

    public function studio()
    {
        return $this->belongsTo('App\Studio');
    }
}

