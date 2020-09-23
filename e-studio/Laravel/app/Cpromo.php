<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cpromo extends Model
{
    //

     /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'cpromos';

    public function studio()
    {
        return $this->belongsTo('App\Studio');
    }
}
