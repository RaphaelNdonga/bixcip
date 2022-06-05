// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BIIX is ERC20 {
    constructor(uint256 _initialSupply, address[] memory _investors)
        ERC20("BIXCIP Token", "BIIX")
    {
        for (uint256 i = 0; i < _investors.length; i++) {
            uint256 amount = _initialSupply / _investors.length;
            _mint(_investors[i], amount);
        }
    }
}
