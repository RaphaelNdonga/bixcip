// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.7;

import "../interfaces/IRandomNumberGenerator.sol";

contract BIXCIPLottery {
    address payable[] public players;
    uint256 public lotteryId;
    mapping(uint256 => address payable) public lotteryHistory;
    IRandomNumberGenerator randomNumberGenerator;
    uint256[] public s_randomWords;
    address s_owner;

    constructor(address randomNumberGeneratorAddress) {
        s_owner = msg.sender;
        lotteryId = 1;
        randomNumberGenerator = IRandomNumberGenerator(
            randomNumberGeneratorAddress
        );
    }

    function getWinnerByLottery(uint256 lottery)
        public
        view
        returns (address payable)
    {
        return lotteryHistory[lottery];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value > .01 ether);

        // address of player entering lottery
        players.push(payable(msg.sender));
    }

    function pickWinner() public onlyOwner {
        randomNumberGenerator.requestRandomWords();
        // getRandomNumber();
    }

    function payWinner() public {
        s_randomWords = randomNumberGenerator.getRandomWords();
        require(
            s_randomWords.length > 0,
            "The random number has not yet been generated"
        );
        uint256 randomResult = s_randomWords[0];
        require(
            randomResult > 0,
            "Must have a source of randomness before choosing winner"
        );
        uint256 index = randomResult % players.length;
        players[index].transfer(address(this).balance);

        lotteryHistory[lotteryId] = players[index];
        lotteryId++;

        // reset the state of the contract
        players = new address payable[](0);
        randomResult = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }
}
