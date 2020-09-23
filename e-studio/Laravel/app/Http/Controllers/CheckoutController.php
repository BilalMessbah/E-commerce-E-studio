<?php

namespace App\Http\Controllers;

use App\Customer;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        // error_log($request->id);

        // error_log($request);
        // error_log($request->billing_details->email);
        $bd = $request->billing_details;
        $addr = ($bd['address']);
        error_log($addr['city']);
        
        // key private//
        
        // return response()->json([$addr]);

         \Stripe\Stripe::setApiKey('sk_test_51Gv9aXLbgko1nJUkYvDJ2lccSMQAki7J5jDgmae730hp2hFOWTyS0vr9AirmECjFpt0jAbcfX3I2uAGobQb7uEK300S28Lb7Iy');

             try {
                    $intent = \Stripe\PaymentIntent::create([
                        'amount' => $request->amount *100 ,
                        'currency' => 'EUR',
                        // Verify your integration in this guide by including this parameter
                        // 'metadata' => ['integration_check' => 'accept_a_payment'],
                        'payment_method' => $request->id,
                        'description' => 'test',
                    ]);

                $cus = Customer::where('email',$bd['email'])->get();

                // error_log($cus);

                if (count($cus) == 0) {
                    error_log($request->id);
                   
                    $customer = \Stripe\Customer::create([
                        'email' => $bd['email'],
                        'name' => $bd['name'],
                        // 'default_source'=> $request->id,
                        // 'payment_method' => $request->id,

                        // 'metadata' => ['id' => $request->id],

                        // 'invoice_settings' => [
                        //     'default_payment_method' => $request->id,
                        //   ],
                        // 'payment_method' => $request->id,
                    ]);
                    

                    $cust = new Customer();

                    $cust->user_id = null ;
                    $cust->cus_id = $customer->id;
                    $cust->name = $bd['name'];
                    $cust->email = $bd['email'];
                    $cust->address = $addr['line1'];
                    $cust->city = $addr['city'];
                    $cust->zip = $addr['postal_code'];

                    $cust->save();
                }

                $customer = \Stripe\Customer::retrieve(
                    'cus_HWo0hYmQHQ0Ffa',
                    [],
                    
                    );

                    return response()->json([$intent,$customer]);

                    // error_log($intent->client_secret);
                } catch (\Stripe\Exception\CardException $e) {
                    return response()->json([ 'error' => $e] , 400);
                }
          

            // $output = [
            //     'publishableKey' => $config['pk_test_51Gv9aXLbgko1nJUkmcvG1A4kinboDc5zyFJLioO4HqC7vZsyAbF0DfHysoODUQoDX5S9RZagpZ56FP6DeT7gbPLt00hIGfEbnu'],
            //     'clientSecret' => $paymentIntent->client_secret,
            // ]; 

            // error_log($intent);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
