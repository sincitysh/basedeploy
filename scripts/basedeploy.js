const fs = require("fs");
const hre = require("hardhat");

// 加载配置文件
const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

// 工具函数：打乱数组顺序
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 工具函数：延迟指定时间（毫秒）
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const deployTimes = config.deployTimes;

  if (isNaN(deployTimes) || deployTimes <= 0) {
    console.error("Invalid deployTimes in config.json. Please set a positive number!");
    process.exit(1);
  }

  // 读取私钥文件
  const privateKeysFile = "private_keys.txt";
  let privateKeys = fs.readFileSync(privateKeysFile, "utf-8").split("\n").filter(Boolean);

  if (privateKeys.length === 0) {
    console.error("No private keys found in the file!");
    process.exit(1);
  }

  // 打乱私钥顺序
  privateKeys = shuffleArray(privateKeys);

  console.log(`Starting deployment. Each private key will deploy ${deployTimes} times.`);

  // 遍历私钥
  while (privateKeys.length > 0) {
    const privateKey = privateKeys.shift();

    if (!privateKey) {
      console.error("Encountered an invalid private key. Skipping.");
      continue;
    }

    try {
      const wallet = new hre.ethers.Wallet(privateKey.trim(), hre.ethers.provider);

      console.log(`Using account: ${wallet.address}`);

      for (let i = 0; i < deployTimes; i++) {
        try {
          // 获取合约工厂
          const ContractFactory = await hre.ethers.getContractFactory("MyContract", wallet);

          // 部署合约并传递随机消息
          const randomMessage = `Hello from ${wallet.address} [Deployment ${i + 1}/${deployTimes}]`;
          const gasLimit = config.gasLimit || 3000000; // 使用配置文件中指定的 gasLimit，默认 3000000
          const gasPrice = config.gasPrice || (await hre.ethers.provider.getGasPrice()); // 使用动态 gasPrice

          const contract = await ContractFactory.deploy(randomMessage, {
            gasLimit: gasLimit,
            gasPrice: gasPrice,
          });

          await contract.deployed();
          console.log(`Contract deployed to: ${contract.address} (${i + 1}/${deployTimes})`);

          // 部署间隔：随机延迟 1 到 5 秒
          const randomDelay = Math.floor(Math.random() * 5000) + 1000;
          console.log(`Waiting ${(randomDelay / 1000).toFixed(3)} seconds before the next deployment...`);
          await delay(randomDelay);
        } catch (error) {
          console.error(`Error deploying contract for account ${wallet.address}:`, error.message);
        }
      }

      // 部署完成后更新私钥文件
      fs.writeFileSync(privateKeysFile, privateKeys.join("\n"), "utf-8");
      console.log(`Finished all deployments for account ${wallet.address}. Private key removed.`);
    } catch (error) {
      console.error(`Error processing private key:`, error.message);
    }
  }

  console.log("Deployment completed for all private keys.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
