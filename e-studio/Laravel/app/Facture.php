<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'factures';

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
