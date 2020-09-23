<?php

namespace App;


use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function studios()
    {
        return $this->hasMany('App\Studio')->with('images');
    }

    public function used_cpromos()
    {
        return $this->hasMany('App\UsedPromo');
    }
    public function reservations()
    {
        return $this->hasMany('App\Reservation');
    }
    public function factures()
    {
        return $this->hasMany('App\Facture');
    }
}
