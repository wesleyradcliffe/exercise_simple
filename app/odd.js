//odd.js 
//read a param passed on script init, test it again, and then return the STRING 'odd' if falsy

 
var param = process.argv[2];

var castNumber = parseInt(param,10);

if(castNumber % 2 !== 0){
    console.log('odd');
}

//process.exit(-1);//kill this thing so we dont keep spawning more? does exec clean up? garbage collection?