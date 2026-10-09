let arrFun = ()=>console.log("This is a function..");

arrFun();

let arrFun1 = ()=>{
    let a = 10;
    console.log("This is function...");
    console.log(a);
}

arrFun1();

let obj={
    name:"sai",
    age:20,
    fun:()=>{
        console.log(this.age);
    }
}

obj.fun();

let obj1={
    name:"sai",
    age:20,
    fun:function(){
        console.log(this.age);
    }
}

obj1.fun();


const login = (username, password)=>{
    console.log(`Username : ${username}`);
    console.log(`Password : ${password}`);

    return "Login Successfull";
}

res = login("kausik@123","kausik2343");

console.log(res);
console.log(login("kausik@123","kausik2343"));


function outer(){
    console.log("Outer Function is executing...");
    let a = 10;
    function inner() {
        console.log("Inner Function..");
        console.log(a);
    }
    inner();
}

outer();

