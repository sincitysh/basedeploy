
# 合约批量部署脚本

通过该脚本，您可以从文件中读取私钥，根据配置批量部署智能合约。适用于需要使用多个账户部署多个合约的场景。

---

## 功能特点

1. **多账户支持**：从文件读取私钥，按顺序或乱序逐一部署。
2. **自定义部署次数**：每个私钥根据配置文件设置的次数部署合约。
3. **私钥自动清理**：部署完成后，已使用的私钥会从文件中移除。
4. **动态 Gas 配置**：支持动态获取 Gas 价格或使用固定值。
5. **随机部署间隔**：部署间隔在 1 到 5 秒之间，模拟真实场景。

---

## 文件结构

项目包含以下文件和目录：

```
project/
├── scripts/
│   └── deploy.js        # 部署脚本
├── private_keys.txt     # 存放私钥的文件
├── config.json          # 配置文件
├── contracts/
│   └── MyContract.sol   # 智能合约文件
├── hardhat.config.js    # Hardhat 配置文件
└── README.md            # 本说明文件
```

---

## 使用说明

### 1. 准备环境

确保已安装以下环境：
- **Node.js**：建议版本 ≥ 16.x
- **npm**：Node.js 包管理工具
- **Hardhat**：以太坊智能合约开发框架

安装项目依赖：

```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
```

---

### 2. 准备文件

#### （1）私钥文件

在项目根目录创建 `private_keys.txt` 文件，每行填写一个私钥。例如：

```
0x私钥1
0x私钥2
0x私钥3
```

> 注意：请确保私钥的格式正确，并避免文件被未经授权的访问。

#### （2）配置文件

在项目根目录创建 `config.json` 文件，用于控制部署逻辑。例如：

```json
{
  "deployTimes": 5,       // 每个私钥部署的次数
  "gasLimit": 3000000,    // 每次部署的 Gas 限制
  "gasPrice": null        // Gas 价格（null 表示动态获取）
}
```

- **`deployTimes`**：每个私钥部署合约的次数。
- **`gasLimit`**：每次部署的最大 Gas 量。
- **`gasPrice`**：Gas 价格（单位 wei）。设置为 `null` 时，会动态从网络获取。

#### （3）Hardhat 配置

在 `hardhat.config.js` 中配置目标网络。例如：

```javascript
require("@nomiclabs/hardhat-ethers");

module.exports = {
  networks: {
    base: {
      url: "https://base.meowrpc.com", // Base 测试网
    },
  },
  solidity: "0.8.9",
};
```

---

### 3. 部署合约

#### 编译合约

确保智能合约文件已放在 `contracts/` 目录下，运行以下命令进行编译：

```bash
npx hardhat compile
```

#### 执行部署

运行以下命令开始部署：

```bash
npx hardhat run scripts/basedeploy.js --network base
```

---

## 示例输出

以下是运行部署脚本的示例输出：

```
Starting deployment. Each private key will deploy 3 times.
Using account: 0xYourWalletAddress1
Contract deployed to: 0xDeployedContractAddress1 (1/3)
Waiting 2.341 seconds before the next deployment...
Contract deployed to: 0xDeployedContractAddress2 (2/3)
Waiting 3.456 seconds before the next deployment...
Contract deployed to: 0xDeployedContractAddress3 (3/3)
Finished all deployments for account 0xYourWalletAddress1. Private key removed.
Using account: 0xYourWalletAddress2
Contract deployed to: 0xDeployedContractAddress4 (1/3)
...
Deployment completed for all private keys.
```

---

## 注意事项

1. **私钥安全**：
   - 确保 `private_keys.txt` 文件的权限仅限开发者读取。
   - 脚本会自动清理已使用的私钥，确保文件始终保持最新状态。

2. **Gas 费用**：
   - 部署合约前，请确保每个账户中有足够的 ETH 支付 Gas 费用。
   - 您可以通过配置文件设置固定 Gas 价格或使用动态 Gas 价格。

3. **测试网络**：
   - 在生产网络上部署前，建议先在测试网络（如 Base 测试网）上调试脚本和合约逻辑。

---

## 常见问题

### 问题 1：脚本部署次数不正确
**解决方法**：
- 检查 `config.json` 文件中 `deployTimes` 的配置是否正确。
- 确保 `private_keys.txt` 文件中有足够的私钥支持部署。

### 问题 2：Gas 费用不足
**解决方法**：
- 检查账户余额是否足够支付每次部署的 Gas 费用。
- 确保 `gasLimit` 和 `gasPrice` 配置符合网络要求。

### 问题 3：私钥文件格式不正确
**解决方法**：
- 确保每行包含一个合法的私钥（以 `0x` 开头，64 位十六进制字符串）。

---

## 贡献说明

欢迎提交 Issues 或 Pull Requests 来改进本脚本。贡献者需遵守本项目的代码规范和贡献指南。

---

## 许可证

本项目使用 [MIT License](LICENSE) 进行授权，详情请查看 [LICENSE](LICENSE)。

---

## 联系支持

如果您在使用过程中遇到问题，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至 `support@example.com`
