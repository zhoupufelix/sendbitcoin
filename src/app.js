const { testnet, mainnet } = require("bitcore-lib/lib/networks");
const { createWallet, createHDWallet } = require("./wallet.bitcoin");
const sendBitcoin = require("./send.bitcoin");
const { Command } = require('commander');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const program = new Command();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


program
    .description('An application for pizza ordering')
    .option('-p, --privateKey <type>', 'The sender private key', '')
    .option('-s, --sender <type>', 'The sender address')
    .option('-a, --amount <type>', 'send amounts');

program.parse();

const options = program.opts();
const privateKey = options.privateKey ? options.privateKey : '';
if (  !privateKey ){
    console.log("please enter the private key");
    return;
}

const sender = options.sender ? options.sender : '';
if (  !sender ){
    console.log("please enter the sender address");
    return;
}

const amount = options.amount ? parseFloat(options.amount) : 0;
if (  amount <= 0 ){
    console.log("please enter the amount to send");
    return;
}


console.log("start to send bitcoins to accounts");


// 文件路径构建
const filePath = path.join(__dirname, 'accounts.txt');

// 创建文件读取流
const fileStream = fs.createReadStream(filePath);

// 使用 readline 创建逐行界面
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // 支持任何换行符格式：\r\n, \n, \r
});


async function processLineByLine() {
    for await (const line of rl) {

        console.log(`try to send ${amount} bitcoins to address ${line}`);

        sendBitcoin(privateKey,sender,line, amount,true)
          .then((result) => {
            console.log(`success,tx hash is ${result}`);
          })
          .catch((error) => {
            console.log(`failed,error is ${error}`);
          });

        // sleep 3s
        await sleep(3000);
    }

    console.log('all accounts done');
}
processLineByLine();

// 监听 'line' 事件来读取每一行
// rl.on('line', (line) => {
//     console.log(`try to send  bitcoins to ${line}`);

    // sendBitcoin(privateKey,sender,line, amount,true)
    //   .then((result) => {
    //     console.log(`success,tx hash is ${result}`);
    //   })
    //   .catch((error) => {
    //     console.log(`failed,tx hash is ${result}`);
    //   });
    // console.log(`文件的一行内容: ${line}`);
// });

// 监听 'close' 事件表示文件已经被完全读取
// rl.on('close', () => {
//     console.log('all accounts done');
// });




// sendBitcoin(privateKey,sender, amount)
//   .then((result) => {
//     console.log("end");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// console.log(createHDWallet(testnet))
