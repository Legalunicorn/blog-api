 function randomName(){
    let r = (Math.random()+1).toString(36).substring(3);
    console.log(r);
    //toString() takes a radix paramenter that specifis the 
    //number base for the string represensatoin
    return `User-${r}`;
}

//for testing 

console.log(randomName())

module.exports = randomName