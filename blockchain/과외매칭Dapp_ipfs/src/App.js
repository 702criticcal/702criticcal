import { Table, Grid, Button, Form, ListGroup, ListGroupItem, Card, CardDeck } from 'react-bootstrap';
import React, { Component } from 'react';
import {Redirect} from "react-router-dom";
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
                myResumeNum:0,
                username:null,
                gender:null,
                residence:null,
                korean:null,
                math:null,
                english:null,
                ipfsHash: "waiting..",
                buffer: "waiting..",
                ethAddress: "waiting..",
                blockNumber: "waiting..",
                transactionHash: "waiting..",
                gasUsed: "waiting..",
                txReceipt: "waiting.."
            
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
      }
    // state = {
    //     name:null,
    //     residence:null,
    //     ipfsHash: "waiting..",
    //     buffer: "waiting..",
    //     ethAddress: "waiting..",
    //     blockNumber: "waiting..",
    //     transactionHash: "waiting..",
    //     gasUsed: "waiting..",
    //     txReceipt: "waiting.."
    // };



    captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
    };

    convertToBuffer = async (reader) => {
        //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
        //set this buffer -using es6 syntax
        this.setState({ buffer });
    };

    onClick = async () => {

        try {
            this.setState({ blockNumber: "waiting.." });
            this.setState({ gasUsed: "waiting..." });

            // get Transaction Receipt in console on click
            // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
            await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt) => {
                console.log(err, txReceipt);
                this.setState({ txReceipt });
            }); //await for getTransactionReceipt

            await this.setState({ blockNumber: this.state.txReceipt.blockNumber });
            await this.setState({ gasUsed: this.state.txReceipt.gasUsed });
        } //try
        catch (error) {
            console.log(error);
        } //catch
    } //onClick


    handleChange=(e)=> {
        this.setState({
            [e.target.name]: e.target.value
          });
      }
    
    onClickResume=async()=>{
        const accounts = await web3.eth.getAccounts();

        storehash.methods.buyResume().send({
            from: accounts[0],
            value: web3.utils.toWei('5', "ether"),
            gas: 900000
        }).then((result)=>{
          console.log(result);
          console.log(this.state.ipfsHash);
          window.location.href="http://gateway.ipfs.io/ipfs/"+`${this.state.ipfsHash}`;
        })
    }

    // getMyCoke = () => {
    //     this.state.storeInstance.GetMyCokeNum().then(result => {
    //         this.setState({ myCokeNum: result.toNumber() });
    //     });
    // }

    onSubmit = async (event) => {
       
        event.preventDefault();
        
        //bring in user's metamask account address
        const accounts = await web3.eth.getAccounts();

        console.log('Sending from Metamask account: ' + accounts[0]);

        //obtain contract address from storehash.js
        const ethAddress = await storehash.options.address;
        this.setState({ ethAddress });
        
    
        //save document to IPFS,return its hash#, and set hash# to state
        //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
            console.log(err, ipfsHash);
            //setState by setting ipfsHash to ipfsHash[0].hash 
            this.setState({ ipfsHash: ipfsHash[0].hash });
           
            
            // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
            //return the transaction hash from the ethereum contract
            //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send

            storehash.methods.sendHash(this.state.ipfsHash).send({
                from: accounts[0]
            }, (error, transactionHash) => {
                console.log(transactionHash);
                this.setState({ transactionHash });
            }); //storehash 
        }) //await ipfs.add 
       
    }; //onSubmit 

    render() {
        return (

            <div>
                <header className="App-header">
                    <h1>과외 매칭 Dapp (선생님-학생) 플랫폼</h1>
                </header>
                <hr />



                <section>
                    <div>

                        <Form onSubmit={this.onSubmit}>
                            <Form.Group controlId="name">
                                <br />
                                <Form.Label >이름</Form.Label>
                                <br />
                                <input
                                    type="text"
                                    name={'username'}
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    placeholder="홍길동"
                                />
                            </Form.Group>
                            <hr />
                            <Form.Group controlId="gender">
                                <br />
                                <Form.Label >성별</Form.Label>
                                <br />
                                <input
                                    type="text"
                                    name={'gender'}
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    placeholder="남/여"
                                />
                            </Form.Group>
                            <hr />
                            <Form.Group controlId="residence">
                                <Form.Label>거주지</Form.Label>
                                <br />
                                <input
                                    type="text"
                                    name={'residence'}
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    placeholder="서울(시)/강남(구,동)"
                                />
                            </Form.Group>
                            <hr/>
                            <Form.Group controlId="Grade">
                                <Form.Label>성적입력</Form.Label>
                                <br />
                                <input
                                    type="text"
                                    name={'korean'}
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    placeholder="언어(상,중,하)"
                                />
                                <hr />
                                <input
                                    type="text"
                                    name={"math"}
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    placeholder="수리(상,중,하)"
                                />
                                 <hr />
                                <input
                                    type="text"
                                    name={'english'}
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    placeholder="외국어(상,중,하)"
                                />
                            </Form.Group>
                            <hr/>
                            <Form.Group controlId="upload">
                                <Form.Label>이력서 업로드</Form.Label><br />
                                <input
                                    type="file"
                                    onChange={this.captureFile}
                                    name="이력서 업로드"
                                />
                            </Form.Group>


                            <Button variant="primary" type="submit">
                                제출
                    </Button>
                        </Form>
                    </div>
                    <hr/>
                    <div>
                      
                      <Card style={{ width: '18rem' }} border='dark'>
                     
                          <Card.Body>
                           <Card.Title>이름 : {this.state.username}</Card.Title>
                              <Card.Text>
                                  성별 : {this.state.gender}<br/>
                                  거주지 : {this.state.residence}
                          </Card.Text>

                              <ListGroup className="list-group-flush">
                                  <ListGroupItem>언어 : {this.state.korean}</ListGroupItem>
                                  <ListGroupItem>수리 : {this.state.math}</ListGroupItem>
                                  <ListGroupItem>외국어 : {this.state.english}</ListGroupItem>
                              </ListGroup>
                          </Card.Body>
                          <Card.Footer>
                              <Button variant="primary" onClick={this.onClickResume}>학생정보 다운로드</Button>
                          </Card.Footer>
                      </Card>



              </div>

                    <div>
                        <hr />
                        <Button onClick={this.onClick}> Get Transaction Receipt </Button>

                        <Table bordered responsive>
                            <thead>
                                <tr>
                                    <th>Tx Receipt Category</th>
                                    <th>Values</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>IPFS Hash # stored on Eth Contract</td>
                                    <td>{this.state.ipfsHash}</td>
                                </tr>
                                <tr>
                                    <td>Ethereum Contract Address</td>
                                    <td>{this.state.ethAddress}</td>
                                </tr>

                                <tr>
                                    <td>Tx Hash # </td>
                                    <td>{this.state.transactionHash}</td>
                                </tr>

                                <tr>
                                    <td>Block Number # </td>
                                    <td>{this.state.blockNumber}</td>
                                </tr>

                                <tr>
                                    <td>Gas Used</td>
                                    <td>{this.state.gasUsed}</td>
                                </tr>
                            </tbody>
                        </Table>

                    </div>

 
                </section>
            </div>




        );
    }
}

export default App;