/* 
forge script script/deploy-account-factory.s.sol:DeploySimpleAccountFactory --rpc-url base
forge script script/deploy-account-factory.s.sol:DeploySimpleAccountFactory --rpc-url base --broadcast --verify
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";

import {SimpleAccountFactory} from "src/SimpleAccountFactory.sol";

contract DeploySimpleAccountFactory is Script {
    function run() external {
        // Account to deploy from
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        address public constant LINEA_ENTRY_POINT =0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789;

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Implementation Contracts
        new SimpleAccountFactory(LINEA_ENTRY_POINT);

        vm.stopBroadcast();
    }
}
