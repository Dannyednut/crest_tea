
const Web3 = require('web3');
const { ethers } = require('ethers');

// Contract ABI and address
const contractAbi = JSON.parse(fs.readFileSync('abi.json', 'utf8'));

const contractAddress = '0xE9Ac6bd24936F0F779A6c89A3232F2cc8ED8a113'; // Replace with the contract address

// Initialize Web3 provider
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_PROJECT_ID');
const wallet = new ethers.Wallet('0x...', provider); // Replace with your private key

// Initialize contract instance
const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

// Register a player
async function registerPlayer() {
  try {
    const tx = await contract.register();
    await tx.wait();
    console.log(`Player registered: ${wallet.address}`);
  } catch (error) {
    console.error(error);
  }
}

// Make a guess
async function makeGuess(guess) {
  try {
    const tx = await contract.guess(guess);
    await tx.wait();
    console.log(`Guess made: ${guess}`);
  } catch (error) {
    console.error(error);
  }
}

// Get player points
async function getPoints() {
  try {
    const points = await contract.getPoints(wallet.address);
    console.log(`Points: ${points.toString()}`);
  } catch (error) {
    console.error(error);
  }
}

// Get player attempts
async function getAttempts() {
  try {
    const attempts = await contract.getAttempts(wallet.address);
    console.log(`Attempts: ${attempts.toString()}`);
  } catch (error) {
    console.error(error);
  }
}

// Listen for events
contract.on('Hint', (player, message) => {
  console.log(`Hint for ${player}: ${message}`);
});

contract.on('CorrectGuess', (player) => {
  console.log(`Correct guess by ${player}!`);
});

contract.on('Lost', (player) => {
  console.log(`Player ${player} lost!`);
});

contract.on('Registered', (player) => {
  console.log(`Player registered: ${player}`);
});

// Example usage
async function main() {
  await registerPlayer();
  await makeGuess(50);
  await getPoints();
  await getAttempts();
}

main();



