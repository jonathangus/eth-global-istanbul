/* 
forge script script/deploy-account-factory.s.sol:DeployComplexAccountFactory --rpc-url scroll-sepolia
forge script script/deploy-account-factory.s.sol:DeployComplexAccountFactory --rpc-url scroll-sepolia --broadcast --verify
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";

import {MockERC20} from "mock/MockERC20.sol";
import {MockERC721} from "mock/MockERC721.sol";

contract DeployMock is Script {
    function run() external {
        // Account to deploy from
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Mock Contracts
        new MockERC20();
        new MockERC721();

        vm.stopBroadcast();
    }
}

// Verify on Linea Goerli

/*
forge verify-contract \
    --chain-id 59140 \
    --num-of-optimizations 200 \
    --watch \
    --etherscan-api-key A2S2FFQ3VQHJWSGBU5UTT9UCIBJ2MZYA4P \
    --compiler-version v0.8.20+commit.a1b79de6 \
    --constructor-args "0x0000000000000000000000005ff137d4b0fdcd49dca30c7cf57e578a026d2789" \
    0x3e6a716eae6c65171a79c6f532f6b4706aaa2e03 \
    src/ComplexAccountFactory.sol:ComplexAccountFactory
*/

// Verify on Scroll Sepolia

/*
forge verify-contract \
    --chain-id 534351 \
    --num-of-optimizations 200 \
    --watch \
    --etherscan-api-key NQ5BXVFAMPVY5XXADFTKDIZBUST41UHSUG \
    --compiler-version v0.8.20+commit.a1b79de6 \
    --constructor-args "0x0000000000000000000000005ff137d4b0fdcd49dca30c7cf57e578a026d2789" \
    0x3e6a716eae6c65171a79c6f532f6b4706aaa2e03 \
    src/ComplexAccountFactory.sol:ComplexAccountFactory
*/
