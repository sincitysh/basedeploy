// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MyContract {
    string public message;

    constructor(string memory _message) {
        message = _message;
    }
}

