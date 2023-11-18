// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract MockERC721 is ERC721PresetMinterPauserAutoId {
    uint256 public totalMinted = 0;

    constructor() ERC721PresetMinterPauserAutoId("mock721", "MOCK721", "") {}

    function mint(address _to) public override {
        _mint(_to, totalMinted);
        totalMinted++;
    }

    function mintMultiple(address _to, uint256 _quantity) public {
        for (uint256 i = 0; i < _quantity; i++) {
            _mint(_to, totalMinted);
            totalMinted++;
        }
    }
}
