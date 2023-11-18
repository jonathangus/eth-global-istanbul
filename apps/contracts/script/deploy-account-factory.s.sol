/* 
forge script script/deploy-account-factory.s.sol:DeployComplexAccountFactory --rpc-url linea-testnet
forge script script/deploy-account-factory.s.sol:DeployComplexAccountFactory --rpc-url linea-testnet --broadcast --verify
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";

import {ComplexAccountFactory} from "src/ComplexAccountFactory.sol";
import {IEntryPoint} from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";

contract DeployComplexAccountFactory is Script {
    function run() external {
        // Account to deploy from
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        address LINEA_ENTRY_POINT = 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789;

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Implementation Contracts
        new ComplexAccountFactory(IEntryPoint(LINEA_ENTRY_POINT));

        vm.stopBroadcast();
    }
}
