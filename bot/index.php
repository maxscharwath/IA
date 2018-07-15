<?php
$access_token = "EAAEM6L8RunkBAETREgAvPcnzJ7pfOwxAzy1Xd6KmYGuxbvJtnjKgJJUmVJpQZCv2yObdy2wipDHvMjZA97zNeeZA0VBUQQyOFyIZC0k6dtYesF8KL613d6wq4vuwwZB6YpckmX4u7iZCDdSkjtgwqZBUcF6sTGi4MXxWDTMzswEyQZDZD";
$verify_token = "fb_pocket_school";
$hub_verify_token = null;



function getUser($id){
  $accessToken = 'EAAEM6L8RunkBAETREgAvPcnzJ7pfOwxAzy1Xd6KmYGuxbvJtnjKgJJUmVJpQZCv2yObdy2wipDHvMjZA97zNeeZA0VBUQQyOFyIZC0k6dtYesF8KL613d6wq4vuwwZB6YpckmX4u7iZCDdSkjtgwqZBUcF6sTGi4MXxWDTMzswEyQZDZD';
  $url = "https://graph.facebook.com/v2.6/$id?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=$accessToken";
  $curl = curl_init($url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
  $result = curl_exec($curl);
  curl_close($curl);
  $arr = json_decode($result,true);
  return $arr;
}


if(isset($_REQUEST['hub_challenge'])) {
    $challenge = $_REQUEST['hub_challenge'];
    $hub_verify_token = $_REQUEST['hub_verify_token'];
}


if ($hub_verify_token === $verify_token) {
    echo $challenge;
}
$data = file_get_contents('php://input');
$input = json_decode($data, true);

$sender = $input['entry'][0]['messaging'][0]['sender']['id'];
$message = isset($input['entry'][0]['messaging'][0]['message']['text']) ? $input['entry'][0]['messaging'][0]['message']['text']: '' ;
$postback = isset($input['entry'][0]['messaging'][0]['postback']['payload']) ? $input['entry'][0]['messaging'][0]['postback']['payload']: '' ;

$reply = '';

/**
 * Some Basic rules to validate incoming messages
 */

$user = getUser($sender);
$reply = "salut fils de pute de ".$user['first_name'].", ".$sender;

//API Url
$url = 'https://graph.facebook.com/v2.6/me/messages?access_token='.$access_token;


//Initiate cURL.
$ch = curl_init($url);

//The JSON data.

$message=str_replace(' ','+',$message);
$newhtml =file_get_html("https://www.google.com/search?q=".$message."&tbm=isch");
$result_image_source = $newhtml->find('img', 0)->src;

$jsonData = '{
    "recipient":{
        "id":"'.$sender.'"
    },
    "message":{
        "attachment":{
          "type":"image",
          "payload":{
            "url":"'.$result_image_source.'",
            "is_reusable":true,
          }
        }
    }
}';

//Encode the array into JSON.
$jsonDataEncoded = $jsonData;

//Tell cURL that we want to send a POST request.
curl_setopt($ch, CURLOPT_POST, 1);

//Attach our encoded JSON string to the POST fields.
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonDataEncoded);

//Set the content type to application/json
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
//curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

//Execute the request
if(!empty($input['entry'][0]['messaging'][0]['message'])){
    $result = curl_exec($ch);
}
?>
