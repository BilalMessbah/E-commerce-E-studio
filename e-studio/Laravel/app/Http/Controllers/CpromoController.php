<?php

namespace App\Http\Controllers;

use App\Cpromo;
use App\Studio;
use App\User;
use App\UsedPromo;
use Illuminate\Http\Request;

class CpromoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //

        // return response()->json(['test'=> 'here']);

        $promo = Cpromo::where('studio_id',1)->get();
        return response()->json(['test'=>$promo]);
        // error_log($promo);

        // $studio = Studio::find(2);

        // return $studio;
    }


    public function get_cpromo_ajd(){
        $ajd = date('Y-m-d');
        // error_log($ajd);
        // $ajd = "2020-08-10";
        $res = Cpromo::where([
            ['debut','<',$ajd],
            ['fin','>',$ajd]
            ])
            ->orWhere('isSaisonnier',false)
            // ->orderBy('created_at','asc')
            ->get();
        // error_log(print_r($res,TRUE));
        if(count($res) > 0){
            return response()->json($res);
        } else {
            return response()->json(['error' => 'no promo code today'],400);
        }
    }



    public function check(Request $request)
    {
        // \error_log($request);
        $codePromo = $request->promo;
        // \error_log($codePromo);
        
        $promo = Cpromo::where('code',$codePromo)->get();

        if (count($promo) ==1) {

            // CHECK IF THE PROMO CODE IS BY SEASON
            if ($promo[0]->isSaisonnier){

                $paymentDate = date('Y-m-d');
                $paymentDate=date('Y-m-d', strtotime($paymentDate));
                //echo $paymentDate; // echos today! 
                $contractDateBegin = date('Y-m-d', strtotime($promo[0]->debut));
                $contractDateEnd = date('Y-m-d', strtotime($promo[0]->fin));

                $token = $request->header('token');
                if (($paymentDate >= $contractDateBegin) && ($paymentDate <= $contractDateEnd)){
                    error_log("is between");

                    if (($user = UserController::get_user(["token", $token]))[0] == false){
                    // return response()->json([ 'error' => $user[1]]);
                        error_log('not connected');
                    }
                    else{
                        error_log('connected');
                        $user = User::find($user[1]->id);

                        $usedPromo = UsedPromo::where([
                            ['user_id',$user->id],
                            ['code',$promo[0]->code]
                            ])->get();

                        // return response()->json($usedPromo);

                        if (count($usedPromo) > 0) {
                            return response()->json(['res'=>'code promo deja utilise'],400);
                        }else {
                            return response()->json(['cpromo'=>$promo],200);
                        }
                        
                    }

                }else{
                    error_log("NOT IN BETWEEN!");
                    return response()->json(['res'=>'ce code n\'est pas valide pour le moment'],400);
                }

            }else{
                error_log('is not saisonnier');

                //CHECK IF USER IS CONNETED
                $token = $request->header('token');
                if (($user = UserController::get_user(["token", $token]))[0] == false){
                    // return response()->json([ 'error' => $user[1]]);
                        error_log('not connected');
                    }
                    else{
                        error_log('connected');
                        $user = User::find($user[1]->id);
                    // CHECK IF THIS PROMO CODE WAS NOT ALREADY USED BY THE PERSON
                        $usedPromo = UsedPromo::where([
                            ['user_id',$user->id],
                            ['code',$promo[0]->code]
                            ])->get();

                        // return response()->json($usedPromo);

                        if (count($usedPromo) > 0) {
                            return response()->json(['res'=>'code promo deja utilise'],400);
                        }else {
                            return response()->json(['cpromo'=>$promo],200);
                        }
                        
                    }
            }

           return response()->json(['cpromo'=>$promo]);

        }else{
            // \error_log('boo');
            // return("invalid code");
            return response()->json(['res'=>"code promo invalide"],400);
        }
        // \error_log($promo);

        

        // return response()->json(['t'=>$promo]);


    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $token = $request->header('token');
        if (($user = UserController::get_user(["token", $token]))[0] == false){
                error_log('not connected');
            }
            else{
                error_log($user[1]->role);
                error_log('connected');
                if ($user[1]->role != 'admin') {
                    error_log('not a an admin');
                }else{
                    $cp = new Cpromo;
                    $cp->code = $request->code;
                    $cp->pourcentage = $request->pourcentage;
                    $cp->value = $request->value;
                    $cp->debut = $request->debut;
                    $cp->fin = $request->fin;
                    $cp->isSaisonnier = $request->isSaisonnier;
                    $cp->save();
                    return response()->json([ 'succes' =>  "code created" ]);
                }
            }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Cpromo  $cpromo
     * @return \Illuminate\Http\Response
     */
    public function show(Cpromo $cpromo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Cpromo  $cpromo
     * @return \Illuminate\Http\Response
     */
    public function edit(Cpromo $cpromo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Cpromo  $cpromo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Cpromo $cpromo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Cpromo  $cpromo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Cpromo $cpromo)
    {
        //
    }
}
