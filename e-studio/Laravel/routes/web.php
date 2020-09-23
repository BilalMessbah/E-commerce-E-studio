<?php

use App\Http\Controllers\StudioController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return response()->json(['name' => 'Abigail', 'state' => 'CA']);
// });

Route::get('/','StudioController@index');

// ****************---studio

Route::post('/studio/create', 'StudioController@store');
Route::get('/studio', 'StudioController@index');
Route::post('/remove_image', 'StudioController@remove_image');
Route::post('/add_images', 'StudioController@add_images');
Route::post('/update_studio', 'StudioController@update');
Route::get('/get_studio/{index}/{nb_studio}', 'StudioController@get_studio');
Route::get('/show_studio/{id}', 'StudioController@show');
Route::post('/visit_studio', 'StudioController@visite');
Route::get('/popular', 'StudioController@popularite');
Route::get('/studio/note','StudioController@note');
Route::get('/hasstudio','StudioController@has_studio');


Route::post('/search','StudioController@search_ville');


Route::get('/delete_studio/{id}','StudioController@delete');
Route::post('/autocomplete','StudioController@autocomplete');

Route::post('/autocomplete_search','StudioController@autocomplete_search');

// ****************---jour_off
Route::post('/jours_off',"JoursOffController@store");

// ****************---user
Route::post('/create_account',"UserController@store");
Route::post('/login',"UserController@login");
Route::get('/test',"UserController@test");
Route::get('/me',"UserController@me");

Route::get('/show',"UserController@show");
Route::post('/update_user',"UserController@update");
Route::post('/autocomplete_user','UserController@autocomplete');
Route::get('/validate_account/{token}',"UserController@validate_account");

Route::post('/create_account_facebook',"UserController@facebook_store");

// ****************---reservation
Route::post('/reservation/create',"ReservationController@store");
Route::post('/reservation/get',"ReservationController@get_day");
Route::get('/user/reservation',"ReservationController@get_user_reservation");
Route::get('/studio/reservation/{id}',"ReservationController@get_studio_reservation");
Route::post('/reservation/payment/done',"ReservationController@payment_done");



// ******************----admin user


Route::get('/show_user',"UserController@show");

Route::get('/deactivated_user',"UserController@deactivated");
Route::get('/reactivated_user',"UserController@reactivated");
Route::get('/get_user/{index}/{nb_studio}',"UserController@show_users");
Route::get('/validate_account/{token}',"UserController@validate_account");


// ****************-----Avis

Route::post('/avis/create','AvisController@store');


Route::get('get_all_notes','AvisController@get_all_notes');

// ******************----- promo

Route::post('/promo','CpromoController@index');
Route::post('/Cpromo','CpromoController@store');

Route::post('/promo/check','CpromoController@check');

Route::post('/promo/store','CpromoController@store');

Route::get('/promo/ajd','CpromoController@get_cpromo_ajd');

// ******************----- checkout

Route::post('/stripe/checkout','CheckoutController@index');


// ******************----- factures

Route::get('/factures','FactureController@show');
