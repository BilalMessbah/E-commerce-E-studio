<?php

namespace App\Http\Controllers;

use App\Avis;
use App\User;
use App\Studio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AvisController extends Controller
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
        //have to get studio_id & user_id ?
        $validator = Validator::make($request->all(), [
            'note' => 'required|numeric|min:0|max:5',
            'commentaire' => 'required|min:1',
        ]);
        if ($validator->fails()) {
            return response()->json([ 'error' => $validator->errors()->first()]);
        }
        $token = $request->header('token');
        if (($user = UserController::get_user(["token", $token]))[0] == false)
            return response()->json([ 'error' => $user[1]]);

        $avis = new Avis();
        $avis->user_id     = $user[1]->id;
        $avis->studio_id   = $request->studio_id;
        $avis->note        = $request->note;
        $avis->commentaire = $request->commentaire;
        $avis->save();
        // calcule of note average//
        $this->note_average($request->studio_id);
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Avis  $avis
     * @return \Illuminate\Http\Response
     */
    public function show(Avis $avis)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Avis  $avis
     * @return \Illuminate\Http\Response
     */
    public function edit(Avis $avis)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Avis  $avis
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Avis $avis)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Avis  $avis
     * @return \Illuminate\Http\Response
     */
    public function destroy(Avis $avis)
    {
        //
    }
    public function note_average($studio_id)
    {
        //collect all notes for the studio//
        $studio     = Avis::where('studio_id', $studio_id)->get('note');
        $studioNts  = [];

        foreach ($studio as $obj) {
            array_push($studioNts, $obj->note);
        }

        // calcule of note average//
        $nbrNotes   = sizeof($studioNts);
        $somme      = 0;
        foreach ($studioNts as $Val)
        {
            $somme += $Val;
        }
        $moyenne = ($somme > 0 ? $somme/$nbrNotes : 0);

        //set note_generale of the current studio//
        $studio = Studio::find($studio_id);
        $studio->note_generale = $moyenne;
        $studio->save();
    }
}


//  {
//      "user_id": "1",
//      "studio_id": "2",
//      "note":"3",
//      "commentaire": "nice studio"

//  }
