<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Studio extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'studios';

    public function user()
    {
        return $this->belongsTo('App\User');
    }
    public function images()
    {
        return $this->hasMany('App\Image');
    }

    public function avis()
    {
        return $this->hasMany('App\Avis')->orderBy('created_at','desc');
    }

    // public function users()
    // {
    //     return $this->hasMany('App\User','id','user_id');

    // }
    public function services()
    {
        return $this->hasMany('App\Service');
    }
    public function reservations()
    {
        return $this->hasMany('App\Reservation')->orderBy('day','asc')->orderBy('start','asc');
    }
    public function jours_off()
    {
        return $this->hasMany('App\Jours_off');
    }
}
