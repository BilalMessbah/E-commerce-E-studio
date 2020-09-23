<?php
 
namespace App\Http\Controllers;
 
use App\Http\Requests\ContactRequest;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMail;
 
class ContactController extends Controller
{
    public function create()
    {
        return view('contact');
    }
    public function send_mail_a_validated($mail, $url)
    {
         (Mail::to($mail)->send(new ContactMail(['url'=> $url])));
    }
    public function store(\App\Mail\ContactMail $request)
    {
        $mail = "hordeofhorde@gmail.com";
        $data = ['url'=> 'http://127.0.0.1:8000/validated-mail/id/token'];
        Mail::to($mail)->send(new ContactMail($data));
    }
    // public function new_mail($mail, $url)
    // {
    //     var_dump(Mail::to($mail)->send(new ContactMail(['url'=> $url])));
    // }
}
