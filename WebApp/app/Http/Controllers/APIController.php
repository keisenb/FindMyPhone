<?php namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;
use Response;
use Twilio\Rest\Client;
use Twilio\Twiml;
use App\User;


class APIController extends Controller
{
    public function Call(Request $request) {

        $id = $request->header('id');
        $user = User::where('alexa-id', $id)->first();

        $sid = env('TWILIO_SID');
        $token = env('TWILIO_TOKEN');
        $number = env('TWILIO_NUMBER');
        $client = new Client($sid, $token);

        $call = $client->calls->create(
            $user->phone, $number,
            array("url" => "https://phone.kyle-eisenbarger.com/api/answer")
        );
        return response()->json("Alright we're giving you a call. Sit tight!", 200);
    }

    public function Answered() {
        $response = new Twiml();
        $response->say('Hello we are glad you found your phone! Thanks for using our Alexa skill. Goodbye.');
        print $response;
    }

    public function AddNumber(Request $request) {

        $id = $request->header('id');
        $phone = $request->header('phone');
        $user = User::where('alexa-id', $id)->first();

        if($user === null) {
            //todo check phone dupes
            User::insert(['alexa-id' => $id, 'phone' => $phone]);
            return response()->json("Phone was successfully added. Go ahead and try to find it now.", 200);
        }

        User::where('alexa-id', $id)->update(['phone' => $phone]);
        return response()->json("Phone was successfully updated. Go ahead and try to find it now.", 200);
    }

}
