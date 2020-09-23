<?php

namespace App\Http\Middleware;

use Closure;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        return $next($request)
          ->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        //   ->header('Access-Control-Allow-Headers', 'Accept, Authorization,Content-Type, token')
          ->header('Access-Control-Allow-Headers', 'Accept, Authorization,Content-Type, token, orderBy, search_by_price, select_value, id, id_studio');
        //   ->header('Access-Control-Allow-Headers', 'Accept, Authorization,Content-Type, search_by_price');

    }
}
