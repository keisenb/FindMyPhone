<?php namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;
use Response;
use Twilio\Rest\Client;
use Twilio\Twiml;


class APIController extends Controller
{
    public function Call() {
        $sid = env('TWILIO_SID');
        $token = env('TWILIO_TOKEN');
        $number = env('TWILIO_NUMBER');
        $client = new Client($sid, $token);

        $call = $client->calls->create(
            "+19139078801", $number,
            array("url" => "https://phone.kyle-eisenbarger.com/api/answer")
        );

        return response()->json("We just called you!", 200);
    }

    public function Answered() {
        $response = new Twiml();
        $response->say('Hello we are glad you found your phone! Thanks for using our Alexa skill. Goodbye.');
        print $response;
    }

    public function AddNumber(Request $request) {

        $id = $request->header('id');
        $phone = $request->header('phone');

        //todo


        return response()->json("Phone was successfully added. Go ahead and try to find it now.", 200);


    }


}
