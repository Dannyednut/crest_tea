const { ethers } = require('ethers');
const fs = require('fs');

class GuessMyNumber {
  constructor(
    privateKey, 
    contractAddress = '0xE9Ac6bd24936F0F779A6c89A3232F2cc8ED8a113', 
    rpcUrl = 'https://testnet.riselabs.xyz'
  ) {
    this.privateKey = privateKey;
    this.contractAddress = contractAddress;
    this.rpcUrl = rpcUrl;
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.abi = JSON.parse(fs.readFileSync('abi.json', 'utf8'));
    this.contract = new ethers.Contract(contractAddress, this.abi, this.wallet);
  }

  async registerPlayer() {
    try {
      const tx = await this.contract.register();
      await tx.wait();
      console.log(`Player registered: ${this.wallet.address}`);
    } catch (error) {
      console.error(error);
    }
  }

  async makeGuess(guess) {
    try {
      const tx = await this.contract.guess(guess);
      await tx.wait();
      console.log(`Guess made: ${guess}`);
    } catch (error) {
      console.error(error);
    }
  }

  async getPoints() {
    try {
      const points = await this.contract.getPoints(this.wallet.address);
      console.log(`Points: ${points.toString()}`);
    } catch (error) {
      console.error(error);
    }
  }

  async getAttempts() {
    try {
      const attempts = await this.contract.getAttempts(this.wallet.address);
      console.log(`Attempts: ${attempts.toString()}`);
    } catch (error) {
      console.error(error);
    }
  }

  async listenForEvents() {
    this.contract.on('Hint', (player, message) => {
      console.log(`Hint for ${player}: ${message}`);
    });

    this.contract.on('CorrectGuess', (player) => {
      console.log(`Correct guess by ${player}!`);
    });

    this.contract.on('Lost', (player) => {
      console.log(`Player ${player} lost!`);
    });

    this.contract.on('Registered', (player) => {
      console.log(`Player registered: ${player}`);
    });
  }
}
