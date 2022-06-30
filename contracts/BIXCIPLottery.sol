// SPDX-License-Identifier: UNLICENSED
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.7;

import "../interfaces/IRandomNumberGenerator.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BIXCIPLottery {
    address payable[] public players;
    uint256 public lotteryId;
    mapping(uint256 => address) public lotteryHistory;
    IRandomNumberGenerator randomNumberGenerator;
    uint256[] public s_randomWords;
    address s_owner;
    address public biixToken;
    uint256 public biixPerEth = 1000;
    uint256 public ticketFee = 100 ether;
    address[] public winners;
    enum LotteryState {
        OPEN,
        CLOSED
    }

    LotteryState lotteryState;

    constructor(address _randomNumberGeneratorAddress, address _biixToken) {
        s_owner = msg.sender;
        lotteryId = 1;
        randomNumberGenerator = IRandomNumberGenerator(
            _randomNumberGeneratorAddress
        );
        biixToken = _biixToken;
        startLottery();
    }

    function getWinnerByLottery(uint256 lottery) public view returns (address) {
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

    function enter() public {
        IERC20(biixToken).transferFrom(msg.sender, address(this), ticketFee);

        require(lotteryState == LotteryState.OPEN, "The lottery is closed");

        players.push(payable(msg.sender));
    }

    function sendBIIX(uint256 amount) public payable {
        require(
            msg.value >= convertBIIXToEth(amount),
            "BIXCIPLottery: Ether sent was not enough for BIIX"
        );
        IERC20(biixToken).transfer(msg.sender, amount);
    }

    function convertBIIXToEth(uint256 amount) public view returns (uint256) {
        return amount / biixPerEth;
    }

    function getTicketFee() public view returns (uint256) {
        return ticketFee;
    }

    function getBIIXPerEthValue() public view returns (uint256) {
        return biixPerEth;
    }

    function setBIIXPerEthValue(uint256 _biixPerEth) public onlyOwner {
        biixPerEth = _biixPerEth;
    }

    function setTicketFee(uint256 _ticketFee) public onlyOwner {
        ticketFee = _ticketFee;
    }

    function pickWinners() public onlyOwner {
        randomNumberGenerator.requestRandomWords();
        s_randomWords = randomNumberGenerator.getRandomWords();
        for (uint96 i = 0; i < s_randomWords.length; i++) {
            uint256 randomResult = s_randomWords[i];
            require(
                randomResult > 0,
                "BIXCIPLottery: Must have a source of randomness before choosing winner"
            );
            uint256 index = randomResult % players.length;
            winners.push(players[index]);
        }
    }

    function payWinners() public onlyOwner {
        require(
            s_randomWords.length > 0,
            "BIXCIPLottery: The random number has not yet been generated"
        );

        for (uint96 i = 0; i < winners.length; i++) {
            uint256 amount = IERC20(biixToken).balanceOf((address(this))) /
                winners.length;
            IERC20(biixToken).transfer(winners[i], amount);
            lotteryHistory[lotteryId] = winners[i];
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
