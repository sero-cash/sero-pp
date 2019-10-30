import React, {Component} from 'react';
import ABI from './abi'
import serojs from 'serojs'
import seropp from 'sero-pp'
import Web3 from 'sero-web3'
import BigNumber from 'bignumber.js'


const contractAddress = "3J7TKep9SBb8UD9gTnfhMR5cdHukbU8EsxZzKaV8n5mNR137RnvFdjsfgAwVQnPr4WnwaiexzHr8co9hD12Nrji2";
const contract = serojs.callContract(ABI, contractAddress);
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://127.0.0.1:8545"))

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accounts:[{}],
            name:"",
            msg:"",
            say:"",
            balance:[],
        }
    }

    componentDidMount() {
        let that= this;
        /***
         * setup dapp base info .
         * @type {{github: string, author: string, name: string, contractAddress: *, logo: string, url: string}}
         */
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

        // setTimeout(function () {
        //     that.getAccountList();
        // },100)
    }

    callMethod(_method, _args, callback) {
        let that = this;
        // let param = [ABI, contractAddress, _method, args]

        let packData = contract.packData(_method, _args);
        let callParams = {
            from: that.state.accounts[0].MainPKr,
            to: contractAddress,
            data: packData
        }

        seropp.call(callParams,function (callData) {
            if(callData !== "0x"){
                let res = contract.unPackData(_method, callData);
                if (callback){
                    callback(res);
                }
            }else{
                callback("0x0");
            }
        });
    }

    executeMethod(_method, args, value, cy, callback) {
        let that = this;

        let packData = contract.packData(_method, args);
        let executeData = {
            from: that.state.accounts[0].PK,
            to: contractAddress,
            value: "0x"+value,//SERO
            data: packData,
            gasPrice: "0x"+new BigNumber("1000000000").toString(16),
            cy:cy,
        };
        let estimateParam = {
            from: that.state.accounts[0].MainPKr,
            to: contractAddress,
            value: "0x"+value,//SERO
            data: packData,
            gasPrice: "0x"+new BigNumber("1000000000").toString(16),
            cy:cy,
        }
        seropp.estimateGas(estimateParam,function (gas) {
            executeData["gas"] = gas;
            seropp.executeContract(executeData,function (res) {
                if (callback) {
                    callback(res)
                }
            })
        });
    }

    load = () => {
        let that = this;
        this.callMethod("name","",function (rest) {
            that.setState({
                name:rest
            })
        })

        this.callMethod("msg","",function (rest) {
            that.setState({
                msg:rest
            })
        })

        this.callMethod("sayHello","",function (rest) {
            that.setState({
                say:rest
            })
        })

        let balance = web3.sero.getBalance(contractAddress, "latest");
        console.log("balance:: ",balance);
    }

    execute = () => {
        let name = document.getElementById("name").value;
        let msg = document.getElementById("msg").value;
        this.executeMethod("say",[name,msg],0,"SERO",function (res) {
            alert("transaction submit successful. hash :"+res);
        })
    }

    getBalance = () => {

    }

    getAccountList = ()=>{
        let that = this;
        seropp.getAccountList(function (rest) {
            that.setState({
                accounts:rest
            })
        })
    }

    render() {

        const {name,msg,balance,accounts,say} = this.state;

        let accountsHtml = [];
        let i = 0;
        accounts.forEach(function (account) {
            accountsHtml.push(<li key={i++}><p>Name: {account.Name}</p></li>)
            accountsHtml.push(<li key={i++}><p>PK: {account.PK}</p></li>)
            accountsHtml.push(<li key={i++}><p>MainPKr: {account.MainPKr}</p></li>)
            accountsHtml.push(<li key={i++}><p>Balance: {account.Balance}</p></li>)
        })


        return (<div style={{padding: "15px",marginBottom:"45px"}}>
            <h2 style={{textAlign: "center"}}>Hello DApp</h2>
            <h3 style={{color: "#888"}}>AccountList</h3>
            <div>
                <ul>
                    <li style={{listStyle:"none"}}><button onClick={this.getAccountList}>Load Account</button></li>
                    {accountsHtml}
                </ul>
            </div>
            <h3 style={{color: "#888"}}>Contract</h3>
            <div>
                <span>Contract Address</span>
                <p className="contractAddress">{contractAddress}</p>
                <ul>
                    <li style={{listStyle:"none"}}><button onClick={this.load}>Load Contract</button></li>
                    <li><p>Name: <span>{name}</span></p></li>
                    <li><p>Msg: <span>{msg}</span></p></li>
                    <li><p>Say: <span>{say}</span></p></li>
                    {/*<li><p>Balance: <span>{balance}</span></p></li>*/}
                </ul>

                <span>Execute contract</span>
                <ul >
                    <li><p>Name: <input type="text" id="name" placeholder="Please input name"/></p></li>
                    <li><p>Msg: <input type="text" id="msg" placeholder="Please input msg"/></p></li>
                    <li style={{listStyle:"none"}}><button onClick={this.execute}>Execute Contract</button></li>
                </ul>
            </div>
        </div>)
    }
}

export default App;
