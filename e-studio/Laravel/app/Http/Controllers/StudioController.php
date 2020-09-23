<?php

namespace App\Http\Controllers;

use App\Studio;
use App\Image;
use App\User;
use App\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

// class StudioController extends Controller
class StudioController 

{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $studio = Studio::orderBy('visites','desc')->take(4)->with('images')->get();


        return response()->json([ 'studios' => $studio ], 200);
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
        // return response()->json([ 'error' =>"token : " . $request->header('token')]);
        $studio = new Studio();
        $token = $request->header('token');
        if (($user = UserController::get_user(["token", $token]))[0] == false)
        {

            return response()->json([ 'error' => $user[1]]);
        }

        $user[1]->role = "studio";
        $user[1]->save();
        $request['tva'] = filter_var($request['tva'], FILTER_VALIDATE_BOOLEAN);
        $request['inge_son'] = filter_var($request['inge_son'], FILTER_VALIDATE_BOOLEAN);
        $request['prix'] = intval($request['prix']);
        $request['siren'] = intval($request['siren']);
        $request['nbr_people'] = intval($request['nbr_people']);

        $validator = Validator::make($request->all(), [
            'name' => 'required|min:2|max:191',
            'description' => 'required|min:10|max:1000',
            'address' => 'required|min:2|max:191',
            'prix' => 'required|int',
            // 'nbr_people' => 'required|int',
            // 'siren' => 'required|int',
            // 'inge_son' => 'required | bool',
            // 'tva' => 'required | bool',
        ]);
        //return response()->json([ 'error' => $user[1]]);
        if ($validator->fails()) {
            //return  response()->json(["test" => $request->all()]);
            return response()->json([ 'error' => $validator->errors()->first()]);
        }
        else
        {
            $studio->name = $request->name;
            $studio->user_id = $user[1]->id;
            $studio->description = $request->description;
            $studio->address = $request->address;
            $studio->prix = $request->prix;
            $studio->nbr_people = $request->nbr_people;
            $studio->siren = "null";
            $studio->inge_son = 1;
            $studio->tva = 1;
            //return  response()->json(["test" => $request->all()]);
            $studio->save();
            $studio->id;

            $services = $request->services;
            if(isset($services)){
                $services = trim($services);
            
                $services = explode(",",$services);
                error_log(print_r($services,TRUE));
                foreach($services as $service){
                    $serv = new Service();
                    $serv->studio_id = $studio->id;
                    $serv->name = $service;
                    $serv->save();

                    error_log($service);
                }
            }
            
            
            //return  response()->json(["test" => $request->all()]);
            $count = 0;
            for($i = 1; $i <= 5; $i++){
                $currimg = "image$i";
                if($request->hasfile($currimg)){
                    // return  response()->json(["test" => $request->all()]);
                    $file = $request->file($currimg);
                    $extension = $file->getClientOriginalExtension();
                    //return  response()->json(["test" => $request->all()]);
                    if($extension == 'jpg' || $extension == 'png'){
                        // $id = DB::table('images')->insertGetId();
                        $lastimage = DB::table('images')->orderBy('id', 'desc')->limit(1)->get();
                        //return  response()->json(["test" => $request->all()]);
                        count($lastimage) > 0 ? $name = $lastimage[0]->id + 1 : $name = 1;
                        // return response()->json([ 'succes' => $name],200);

                        $filename =  $name . '.' . $extension;
                        $file->move('assets/images_studios/',$filename);
                        $image = new Image();
                        $image->url_image = url('/').'/assets/images_studios/'.$filename;
                        $image->studio_id = $studio->id;
                        //return  response()->json(["test" => $studio->id]);
                        $image->save();
                        $count++;
                    }
                    else {
                        return  response()->json(["test" => $studio->id]);
                    }
                }
                else {
                    return  response()->json(["test" => $studio->id]);
                }
            }
            return response()->json([ 'error' => $user[1]]);

            // foreach ($image->url_images as $key => $url_image) {
            //     $image = new Image();
            //     $image->url_image = $url_image;
            //     $image->studio_id =  $studio->id;
            //     $image->save();
            // }
            $studio->images;
            return response()->json([ 'studio' => $studio ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function visite(Request $request){

        //return  response()->json(["test" => $request->all()]);
        $studio_id = $request->id;

        $getVisitesNb= Studio::where('id',$studio_id)->get('visites');

        $currentVisitNb = $getVisitesNb[0]['visites'];

        $newVisitor = $currentVisitNb + 1;

        $studio = Studio::find($studio_id);

        $studio->visites = $newVisitor;

        $studio->save();

    }


    public function popularite()
    {
        $studio = Studio::orderBy('visites','desc')->take(4)->with('images')->get();
        return response()->json(['test'=> $studio]);

    }


    public function add_images(Request $request){

        if (($user = UserController::get_user(["token", $request->header('token')]))[0] == false)
            return response()->json([ 'error' => $user[1]]);

        $images = $request->images;
        $count = 0;
        foreach ($user[1]->studios as $key => $studio) {
            if ($studio->id == $request->studio_id){
                for($i = 1; $i <= 5; $i++){
                    $currimg = "image$i";

                    if($request->hasfile($currimg)){
                        $file = $request->file($currimg);
                        $extension = $file->getClientOriginalExtension();
                        if($extension == 'jpg' || $extension == 'png'){
                            // $id = DB::table('images')->insertGetId();
                            $lastimage = DB::table('images')->orderBy('id', 'desc')->limit(1)->get();
                            count($lastimage) > 0 ? $name = $lastimage[0]->id + 1 : $name = 1;
                            // return response()->json([ 'succes' => $name],200);

                            $filename =  $name . '.' . $extension;
                            $file->move('assets/images_studios/',$filename);
                            $image = new Image();
                            $image->url_image = url('/').'/assets/images_studios/'.$filename;
                            $image->studio_id = $studio->id;
                            $image->save();
                            $count++;
                        }
                    }
                }
                $studio = Studio::find($studio->id);
                $allurl = $studio->images()->get();
            } else {
                return response()->json([ 'error' => "no found studio"]);
            }
        }
        if($count == 0){
            return response()->json([ 'error' => 'no images inserted'],400);
        } else {
            return response()->json([ 'succes' => $count, 'url_images' => $allurl],200);
        }

    }

    public function remove_image(Request $request)
    {
        $token = $request->header('token');

        if (($user = UserController::get_user(["token", $token]))[0] == false)
            return response()->json([ 'error' => $user[1]]);

            if ($user[1]->role == "admin")
            {
                if (count(($image = image::where("id", '=', $request->id_image)->get())) == 1)
                {
                    $image[0]->delete();
                    return response()->json([ 'succes' =>  "delete image" ]);
                }
                else
                    return response()->json([ 'error' =>  "image no found" ]);
            }

        $user[1]->studios;
        foreach ($user[1]->studios as $key => $studio) {
          foreach ($studio->images as $key => $image) {
                if ($image->id == $request->id_image)
                {
                    $image->delete();
                    return response()->json([ 'succes' =>  "delete image " ]);
                }
          }
        }
        return response()->json([ 'succes' =>  $user[1]]);
    }
    public  function delete(Request $request, $id)
    {
        $token = $request->header('token');

        if (($user = UserController::get_user(["token", $token]))[0] == false)
            return response()->json([ 'error' => $user[1]]);

        if ($user[1]->role == "admin")
        {
            if (count(($Studio = Studio::where("id", '=', $id)->get())) == 1)
            {
                $Studio[0]->delete();
                return response()->json([ 'succes' =>  "delete studio" ]);
            }
            else
                return response()->json([ 'error' =>  "studio no found" ]);
        }
        $user[1]->studios;
        foreach ($user[1]->studios as $key => $studio){
            if ($studio->id == $id)
            {
                $studio->delete();
                return response()->json([ 'succes' =>  "delete studio" ]);
            }
        }
        return response()->json(['error' =>  "studio no found" ]);
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Studio  $studio
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if ($Studio = Studio::with('images')->with('avis')->with('services')->with('avis')->find($id))
        {
            error_log($Studio->user_id);
            error_log(print_r($Studio->avis,TRUE));
            if(count($Studio->avis) > 0){
                foreach($Studio->avis as $avis){
                    $avis['user'] = User::find($avis->user_id)->get(['nom','prenom']);
                }
            }
            $Studio['user'] = User::find($Studio->user_id)->get(['nom','prenom']);
            // $Studio['user'] = User::find()->get('name','prenom');
            $Studio['jours_off'] = $Studio->jours_off()->get('jours');
            return response()->json(["succes" => $Studio]);
        }
        else
            return response()->json(["error" => "Studio not found"],400);
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Studio  $studio
     * @return \Illuminate\Http\Response
     */
    public function has_studio(Request $request)
    {
        $token = $request->header('token');
        if (($user = UserController::get_user(["token", $token]))[0] == false)
            return response()->json([ 'error' => $user[1]]);
        
        $user = User::with('studios')->find($user[1]->id);

        if(count($user->studios) > 0){
            // foreach($user->studios as $studio){
            //     $studio['images'] = Studio::with('images')->find($studio->id);
            // }
            return response()->json(['succes'=> true, 'studios'=> $user->studios]);
        } else {
            return response()->json(['succes'=> false]);
        }
    }

    public function autocomplete(request $request)
    {
     return response()->json([ 'studios' => Studio::where("name","like", '%' . $request->value .'%')->limit(10)->get(['name','id'])], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Studio  $studio
     * @return \Illuminate\Http\Response
     */
    public function get_studio($index, $nb_studio, request $request)
    {
        $studios = new  Studio;
        $orderBy = $search_by_price = "null";
        error_log($request->header('search_by_price'));
        if  (is_string($request->header('orderBy')))
            $orderBy = json_decode($request->header('orderBy'), true);
        if  (is_string($request->header('search_by_price')))
            $search_by_price = json_decode($request->header('search_by_price'), true);
        if ($index < 0 || $nb_studio < 0)
            return response()->json([ 'error' => $index < 0 ? "index require positive number" :  "nb_studio require positive number"]);
        $studio_request = $studios->offset($index)->limit($nb_studio);

        if (is_array($orderBy) && array_key_exists('column', $orderBy)  && array_key_exists('value', $orderBy) && in_array($orderBy['column'],["id",'prix','visites'])){
            $studio_request = $studio_request->orderBy( $orderBy['column'], $orderBy['value']);
        }
        if (is_array($search_by_price) && array_key_exists('sign', $search_by_price) && array_key_exists('value', $search_by_price))
            $studio_request->where("prix", $search_by_price['sign'], $search_by_price['value']);

        foreach (($studios = $studio_request->get()) as $key => $studio) {
            $studio->images;
        }

        return response()->json([ 'succes' =>$studios ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Studio  $studio
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $column_studio = ["name", "prix", "description", "address", "nbr_people", "siren", "inge_son", "tva"];

        if (($user = UserController::get_user(["token", $request->header('token')]))[0] == false)
            return response()->json([ 'error' => $user[1]]);
            if ($user[1]->role == "admin")
            {
                if (count(($Studio = Studio::where("id", '=', $request->id_studio)->get())) == 1)
                {
                    foreach ($column_studio as $key => $value) {
                        if ($request->$value != null)
                            $Studio[0]->$value = $request->$value;
                    }
                    $Studio[0]->save();
                    return response()->json([ 'succes' =>  "studio update" ]);
                }
                else
                    return response()->json([ 'error' =>  "studio no found" ]);
            }
        foreach ($user[1]->studios as $key => $studio) {
            if ($studio->id == $request->studio_id)
            {
                foreach ($column_studio as $key => $value) {
                    if ($request->$value != null)
                        $studio->$value = $request->$value;
                }
                $studio->save();
                return response()->json([ 'succes' => "studio update"]);
            }
        }
        return response()->json([ 'error' => "no found studio"]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Studio  $studio
     * @return \Illuminate\Http\Response
     */
    public function destroy(Studio $studio)
    {
        //
    }

    public function autocomplete_search(request $request)
    {
        return response()->json([ 'studios' => Studio::where("name","like", '%' . $request->value .'%')->with('images')->get()], 200);
    }
    public function search_ville(request $request)
    {
        $validator = Validator::make(json_decode($request->getContent(), true), [
            'address' => 'required',
            'orderBy' => 'in:prixasc,prixdesc,avis,popularite',
            // "email"=> 'required|email|max:191|unique:users',
            //"role" => 'required'
        ]);
        if ($validator->fails()){
            return response()->json([ 'error' => 'validation form gone wrong', 'error'=> $validator->errors()->first()]);
        }
        error_log($request->address);
        
        $recherche = "";
        $ordre = "";
        switch($request->orderBy){
            case "prixasc";
                $recherche = "prix";
                $ordre = "asc";
                break;
            case "prixdesc";
                $recherche = "prix";
                $ordre = "desc";
                break;
            case "avis";
                $recherche = "note_generale";
                $ordre = "desc";
                break;
            case "popularite";
                $recherche = "visites";
                $ordre = "desc";
                break;
            default:
                error_log('ici');
                $recherche = "visites";
                $ordre = "desc";
                break;
        }
        if(isset($request->id)){
            return response()->json([ 'studios' => Studio::where("id", $request->id)->with('images')->orderBy($recherche,$ordre)->get()], 200);
        }
        error_log($recherche . "---" . $ordre);
        // error_log(print_r(Studio::where("address","like", '%' . $request->ville)->with('images')->orderBy('visites','desc')->get(),TRUE));
        return response()->json([ 'studios' => Studio::where("address","like", '%' . $request->address .'%')->with('images')->orderBy($recherche,$ordre)->get()], 200);

        // $studio = Studio::orderBy('visites','desc')->take(4)->with('images')->get();


        // return response()->json([ 'studios' => $studio ], 200);
    }
}
