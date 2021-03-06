web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // Find the port number on Ganache

async function getAccount() {
	let accounts = await web3.eth.getAccounts();
	web3.eth.defaultAccount = accounts[0]; // Gets the default account
	console.log(web3.eth.defaultAccount + ' account detected');
	return web3.eth.defaultAccount;
}