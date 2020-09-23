<?php

namespace App\Http\Controllers;

use App\Jours_off;
use App\Studio;
use Illuminate\Http\Request;

class JoursOffController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        // return response()->json([ 'test' => "hello"]);

        $token = $request->header('token');
        if (($user = UserController::get_user(["token", $token]))[0] == false)
            return response()->json([ 'error' => $user[1]]);

        $jours_off = new Jours_off();
        // $user[1]->studios;
        // return response()->json(['test' => $user]);


        foreach ($user[1]->studios as $key => $studio) {
            
            if ($studio->id == $request->studio_id)
            {
                
                $jours_off->studio_id = $request->studio_id;
                $jours_off->jours = $request->jours;
                $jours_off->debut = $request->debut ?? '00:00:00';
                $jours_off->fin = $request->fin ?? '00:00:00';

                $jours_off->save();
                return response()->json([ 'succes' => "date added"]);

            }
        }
     
        

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Jours_off  $jours_off
     * @return \Illuminate\Http\Response
     */
    public function show(Jours_off $jours_off)
    {
        // $studio = Jours_off::find($jours_off);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Jours_off  $jours_off
     * @return \Illuminate\Http\Response
     */
    public function edit(Jours_off $jours_off)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Jours_off  $jours_off
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Jours_off $jours_off)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Jours_off  $jours_off
     * @return \Illuminate\Http\Response
     */
    public function destroy(Jours_off $jours_off)
    {
        //
    }
}
