# Solidity API

## LinkToken

### totalSupply

```solidity
uint256 totalSupply
```

### name

```solidity
string name
```

### decimals

```solidity
uint8 decimals
```

### symbol

```solidity
string symbol
```

### 

```solidity
undefined() public
```

### 

```solidity
undefined(address _to, uint256 _value, bytes _data) public returns (bool success)
```

_transfer token to a specified address with additional data if the recipient is a contract._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _to | address | The address to transfer to. |
| _value | uint256 | The amount to be transferred. |
| _data | bytes | The extra data to be passed to the receiving contract. |

### 

```solidity
undefined(address _to, uint256 _value) public returns (bool success)
```

_transfer token to a specified address._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _to | address | The address to transfer to. |
| _value | uint256 | The amount to be transferred. |

### 

```solidity
undefined(address _spender, uint256 _value) public returns (bool)
```

_Approve the passed address to spend the specified amount of tokens on behalf of msg.sender._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _spender | address | The address which will spend the funds. |
| _value | uint256 | The amount of tokens to be spent. |

### 

```solidity
undefined(address _from, address _to, uint256 _value) public returns (bool)
```

_Transfer tokens from one address to another_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _from | address | address The address which you want to send tokens from |
| _to | address | address The address which you want to transfer to |
| _value | uint256 | uint256 the amount of tokens to be transferred |

### validRecipient

```solidity
modifier validRecipient(address _recipient)
```

## BIXCIPLottery

### players

```solidity
address payable[] players
```

### playerBets

```solidity
mapping(address => uint256[]) playerBets
```

### playerWins

```solidity
mapping(address => uint256[]) playerWins
```

### playerEthWins

```solidity
mapping(address => uint256) playerEthWins
```

### lotteryId

```solidity
uint256 lotteryId
```

### lotteryHistory

```solidity
mapping(uint256 => address) lotteryHistory
```

### randomNumberGenerator

```solidity
contract IRandomNumberGenerator randomNumberGenerator
```

### s_randomWords

```solidity
uint256[] s_randomWords
```

### s_owner

```solidity
address s_owner
```

### ticketFee

```solidity
uint256 ticketFee
```

### winners

```solidity
address payable[] winners
```

### bixcipTreasury

```solidity
address payable bixcipTreasury
```

### LotteryState

```solidity
enum LotteryState {
  OPEN,
  CLOSED
}
```

### lotteryState

```solidity
enum BIXCIPLottery.LotteryState lotteryState
```

### startTime

```solidity
uint256 startTime
```

### timeFrame

```solidity
uint256 timeFrame
```

### constructor

```solidity
constructor(address _randomNumberGeneratorAddress, address _bixcipTreasury) public
```

### getWinnerByLottery

```solidity
function getWinnerByLottery(uint256 lottery) public view returns (address)
```

### getBalance

```solidity
function getBalance() public view returns (uint256)
```

### getPlayers

```solidity
function getPlayers() public view returns (address payable[])
```

### getRandomNumbers

```solidity
function getRandomNumbers() public view returns (uint256[])
```

### enter

```solidity
function enter(uint256[] _bets) public payable
```

### getPlayerBets

```solidity
function getPlayerBets(address _player) public view returns (uint256[])
```

### getPlayerWins

```solidity
function getPlayerWins(address _player) public view returns (uint256[])
```

### getTicketFee

```solidity
function getTicketFee() public view returns (uint256)
```

### setTicketFee

```solidity
function setTicketFee(uint256 _ticketFee) public
```

### setBixcipTreasury

```solidity
function setBixcipTreasury(address _bixcipTreasury) public
```

### setTimeFrame

```solidity
function setTimeFrame(uint256 _timeFrame) public
```

### pickWinners

```solidity
function pickWinners() public
```

### payWinners

```solidity
function payWinners() internal
```

### startLottery

```solidity
function startLottery() public
```

### closeLottery

```solidity
function closeLottery() public
```

### getLotteryState

```solidity
function getLotteryState() public view returns (enum BIXCIPLottery.LotteryState)
```

### getPlayerEthWins

```solidity
function getPlayerEthWins(address _player) public view returns (uint256)
```

### onlyOwner

```solidity
modifier onlyOwner()
```

### withinTime

```solidity
modifier withinTime()
```

## ILinkToken

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256 remaining)
```

### approve

```solidity
function approve(address spender, uint256 value) external returns (bool success)
```

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256 balance)
```

