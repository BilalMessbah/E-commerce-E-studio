<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Http\Requests\UserRequest;
use \App\MailNeedValidated;
use \App\Http\Requests\NewMailRequest;
use \App\User;
use \App\Studio;
use \App\PasswordReset;
use \App\Http\Requests\PasswordRequest;
use Dotenv\Loader\Value;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Request as HttpFoundationRequest;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMail;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
      /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public $UserModel;

    public function index()
    {
        $user = User::find(1);
        $user->studios();
        dd($user->studios);
    }

    public function update(request $request)
    {

        $column = ["nom", "prenom", "email", "password"];
        if (($user = self::get_user(["token", $request->header('token')]))[0] != false)
        {
            if ($user[1]->role == 'admin' && $request->id != null)
            {
                if(($user_update = self::get_user(['id', $request->id]))[0] == false)
                    return response()->json([ 'info' =>  "id invalid"]);
                foreach ($column as $key => $value) {
                    if ($request->$value != null)
                        $user_update[1]->$value = $request->$value;
                }
                $user_update[1]->save();
                return response()->json([ 'info' =>  "user modifier"]);
            }
            foreach ($column as $key => $value) {
                if ($request->$value != null)
                    $user[1]->$value = $request->$value;
            }
            $user[1]->save();
        return response()->json([ 'info' =>   'je modifie mon propre profile']);
        }
        return response()->json([ 'info' =>  "j'ai pas trouvé l'user avec le tokens"]);
    }


    public static function get_user($data = ["token", "123456"])
    {
        if (in_array($data[0], ["token", "email", "id"]) == false)
            return [false, "need token or email"];
        else {
            if (count(($user = User::where($data[0], '=', $data[1])->get())) == 1)
                return [true, $user[0]];
            else
                return [false, "user not found"];
        }
    }

    public function show(Request $request)
    {
        $value = $request->header('select_value');
        if (($user = self::get_user(["token", $request->header('token')]))[0] == false)
            return response()->json(["error" => "the token is not valid"]);

        if ($user[1]->role == 'admin' && count(($User = User::where((is_numeric($value) ? "id" : "email"), '=', $value)->get())) == 1)
            return response()->json(["succes" => $User[0]]);
        else
            return response()->json(["error" => $user[1]->role != 'admin' ? 'require role admin' : "user no found"]);
    }

    public function test($token = "")
    {
        return response()->json([ 'info' =>  self::is_connect("2020-06-03 00:49:12CONFIeRMe92b25cfc0ab84694d67a8e4")]);
    }
    public static function is_connect($token = "")
    {
        if (($user = self::get_user(["token", $token]))[0] == true)
        {
            if ($user[1]->confirmed == true)
                return [true, $user[1]];
            else
                return  [false, "need validate account"];
        }
        else
            return $user;// [false, "data error"]
    }

    public static function validate_account($token)
    {
        $user = new \App\User();
        if (($user = self::get_user(["token", urldecode($token)]))[0] && $user[1]->confirmed != true)
            {
               $user[1]->confirmed = true;
               $user[1]->save();
               return response()->json([ 'succes' => 'validate']);
            }
        return response()->json([ 'error' => $user[0] == true &&  $user[1]->confirmed ? "account already validate" : "token not found"],400);
    }
    public function login(Request $request)
    {
        $user = new \App\User();
        $validator = Validator::make(json_decode($request->getContent(), true), [
            "email"=> 'required|email|max:191',
            "password" => 'required|min:6|max:191',
        ]);
        
        if ($validator->fails()){
            return response()->json([ 'error' => 'validation form gone wrong', 'error'=> $validator->errors()->first()],400);
        }

        $user = User::where('email', '=', $request->email)->get();
        if (count($user) == 1 && Hash::check($request->password, $user[0]->password) && $user[0]->confirmed == true && $user[0]->role != 'deactivated' && $user[0]->is_facebook == 0)
        {
            error_log($request->getContent());
            
            $user[0]->token = ($date = date("Y-m-d H:i:s")) . "T" . bin2hex(random_bytes(12));
            $user[0]->save();
            return response()->json(['user'=> $user]);
        }
        else if (count($user) == 1)
            return response()->json(['error'=> ($user[0]->confirmed != true ? "need activation account"  : "email or password is incorrect")],400);
        else
            return response()->json(['error'=> "account no found"],400);
    }
    public function store(Request $request)
    {
        // return  response()->json(['error'=>  $request->all()["name"] ]);
        $validator = Validator::make(json_decode($request->getContent(), true), [
            'name' => 'required|min:2|max:191',
            'firstname' => 'required|min:2|max:191',
            "email"=> 'required|email|max:191|unique:users',
            "password" => 'required|min:6|max:191',
            //"role" => 'required'
        ]);

        if ($validator->fails())
            return response()->json([ 'error' => 'validation form gone wrong', 'error'=> $validator->errors()->first()],400);

        $user = new \App\User();
        $user->nom          = $request->name;
        $user->prenom       = $request->firstname;
        $user->email        = $request->email;
        $user->token        = (($date = date("Y-m-d H:i:s")) . "CONFIRM" . bin2hex(random_bytes(12)));
        $user->password     = Hash::make($request->password);
        $user->confirmed     = 1;
        $user->role         = "studio";
        $user->is_facebook = 0;
        $user->save();

        $ContactController = new ContactController();
        $url = "http://127.0.0.1:8000/validate_account/" . urlencode($user->token);
        self::send_mail_a_validated(  $user->email, $url);

        return response()->json([ 'result' => 'valida' ]);
    }
    public static function send_mail_a_validated($mail, $url)
    {
        error_log("here seend email");
        (Mail::to($mail)->send(new ContactMail(['url'=> $url])));
    }
    
    public function show_users(Request $request, int $index, int $nb_studio)
    {
        $value = $request->header('select_value');
        $column = (is_numeric($value) ? "id" : "email");

        if (($user = self::get_user(["token", $request->header('token')]))[0] == false)
            return response()->json(["error" => "the token is not valid"]);

        if ($user[1]->role == 'admin' && count(($User = User::where($column, 'like', '%'.$value.'%')->offset($index)->limit($nb_studio)->get())) > 0)
            return response()->json(["succes" => $User]);
        else
            return response()->json(["error" => $user[1]->role != 'admin'? 'require role admin' : "user no found"]);
    }
    
    public function reactivated(Request $request)
    {
        $value = $request->header('select_value');
        $column = (is_numeric($value) ? "id" : "email");

        if (($User_admin = self::get_user(["token", $request->header('token')]))[0] == false)
            return response()->json(["error" => "the token is not valid"]);
        if ($User_admin[1]->role == 'admin' && count(($User = User::where($column, "=", $value)->get())) == 1) {
            $User[0]->role = 'reactivated';
            $User[0]->save();
            return response()->json(["succes" => "user reactivated"]);
        } else
            return response()->json(["error" => $User_admin[1]->role != 'admin' ? 'require role admin' : "user no found"]);
    }

    public function deactivated(Request $request)
    {
        $value = $request->header('select_value');
        $column = (is_numeric($value) ? "id" : "email");

        if (($User_admin = self::get_user(["token", $request->header('token')]))[0] == false)
            return response()->json(["error" => "the token is not valid"]);
        if ($User_admin[1]->role == 'admin' && count(($User = User::where($column, "=", $value)->get())) == 1) {
            $User[0]->role = 'deactivated';
            $User[0]->save();
            return response()->json(["succes" => "user deactivated"]);
        } else
            return response()->json(["error" => $User_admin[1]->role != 'admin' ? 'require role admin' : "user no found"]);
    }

    public function autocomplete(request $request)
    {
     return response()->json([ 'users' => User::where("nom","like", '%' . $request->value .'%')->limit(10)->get(['nom','id'])], 200);
    }
    public function me(Request $request)
    {
        $token = $request->header('token');
        $user = User::where("token", "=" , $token)->get();
        return response()->json(['user'=> $user]);
    }







    public function facebook_login($email,$facebook_id)
    {
        $user = new \App\User();
        // $validator = Validator::make(json_decode($request->getContent(), true), [
        //     "email"=> 'required|email|max:191',
        //     "password" => 'required|min:6|max:191',
        // ]);
        
        // if ($validator->fails()){
        //     return response()->json([ 'error' => 'validation form gone wrong', 'error'=> $validator->errors()->first()]);
        // }

        $user = User::where('email', '=', $email)->get();
        if (count($user) == 1 && Hash::check($facebook_id, $user[0]->password) && $user[0]->confirmed == true && $user[0]->role != 'deactivated' && $user[0]->is_facebook == 1)
        {
            // error_log($request->getContent());
            
            $user[0]->token = ($date = date("Y-m-d H:i:s")) . "T" . bin2hex(random_bytes(12));
            $user[0]->save();
            return ['user'=> $user];
        }
        else if (count($user) == 1)
            return ['error'=> ($user[0]->confirmed != true ? "need activation account"  : "email or password is incorrect")];
        else
            return ['error'=> "account no found"];
    }
    public function facebook_store(Request $request)
    {
        // return  response()->json(['error'=>  $request->all()["name"] ]);
        $validator = Validator::make(json_decode($request->getContent(), true), [
            'name' => 'required|min:2|max:191',
            'firstname' => 'required|min:2|max:191',
            "email"=> 'required|email|max:191|unique:users',
            //"role" => 'required'
        ]);
        if ($validator->fails()){
            $error = $validator->errors()->first();
            error_log($error);
            //  error_log(print_r($validator->errors(),TRUE));
             if($error == "The email has already been taken."){
                 error_log('oui');
                 $res = $this->facebook_login($request->email,$request->facebook_id);
                 return response()->json($res);
             } else {
                 return response()->json([ 'error' => 'validation form gone wrong', 'error'=> $validator->errors()->first()]);
             }
        } else {
            $user = new \App\User();
            $user->nom          = $request->name;
            $user->prenom       = $request->firstname;
            $user->email        = $request->email;
            $user->token        = (($date = date("Y-m-d H:i:s")) . "CONFIRM" . bin2hex(random_bytes(12)));
            $user->password     = Hash::make($request->facebook_id);
            $user->confirmed     = 1;
            $user->role         = "studio";
            $user->facebook_id = $request->facebook_id;
            $user->is_facebook = 1;
            error_log('ouiouioui');
            $user->save();
            error_log('nononononon');
    
            //Le login
            $res = $this->facebook_login($request->email,$request->facebook_id);
            return response()->json($res);

            // return response()->json([ 'result' => 'valida' ]);
        }
            //potentielement deja creer son compte

        
    }
}
