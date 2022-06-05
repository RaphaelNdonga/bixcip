// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

interface IRandomNumberGenerator {
    function requestRandomWords() external;

    function getRandomWords() external view returns (uint256[] memory);
}