### decimals

```solidity
function decimals() external view returns (uint8 decimalPlaces)
```

### decreaseApproval

```solidity
function decreaseApproval(address spender, uint256 addedValue) external returns (bool success)
```

### increaseApproval

```solidity
function increaseApproval(address spender, uint256 subtractedValue) external
```

### name

```solidity
function name() external view returns (string tokenName)
```

### symbol

```solidity
function symbol() external view returns (string tokenSymbol)
```

### totalSupply

```solidity
function totalSupply() external view returns (uint256 totalTokensIssued)
```

### transfer

```solidity
function transfer(address to, uint256 value) external returns (bool success)
```

### transferAndCall

```solidity
function transferAndCall(address to, uint256 value, bytes data) external returns (bool success)
```

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 value) external returns (bool success)
```

## Migrations

### owner

```solidity
address owner
```

### last_completed_migration

```solidity
uint256 last_completed_migration
```

### restricted

```solidity
modifier restricted()
```

### constructor

```solidity
constructor() public
```

### setCompleted

```solidity
function setCompleted(uint256 completed) public
```

## RandomNumberGenerator

### COORDINATOR

```solidity
contract VRFCoordinatorV2Interface COORDINATOR
```

### LINKTOKEN

```solidity
contract LinkTokenInterface LINKTOKEN
```

### s_subscriptionId

```solidity
uint64 s_subscriptionId
```

### keyHash

```solidity
bytes32 keyHash
```

### callbackGasLimit

```solidity
uint32 callbackGasLimit
```

### requestConfirmations

```solidity
uint16 requestConfirmations
```

### numWords

```solidity
uint32 numWords
```

### s_randomWords

```solidity
uint256[] s_randomWords
```

### s_requestId

```solidity
uint256 s_requestId
```

### s_owner

```solidity
address s_owner
```

### constructor

```solidity
constructor(address _vrfCoordinator, bytes32 _keyHash, address _linkToken, uint32 _numWords) public
```

### requestRandomWords

```solidity
function requestRandomWords() external
```

### createNewSubscription

```solidity
function createNewSubscription() private
```

### topupSubscription

```solidity
function topupSubscription(uint256 amount) external
```

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256, uint256[] randomWords) internal
```

### getRandomWords

```solidity
function getRandomWords() external view returns (uint256[])
```

### getSubscriptionBalance

```solidity
function getSubscriptionBalance() external view returns (uint96)
```

### getSubscriptionId

```solidity
function getSubscriptionId() external view returns (uint64)
```

### onlyOwner

```solidity
modifier onlyOwner()
```

## VRFCoordinatorV2Mock

### BASE_FEE

```solidity
uint96 BASE_FEE
```

### GAS_PRICE_LINK

```solidity
uint96 GAS_PRICE_LINK
```

### MAX_CONSUMERS

```solidity
uint16 MAX_CONSUMERS
```

### InvalidSubscription

```solidity
error InvalidSubscription()
```

### InsufficientBalance

```solidity
error InsufficientBalance()
```

### MustBeSubOwner

```solidity
error MustBeSubOwner(address owner)
```

### TooManyConsumers

```solidity
error TooManyConsumers()
```

### InvalidConsumer

```solidity
error InvalidConsumer()
```

### InvalidRandomWords

```solidity
error InvalidRandomWords()
```

### RandomWordsRequested

```solidity
event RandomWordsRequested(bytes32 keyHash, uint256 requestId, uint256 preSeed, uint64 subId, uint16 minimumRequestConfirmations, uint32 callbackGasLimit, uint32 numWords, address sender)
```

### RandomWordsFulfilled

```solidity
event RandomWordsFulfilled(uint256 requestId, uint256 outputSeed, uint96 payment, bool success)
```

### SubscriptionCreated

```solidity
event SubscriptionCreated(uint64 subId, address owner)
```

### SubscriptionFunded

```solidity
event SubscriptionFunded(uint64 subId, uint256 oldBalance, uint256 newBalance)
```

### SubscriptionCanceled

```solidity
event SubscriptionCanceled(uint64 subId, address to, uint256 amount)
```

### ConsumerAdded

```solidity
event ConsumerAdded(uint64 subId, address consumer)
```

### ConsumerRemoved

```solidity
event ConsumerRemoved(uint64 subId, address consumer)
```

### s_currentSubId

