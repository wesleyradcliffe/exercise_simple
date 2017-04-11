//even.js 
//read a param passed on script init, test it again, and then return the STRING 'even' if truthy

 
// var param = process.argv[2];

// var castNumber = parseInt(param,10);

// if(castNumber % 2 === 0){
//     console.log('even');
// }


//process.exit(-1);//kill this thing so we dont keep spawning more? does exec clean up? garbage collection?

process.on('message', function(message) {
    console.log('MESSAGE RECIEVED EVEN.JS: ' + message);

    var castNumber = parseInt(message,10);

    if(castNumber % 2 === 0){
        process.send('even');
    }

    
});