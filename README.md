#sero-pp
  
  SERO js-sdk for popup and pullup DApp market .
  
  ## Whate is sero-pp?
  
  sero-pp provided to developers who need to develop DApps in the popup and pullup DApp market. It provides interface for querying accounts and executing smart contract methods.
  
  ## How to use sero-pp
  
  ### Installation
  
  ```
   npm install sero-pp
  ```
  
  ### Usage
  
  ``` 
  import seropp from 'sero-pp'
  ```
  
  ## Document
  
>- seropp.init
>- seropp.accountList
>- seropp.accountDetail
>- seropp.call
>- seropp.executeContract
>- seropp.estimateGas
 
##### seropp.init
  It must be inited before invoke other interface.
  
  ```javascript
const dapp = {
            name: "Hello DApp",
            contractAddress: contractAddress,
            github: "https://github.com/sero-cash/sero-pp/example",
            author: "tom",
            url: "http://127.0.0.1:3000",
            logo: "http://127.0.0.1:3000/logo192.png",
        }

        seropp.init(dapp,function (rest) {
            console.log("init result >>> " , rest);
        })
```

##### seropp.accountList
  
  **Account structure**
  
  >- `Name` wallet name
  >- `PK` is the address of the account, can be used as a tag for the account, not as a transfer from address.
  >- `MainPKr` can be used as a common address, `call` and `execute` smart contract.
  >- `Balance` is a map. key = currency ,value = Minimum unit amount. 
  
  **Transaction structure**
  
  >- `from` Use PK 
  >- `to`  Use Contract Address
  >- `data`  It is the data that return from `serojs ` packMethod 
  >- `value` It is amount of transfer to the contract.  It need contract support `payable` method.
  >- `cy` It is short word of currency ,default `SERO`
  >- `gas` It is pay to miner
  >- `gasPrice` Price of gas

  #### Usage
  - **seropp.accountList**
Return all wallet account
  ```
  seropp.accountList(function(accounts){
      console.log(accounts);
  });
  ```

  Result: 
  ```
  [{
          "Name":"Tom",
          "PK": "kvaztfuz3ZS6sNcksQYZpdGC1rUwcuv1aPkuzkLdgeNSvq5FQiURuBsqghLCY3MkxZLNm7WQ9yV2ib2UWoRpJys",
          "MainPKr": "fHBQfR5t9j3D4CsKQG78sQ3Qzdz9SS6m3XsgvgkNcpKjD1TMBEVmcJ4vhDUpkZrvPtE47DnzxRjz4Gk7xMaGZfxstnMeBjZF1dWeQaC3dxLrPPa4wQoGdXeJuihdTKwxf5K",
  	"Balance": {
  		"SERO": 88999438296000000000
  	}
  }]
  ```

  - **seropp.accountDetail**
Return the PK wallet account
  
  ```
    seropp.accountDetail(PK,function(account){
        console.log(account);
    });
  ```
  
  Result: 
    
  ```
    {
            "Name":"Tom",
            "PK": "kvaztfuz3ZS6sNcksQYZpdGC1rUwcuv1aPkuzkLdgeNSvq5FQiURuBsqghLCY3MkxZLNm7WQ9yV2ib2UWoRpJys",
            "MainPKr": "fHBQfR5t9j3D4CsKQG78sQ3Qzdz9SS6m3XsgvgkNcpKjD1TMBEVmcJ4vhDUpkZrvPtE47DnzxRjz4Gk7xMaGZfxstnMeBjZF1dWeQaC3dxLrPPa4wQoGdXeJuihdTKwxf5K",
    	"Balance": {
    		"SERO": 88999438296000000000
    	}
    }
  ```

  - **seropp.executeContract**
Send a transaction to update smart contract state. It is asynchronous on the block chain. and return transaction hash.   
  ```
  seropp.executeContract(tx,function(txHash){
      console.log(txHash);
  });
  ```
  
  - **seropp.call**
It use to get data from gero node . and it will be convert to basic data structure.
  ```
  seropp.call(data,function(rest){
      console.log(rest);
  });
  ```
  
  - seropp.estimateGas
It use to estimate gas begin send transaction .
  ```
  seropp.estimateGas(data,function(gas){
      console.log(gas);
  });
  ```