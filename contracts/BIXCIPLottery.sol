// SPDX-License-Identifier: UNLICENSED
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.7;

import "../interfaces/IRandomNumberGenerator.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BIXCIPLottery {
    address payable[] public players;
    mapping(address => uint256[]) playerBets;
    mapping(address => uint256[]) playerWins;
    mapping(address => uint256) public playerEthWins;
    uint256 public lotteryId;
    mapping(uint256 => address) public lotteryHistory;
    IRandomNumberGenerator randomNumberGenerator;
    uint256[] public s_randomWords;
    address s_owner;
    uint256 public ticketFee = 0.01 ether;
    address payable[] public winners;
    address payable public bixcipTreasury;
    enum LotteryState {
        OPEN,
        CLOSED
    }
    uint256 public prizeMoney;

    LotteryState lotteryState;

    constructor(address _randomNumberGeneratorAddress, uint256 _prizeMoney) {
        s_owner = msg.sender;
        bixcipTreasury = payable(
            address(0x0Db28FC3d9Cd8AA96C932a9fA30940F90Eac2206)
        );
        prizeMoney = _prizeMoney;
        lotteryId = 1;
        randomNumberGenerator = IRandomNumberGenerator(
            _randomNumberGeneratorAddress
        );
        randomNumberGenerator.requestRandomWords();
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

        uint256[] storage previousBets = playerBets[msg.sender];

        while (totalTickets > 0) {
            uint256 value = _bets[totalTickets - 1];
            previousBets.push(value);
            players.push(payable(msg.sender));
            totalTickets--;
        }
        playerBets[msg.sender] = previousBets;
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
        s_randomWords = randomNumberGenerator.getRandomWords();
        require(
            s_randomWords.length > 0,
            "Random numbers have not yet been generated"
        );
        for (uint96 i = 0; i < s_randomWords.length; i++) {
            uint256 randomResult = s_randomWords[i];
            uint256 index = randomResult % players.length;
            winners.push(players[index]);

            uint256[] memory previousWins = playerWins[players[index]];
            uint256[] storage newWins = playerBets[players[index]];

            for (uint256 j = 0; j < previousWins.length; j++) {
                newWins.push(previousWins[j]);
            }
            playerWins[players[index]] = newWins;
        }
        payWinners();
    }

    function payWinners() internal {
        require(
            s_randomWords.length > 0,
            "BIXCIPLottery: The random number has not yet been generated"
        );

        for (uint96 i = 0; i < winners.length; i++) {
            uint256 amount = address(this).balance / 10;
            winners[i].transfer(amount);
            playerEthWins[winners[i]] = amount;
            lotteryHistory[lotteryId] = winners[i];
            lotteryId++;
        }

        bixcipTreasury.transfer(address(this).balance);

        // reset the state of the contract
        for (uint96 i = 0; i < players.length; i++) {
            delete playerBets[players[i]];
        }
        players = new address payable[](0);
        winners = new address payable[](0);
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
