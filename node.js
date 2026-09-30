let prices = [400,500,100,4500,5000,9000]

let descounted = prices.map((x)=>{
    return x + (8*x/100)
})

console.log(descounted);
let disco =prices.map((x)=>{
    return "discounted "+x+(8*x/100)
})
console.log(disco)
