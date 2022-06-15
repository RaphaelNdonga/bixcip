// SPDX-License-Identifier: UNLICENSED
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.7;

import "../interfaces/IRandomNumberGenerator.sol";
import "hardhat/console.sol";

contract BIXCIPLottery {
    address payable[] public players;
    uint256 public lotteryId;
    mapping(uint256 => address payable) public lotteryHistory;
    IRandomNumberGenerator randomNumberGenerator;
    uint256[] public s_randomWords;
    address s_owner;
    enum LotteryState {
        OPEN,
        CLOSED
    }

    LotteryState lotteryState;

    constructor(address randomNumberGeneratorAddress) {
        s_owner = msg.sender;
        lotteryId = 1;
        randomNumberGenerator = IRandomNumberGenerator(
            randomNumberGeneratorAddress
        );
        startLottery();
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

    function getRandomNumbers() public view returns (uint256[] memory) {
        return s_randomWords;
    }

    function enter() public payable {
        require(msg.value > .01 ether, "Insufficient amount");

        require(lotteryState == LotteryState.OPEN, "The lottery is closed");

        players.push(payable(msg.sender));
    }

    function pickWinners() public onlyOwner {
        randomNumberGenerator.requestRandomWords();
        s_randomWords = randomNumberGenerator.getRandomWords();
    }

    function payWinners() public onlyOwner {
        require(
            s_randomWords.length > 0,
            "The random number has not yet been generated"
        );

        for (uint96 i = 0; i < s_randomWords.length; i++) {
            uint256 randomResult = s_randomWords[i];
            require(
                randomResult > 0,
                "Must have a source of randomness before choosing winner"
            );
            uint256 index = randomResult % players.length;
            uint256 amount = address(this).balance / s_randomWords.length;
            players[index].transfer(amount);

            lotteryHistory[lotteryId] = players[index];
            lotteryId++;
        }

        // reset the state of the contract
        players = new address payable[](0);
        s_randomWords = new uint256[](0);
        closeLottery();
    }

    function startLottery() public onlyOwner {
        lotteryState = LotteryState.OPEN;
    }

    function closeLottery() public onlyOwner {
        console.log("Closing the lottery");
        lotteryState = LotteryState.CLOSED;
    }

    function getLotteryState() public view returns (LotteryState) {
        return lotteryState;
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }
}
