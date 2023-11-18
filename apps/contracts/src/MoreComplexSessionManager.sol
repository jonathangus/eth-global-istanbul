// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

abstract contract MoreComplexSessionManager {
    event SessionCreated(address _sessionUser, uint256 _nbSteps, address[] dest, bytes[] data);
    event SessionRemoved(address indexed sessionUser);

    struct Session {
        uint256 nbSteps;
        uint256 nextStep;
        address[] dest;
        bytes[] data;
    }

    mapping(address => Session) internal sessions;

    function _addSession(address _sessionUser, uint256 _nbSteps, address[] memory _dest, bytes[] memory _data)
        internal
    {
        require(_sessionUser != address(0), "SM: Invalid session user");
        require(_dest.length == _data.length, "SM: invalid params");
        require(_dest.length == _nbSteps, "SM: invalid params");
        sessions[_sessionUser] = Session(_nbSteps, 0, _dest, _data);
        emit SessionCreated(_sessionUser, _nbSteps, _dest, _data);
    }

    function _removeSession(address _sessionUser) internal {
        delete sessions[_sessionUser];
        emit SessionRemoved(_sessionUser);
    }

    function getSession(address _sessionUser) public view returns (Session memory) {
        return sessions[_sessionUser];
    }
}
