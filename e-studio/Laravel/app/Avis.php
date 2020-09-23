<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    //

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'avis';


    public function user(){
        return $this->belongsTo('App\user');
    }
}