```solidity
uint64 s_currentSubId
```

### s_nextRequestId

```solidity
uint256 s_nextRequestId
```

### s_nextPreSeed

```solidity
uint256 s_nextPreSeed
```

### Subscription

```solidity
struct Subscription {
  address owner;
  uint96 balance;
}
```

### s_subscriptions

```solidity
mapping(uint64 => struct VRFCoordinatorV2Mock.Subscription) s_subscriptions
```

### s_consumers

```solidity
mapping(uint64 => address[]) s_consumers
```

### Request

```solidity
struct Request {
  uint64 subId;
  uint32 callbackGasLimit;
  uint32 numWords;
}
```

### s_requests

```solidity
mapping(uint256 => struct VRFCoordinatorV2Mock.Request) s_requests
```

### constructor

```solidity
constructor(uint96 _baseFee, uint96 _gasPriceLink) public
```

### consumerIsAdded

```solidity
function consumerIsAdded(uint64 _subId, address _consumer) public view returns (bool)
```

### onlyValidConsumer

```solidity
modifier onlyValidConsumer(uint64 _subId, address _consumer)
```

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256 _requestId, address _consumer) public
```

fulfillRandomWords fulfills the given request, sending the random words to the supplied
consumer.

_This mock uses a simplified formula for calculating payment amount and gas usage, and does
not account for all edge cases handled in the real VRF coordinator. When making requests
against the real coordinator a small amount of additional LINK is required._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _requestId | uint256 | the request to fulfill |
| _consumer | address | the VRF randomness consumer to send the result to |

### fulfillRandomWordsWithOverride

```solidity
function fulfillRandomWordsWithOverride(uint256 _requestId, address _consumer, uint256[] _words) public
```

fulfillRandomWordsWithOverride allows the user to pass in their own random words.

| Name | Type | Description |
| ---- | ---- | ----------- |
| _requestId | uint256 | the request to fulfill |
| _consumer | address | the VRF randomness consumer to send the result to |
| _words | uint256[] | user-provided random words |

### fundSubscription

```solidity
function fundSubscription(uint64 _subId, uint96 _amount) public
```

fundSubscription allows funding a subscription with an arbitrary amount for testing.

| Name | Type | Description |
| ---- | ---- | ----------- |
| _subId | uint64 | the subscription to fund |
| _amount | uint96 | the amount to fund |

### requestRandomWords

```solidity
function requestRandomWords(bytes32 _keyHash, uint64 _subId, uint16 _minimumRequestConfirmations, uint32 _callbackGasLimit, uint32 _numWords) external returns (uint256)
```

### createSubscription

```solidity
function createSubscription() external returns (uint64 _subId)
```

Create a VRF subscription.

_You can manage the consumer set dynamically with addConsumer/removeConsumer.
Note to fund the subscription, use transferAndCall. For example
 LINKTOKEN.transferAndCall(
   address(COORDINATOR),
   amount,
   abi.encode(subId));_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _subId | uint64 |  |

### getSubscription

```solidity
function getSubscription(uint64 _subId) external view returns (uint96 balance, uint64 reqCount, address owner, address[] consumers)
```

### cancelSubscription

```solidity
function cancelSubscription(uint64 _subId, address _to) external
```

### onlySubOwner

```solidity
modifier onlySubOwner(uint64 _subId)
```

### getRequestConfig

```solidity
function getRequestConfig() external pure returns (uint16, uint32, bytes32[])
```

Get configuration relevant for making requests

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint16 | minimumRequestConfirmations global min for request confirmations |
| [1] | uint32 | maxGasLimit global max for request gas limit |
| [2] | bytes32[] | s_provingKeyHashes list of registered key hashes |

### addConsumer

```solidity
function addConsumer(uint64 _subId, address _consumer) external
```

### onTokenTransfer

```solidity
function onTokenTransfer(address sender, uint256 fee, bytes _data) public
```

### removeConsumer

```solidity
function removeConsumer(uint64 _subId, address _consumer) external
```

### requestSubscriptionOwnerTransfer

```solidity
function requestSubscriptionOwnerTransfer(uint64 _subId, address _newOwner) external pure
```

### acceptSubscriptionOwnerTransfer

```solidity
function acceptSubscriptionOwnerTransfer(uint64 _subId) external pure
```

### pendingRequestExists

```solidity
function pendingRequestExists(uint64 subId) public view returns (bool)
```

