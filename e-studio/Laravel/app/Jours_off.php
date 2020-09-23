<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Jours_off extends Model
{
    //

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'jours_off';


    public function studio()
    {
        return $this->belongsTo('App\studio');
    }


}
