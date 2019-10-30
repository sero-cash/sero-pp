pragma solidity ^0.4.16;

contract HelloDapp {

    string public name;
    string public message;

    constructor() public{
        name = "Tom";
        message = "Hello";
    }

    function say(string _name,string _msg) public {
        name = _name;
        message = _msg;
    }

    function sayHello() public view returns (string){
        var a = stringAdd(name," say ");
        return stringAdd(a,message);
    }

    function stringAdd(string a, string b) returns(string){
        bytes memory _a = bytes(a);
        bytes memory _b = bytes(b);
        bytes memory res = new bytes(_a.length + _b.length);
        for(uint i = 0;i < _a.length;i++)
            res[i] = _a[i];
        for(uint j = 0;j < _b.length;j++)
            res[_a.length+j] = _b[j];
        return string(res);
    }
}