<?php

namespace App\Http\Controllers;

use App\Studio;
use App\Reservation;
use App\Image;
use \App\User;
use App\UsedPromo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Facture;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $all = Reservation::all();


        return response()->json([ 'studios' => $all ], 200);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_user_reservation(Request $request)
    {
        if (($user = UserController::get_user(["token", $request->header('token')]))[0] == false)
            return response()->json([ 'error' => $user[1]]);
        $reservation = User::with('reservations')->find($user[1]->id);
        $reservations = $reservation->reservations;

        foreach($reservations as $reservation ){
            $studio = Studio::find($reservation->studio_id);
            $reservation['studio_name'] = $studio->name;
            // $reservation['prix'] = $studio->prix;
        }

        return response()->json($reservations);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_studio_reservation(Request $request,$id)
    {
        if (($user = UserController::get_user(["token", $request->header('token')]))[0] == false)
            return response()->json([ 'error' => $user[1]]);
        if($reservation = Studio::with('reservations')->find($id)){;
            if($user[1]->id == $reservation->user_id){
                $reservations = $reservation->reservations;

                foreach($reservations as $reservation ){
                    $user = User::find($reservation->user_id);
                    $reservation['user_name'] = $user->nom;
                    $reservation['user_firstname'] = $user->prenom;
                    // $reservation['prix'] = $studio->prix;
                }

                return response()->json($reservations);
            } else {
                return response()->json(['error' => "Ce studio ne vous appartient pas"],400);
            }
        } else {
            return response()->json(['error' => "Ce studio n'existe pas"],400);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($rqt)
    {
        error_log('ko');
        // if (($user = UserController::get_user(["token", $request->header('token')]))[0] == false)
        //     return response()->json([ 'error' => $user[1]]);

        $user[1]=$rqt['user'];

        // error_log(print_r($rqt,true));

        $request = new Request([
            'start' => $rqt['start'],
            'finish' => $rqt['finish'],
            'day' => $rqt['day'],
            'studio_id' => $rqt['studio_id'],
        ]);

        error_log(print_r($request->all(),true));

        $validator = Validator::make($request->all(), [
            'start' => 'required|date_format:H:i',
            'finish' => 'required|date_format:H:i|after:start',
            'day' => 'required|date|date_format:Y-m-d|after:yesterday',
            'studio_id' => 'required',
        ]);

        if ($validator->fails()) {
            //return  response()->json(["test" => $request->all()]);
            return response()->json([ 'error' => $validator->errors()->first()]);
        }
        else
        {
            $studio = Studio::with('reservations')->with('jours_off')->find($request->studio_id);
            $debut = $studio->opening;
            $fin = $studio->closing;

            $jours_off = $studio->jours_off;
            foreach($jours_off as $value){
                if($value->jours == $request->day){
                    return response()->json([ 'error' => 'this day is off'],400);
                }
            }

            if(strtotime($request->start)>=strtotime($debut) && strtotime($request->finish)<=strtotime($fin)){
                $reservations = $studio->reservations;

                foreach($reservations as $reservation){
                    if($reservation->day == $request->day){

                        $start = strtotime($reservation->start);
                        $finish = strtotime($reservation->finish);
                        $rdvstart = strtotime($request->start);
                        $rdvfinish = strtotime($request->finish);

                        if (($rdvstart == $start) || ($rdvfinish == $finish) ){
                            return response()->json([ 'error' => 'un rendez vous est deja pris'],400);
                        } else {
                            $s = substr($request->start,0,2);
                            $f = substr($request->finish,0,2);
                            while( $s != $f){
                                $t = strtotime(($s.':00'));
                                if($t == $start){
                                    return response()->json([ 'error' => 'un rendez vous est deja pris'],400);
                                } else {
                                    $s++;
                                }
                            }
                        }
                    }
                }
                $rdv = [];
                $s = substr($request->start,0,2);
                $f = substr($request->finish,0,2);
                while( $s != $f){
                    $rdv[] = [($s.':00:00'),(($s+1).':00:00')];
                    $s++;
                }
                foreach($rdv as $value){
                    $res = new Reservation();
                    $res->day = $request->day;
                    $res->start = $value[0];
                    $res->finish = $value[1];
                    $res->studio_id = $request->studio_id;
                    $res->user_id = $user[1]->id;
                    $res->price = $rqt['prix'];
                    $res->option_price = $rqt['prixservices'];
                    $res->services = json_encode($rqt['services']);
                    $res->save();
                }
                return response()->json([ 'succes' => $rdv],200);

            } else {
                return response()->json([ 'succes' => 'not opened at this time'],400);
            }

            // return response()->json([ 'succes' => $studio],200);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function payment_done(Request $request)
    {

        if (($user = UserController::get_user(["token", $request->header('token')]))[0] == false){
            return response()->json([ 'error' => $user[1]]);
        }else{

            error_log(print_r($request->all(),true));

           $products = $request->products;

           $price = $request->vraiTotal;

           $cpromo = $request->cpromo['goodCpromo'];
        
           $test = [];

           foreach ($products as $key => $product) {
               
                $array = [];

                $array['start'] = $product['hours'][0];

                $array['finish'] = $product['hours'][1];

                $array['day'] = $product['datestock'];

                $array['prix'] = $product['prix'];

                $array['studio_id'] = $product['studioid'];

                $array['services'] = $product['service'];

                $array['prixservices'] = $product['prixservices'];

                $array['user'] = $user[1];

                error_log('here');
                
                $this->store($array);

                $test[]= $array;
           }

           if ($cpromo !='') {
            error_log($user[1]->email);

            $usedPromo = new UsedPromo();
 
            $usedPromo->user_id= $user[1]->id;
            
            $usedPromo->email= $user[1]->email;
 
            $usedPromo->code= $cpromo;
 
            $usedPromo->save();

           }
           
           $facture = new Facture();
           $facture->user_id = $user[1]->id;
           $facture->cart = json_encode($products);
           error_log(print_r($price,TRUE));
           $facture->total = $price['total'];
           $facture->save();

        //    return response()->json($test);

        //    error_log(print_r($test,true));



        //    error_log($products[0]['name']);


            error_log($products[0]['name']);


           return response()->json([$request->products]);

        }

    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Studio  $studio
     * @return \Illuminate\Http\Response
     */
    public function get_day(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'day' => 'required|date|date_format:Y-m-d|after:yesterday',
            'studio_id' => 'required',
        ]);

        if ($validator->fails()) {
            //return  response()->json(["test" => $request->all()]);
            return response()->json([ 'error' => $validator->errors()->first()]);
        }
        else
        {
            $studio = Studio::with('reservations')->with('jours_off')->findOrFail($request->studio_id);
            $reservations = $studio->reservations;
            $jours_off = $studio->jours_off;
            $rdv = [];
            foreach($jours_off as $value){
                if($value->jours == $request->day){
                    return response()->json([ 'error' => 'this day is off'],400);
                }
            }
            foreach($reservations as $reservation){
                if($reservation->day == $request->day){
                    error_log($reservation->day);
                    $rdv[] = [$reservation->start,$reservation->finish];
                }
            }
            return response()->json([ 'succes' => $rdv],200);
        }



    }


}
