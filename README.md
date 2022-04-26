# better-todo-list-dapp-ethernals
this project is created in ethernals and ELEC S431F	Blockchain Technologies.


## The problem Web3 Todo App solves
This dapp help organise our daily tasks in a more secure way by using blockchain technology, using blockchain as backend make this dapp better in transparency, decentralized.

## Features:
- Self-Hosted.
- In Frontend, create a task, delete a task, update task status, set task Highlighted in the blockchain.
- Set all the task statuses and remove all the tasks at once.
- Recorded task created timestamp and stored at blockchain.

## Example screenshots

![todolist](https://user-images.githubusercontent.com/30548562/165284776-3cb15ec0-2f41-41af-ba47-5719193050ba.png)



## Project details:

Technologies used: Solidity , JavaScript , CSS3 , HTML5 
Required Technologies: Ganache CLI , Remix IDE 

>Thing to look: For testing, this website has selected the first account in the blockchain as the testing wallet.
>Make sure your account has enough money, otherwise, you may fail to do the transaction.
### Setup

There are 2 core components, Ganachi cli and Remix:
#### Example deployment configurations: 
To deploy this smart contract, you need to:
- Run a ganachi cli blockchain (https://docs.nethereum.com/en/latest/ethereum-and-clients/ganache-cli/) 
$ ganache-cli <options>
- Mark down the Endpoint of your blockchain
- Run Remix IDE, https://remix.ethereum.org/. Create a new project and copy and paste the todolist.sol under contracts folder 
- Compile the smart contract and go to DEPLOY & RUN TRANSACTIONS, select ENVIRONMENT(WEB3 Provider) and set the Endpoint same as your local blockchain Endpoint.
- Press OK and then press Deploy button to deploy smart contract to our blockchain
- After deploying the smart contract to blockchain, copy the contractAddress
- Paste the contractAddress to folder /frontend/js/config.js line 158 
  [let contractAddress = "";]
- Make sure getAccount.js HttpProvider is the same as your Endpoint
  [HttpProvider('http://localhost:8545')]
  
