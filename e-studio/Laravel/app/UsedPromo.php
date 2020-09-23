<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UsedPromo extends Model
{
    //
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'used_cpromo';

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
