// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract RandomNumberGenerator is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 keyHash;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords;

    uint256[] public s_randomWords;
    uint256 public s_requestId;
    address s_owner;

    constructor(
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint32 _numWords
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        keyHash = _keyHash;
        numWords = _numWords;
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        s_owner = msg.sender;
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() external {
        // Will revert if subscription is not set and funded.
        s_requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    function createNewSubscription() external {
        address memory consumers = new address[](1);
        consumers[0] = address(this);
        s_subscriptionId = COORDINATOR.createSubscription();
        COORDINATOR.addConsumer(s_subscriptionId, consumers[0]);
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        s_randomWords = randomWords;
    }

    function getRandomWords() external view returns (uint256[] memory) {
        return s_randomWords;
    }

    function getSubscriptionId() external view returns (uint256) {
        return s_subscriptionId;
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }
}
