// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.14;

import { ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import { ISuperfluid } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

contract Streamfi {

    using SuperTokenV1Library for ISuperToken;

    ISuperToken public goerlifDAIx = ISuperToken(0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00);
    IERC20 public goerlifDAI = IERC20(0x88271d333C72e51516B67f5567c728E702b3eeE8);
    address[] public path = [0x88271d333C72e51516B67f5567c728E702b3eeE8,0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6];

    address public constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    IUniswapV2Router private router = IUniswapV2Router(UNISWAP_V2_ROUTER);

    struct Streamer {
        int96 flowRate;
        uint lastTimestamp;
        uint WETHGotTillNow;
        uint fDAIConvertedTillNow;
    }

    uint256 public numStreamers;

    mapping (address => Streamer) public StreamerDetails;
    address[] public Streamers;

    function getSwappedTokens(address sender) public view returns(uint[2] memory) {
        return [StreamerDetails[sender].WETHGotTillNow, StreamerDetails[sender].fDAIConvertedTillNow];
    }

    function startFlow(int96 flowRate) public {
        // int96 newFlowRate = flowRate*1e18/(3600*24*30);
        if (StreamerDetails[msg.sender].flowRate == 0) {
            Streamers.push(msg.sender);
            numStreamers++;
            StreamerDetails[msg.sender].flowRate = flowRate;
            StreamerDetails[msg.sender].lastTimestamp = block.timestamp;
            goerlifDAIx.createFlowFrom(msg.sender, address(this), flowRate);
        }
        
    }

    function getTimestamp() public view returns(uint){
        return block.timestamp;
    }

    function getfDAIxBalance() external view returns(uint256) {
        return goerlifDAIx.balanceOf(address(this));
    }

    function getfDAIBalance() external view returns(uint256) {
        return goerlifDAI.balanceOf(address(this));
    }

    function unwrap(uint256 amount) internal {
        // Unwrap the fDAIx into fDAI
        goerlifDAIx.downgrade(amount);
    }

    function calculateAmount(address sender) view public returns(uint) {
        return (block.timestamp-StreamerDetails[sender].lastTimestamp)*uint96(StreamerDetails[sender].flowRate);
    }

    function _swapTokens() public {
        unwrap(goerlifDAIx.balanceOf(address(this)));
        for(uint i = 0; i < numStreamers; i++) {
            uint currBal = calculateAmount(Streamers[i]);
            goerlifDAI.approve(address(router), currBal);
            uint lastInPath = path.length - 1;
            uint amountBought = router.swapExactTokensForTokens(currBal, 1, path, Streamers[i], block.timestamp)[lastInPath];
            StreamerDetails[Streamers[i]].lastTimestamp = block.timestamp;
            StreamerDetails[Streamers[i]].WETHGotTillNow += amountBought;
            StreamerDetails[Streamers[i]].fDAIConvertedTillNow += currBal;
        }
    }

    function manualSwap() public {
        uint currBal = calculateAmount(msg.sender);
        unwrap(currBal);
        goerlifDAI.approve(address(router), currBal);
        uint lastInPath = path.length - 1;
        uint amountBought = router.swapExactTokensForTokens(currBal, 1, path, msg.sender, block.timestamp)[lastInPath];
        StreamerDetails[msg.sender].lastTimestamp = block.timestamp;
        StreamerDetails[msg.sender].WETHGotTillNow += amountBought;
        StreamerDetails[msg.sender].fDAIConvertedTillNow += currBal;
    }
}

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapExactTokensForETH(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}