// SPDX-License-Identifier: UNLICENSED
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.7;

import "../interfaces/IRandomNumberGenerator.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BIXCIPLottery {
    address payable[] public players;
    mapping(address => uint256[]) playerBets;
    mapping(address => uint256[]) playerWins;
    uint256 public lotteryId;
    mapping(uint256 => address) public lotteryHistory;
    IRandomNumberGenerator randomNumberGenerator;
    uint256[] public s_randomWords;
    address s_owner;
    uint256 public ticketFee = 0.01 ether;
    address payable[] public winners;
    enum LotteryState {
        OPEN,
        CLOSED
    }
    uint256 public prizeMoney;

    LotteryState lotteryState;

    constructor(address _randomNumberGeneratorAddress, uint256 _prizeMoney) {
        s_owner = msg.sender;
        prizeMoney = _prizeMoney;
        lotteryId = 1;
        randomNumberGenerator = IRandomNumberGenerator(
            _randomNumberGeneratorAddress
        );
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

    function enter(uint256[] memory _bets) public payable {
        uint256 totalTickets = _bets.length;
        require(
            msg.value >= (0.01 ether * totalTickets),
            "Insufficient amount"
        );

        require(lotteryState == LotteryState.OPEN, "The lottery is closed");

        playerBets[msg.sender] = _bets;

        while (totalTickets > 0) {
            players.push(payable(msg.sender));
            totalTickets--;
        }
    }

    function getPlayerBets(address _player)
        public
        view
        returns (uint256[] memory)
    {
        return playerBets[_player];
    }

    function getPlayerWins(address _player)
        public
        view
        returns (uint256[] memory)
    {
        return playerWins[_player];
    }

    function getTicketFee() public view returns (uint256) {
        return ticketFee;
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
            uint256 amount = prizeMoney / winners.length;
            winners[i].transfer(amount);
            lotteryHistory[lotteryId] = winners[i];
            lotteryId++;
            playerWins[winners[i]] = playerBets[winners[i]];
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
