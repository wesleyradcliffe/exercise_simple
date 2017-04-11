//server.js

//lets build our HTTP server here, listen to connections, do very basic routing
//test for errors or invalid urls, and return HTTP request numbers or valid JSON blocks


//REQUIREMENTS/INCLUDES

const HTTP = require('http'); //https://nodejs.org/api/http.html
const HTTP_PORT = 3000; //should be open, if not pick something else!
const SPAWN = require('child_process').spawn; //spawn is the root of the others, could run file exec tho?
const EXEC = require('child_process').exec;

//requirements/includes

//do basic routing inside the request handler
//the arrow here is ES6 arrow notation for function(request,response){}; but doesnt bind THIS
const requestHandler = (request, response) => { //why const instead of var? function requires immutable object? or convention
    //console.log(request.url); //lets see this whole damn thing/nope too big
    //response is an object we act on to send stuff back?

    // IS THIS TRUE?
    //"switch construct should not be used unless you are absolutely confident you are optimizing 
    //a super hot function which your JS engine can't optimize by itself. if/else if/else should be used instead."

    //easyrouter https://nodejs.org/api/http.html#http_response_end_data_encoding_callback
    //The request object is an instance of IncomingMessage.

    var method = request.method;
    var url = request.url;
    var headers = request.headers;
    var userAgent = headers['user-agent']; 

    if (url === '/which-child-process') { 

        if (method === 'POST'){//if you're not sending anything / i guess put should be supported too
            var body = []; // array instead of object so we get .push and length and such
            request.on('data', function(chunk) {
              body.push(chunk); // for each burst of data chunk it on body
            }).on('end', function() { 
              body = Buffer.concat(body).toString();
              body = JSON.parse(body);
              console.log('body: ' + body.number);
              // at this point, `body` has the entire request body stored in it as a string

              //test if we have a real number
              if (Number.isInteger(parseInt(body.number,10))){//cast to an int but force base 10
                console.log('is integer true');
                //test even or odd and invoke child process

                if(body.number % 2 === 0){//even
                    //console.log('even if: ' + (body.number % 2));
                    EXEC('node app/even.js ' + body.number, function(error,stdout,stderr){
                        var child_response = stdout.replace(/\n$/, ""); // would need to test for garbage
                        var response_payload = JSON.stringify({'response':child_response});
                        console.log(child_response);
                        response.statusCode = 200;
                        response.setHeader('Content-Type', 'application/json');
                        response.write(response_payload);
                        response.end();
                        
                        if (error !== null) {
                            console.log('exec error: ', error);
                        }
                    });

                } 
                else {//odd
                    //console.log('odd if: ' + (body.number % 2));
                    EXEC('node app/odd.js ' + body.number, function(error,stdout,stderr){
                        var child_response = stdout.replace(/\n$/, ""); // would need to test for garbage
                        var response_payload = JSON.stringify({'response':child_response});
                        response.statusCode = 200;
                        response.setHeader('Content-Type', 'application/json');
                        response.write(response_payload);
                        response.end();
                        
                        if (error !== null) {
                            console.log('exec error: ', error);
                        }
                    });


                }

              } 
              else {
                console.log('not an integer failing out');
                sendResponse(response, 400, '');
              }
            




            }).on('error', function(err){
                console.error(err.stack);
                sendResponse(response, 500, '');
            });
        }
        else { // the right url but the wrong type. no data
            sendResponse(response, 404, '');
        }
        
    }
    else {
        sendResponse(response, 404, '');
    }




};



//roll the server with the above handler
const SERVER = HTTP.createServer(requestHandler);
SERVER.listen(HTTP_PORT, (err) => { //function(err){}
    if (err){
        return console.log('PICK A NEW PORT OR SOMETHIN', err);
    }

    console.log('Server Started on port' + HTTP_PORT); //this dollar sign notation doesnt work for me

});

// so this failed on a subsequent start, so there has to be a kill command to run at the end of this
//nevermind, just takes a second for osx or node process to clean up threads


//intersting note, lost scope to the response object when trying to call this inside the
//child process callback. assuming because its hoisted at runtime and is a callback of a callback its no dice?
//ask about that
function sendResponse(responsePointer, httpStatusCode, responseBody){

    // and respond
    // var response_body = JSON.stringify({'test_object':'butts'});
    // //writehead is the forceful way. you can also build on the stream piecemeal and let .write send headers for you
    // //response.writeHead(200, { 'Content-Type': 'application/json' });
    // response.statusCode = 200;
    // response.setHeader('Content-Type', 'application/json');
    // response.write(response_body);
    // response.end();

    switch (httpStatusCode) {

        case 200:
            console.log('returning a 200 ok');
            responsePointer.statusCode = 200;
            responsePointer.setHeader('Content-Type', 'application/json');
            responsePointer.write(responseBody);
            responsePointer.end();
            break;
        case 404: 
            console.log('returning a 404 bad bad bad');
            responsePointer.writeHead(404, { 'Content-Type': 'application/json' });
            responsePointer.end();
            break;
        case 500:
            console.log('somethin broke');
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end();
            break;
        default:
            console.log('bad code sending 500 anyway');
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end();

    }

}

