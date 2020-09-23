<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        '/jours_off',
        '/studio/create',
        '/login',
        '/create_account',
        "/get_studio/{index}/{nb_studio}",
        '/reservation/create',
        '/reservation/get',
        '/visit_studio',
        '/remove_image',
        'update_studio',
        '/avis/create',
        '/promo',
        '/promo/check',
        '/promo/store',
        '/stripe/checkout',
        '/user/reservation',
        '/reservation/payment/done',

        '/update_user',
        '/show',
        '/deactivated_user',
        '/reactivated_user',
        '/delete_studio',
        '/autocomplete',
        '/Cpromo',
        '/autocomplete_user',
        '/create_account_facebook',
        '/search',
        '/autocomplete_search',
    ];
}
