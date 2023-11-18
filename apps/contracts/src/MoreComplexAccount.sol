// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@account-abstraction/contracts/samples/callback/TokenCallbackHandler.sol";

import "./SessionManager.sol";

contract ComplexAccount is BaseAccount, TokenCallbackHandler, UUPSUpgradeable, Initializable, SessionManager {
    using ECDSA for bytes32;

    address public owner;

    IEntryPoint private immutable _entryPoint;

    event SimpleAccountInitialized(IEntryPoint indexed entryPoint, address indexed owner);
    event Invoked(address indexed target, uint256 value, bytes data);

    /**
     * @dev A batch of transactions executed by low-level call successfully.
     */
    event BatchInvoked(address[] target, uint256 value, bytes[] data);

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    /// @inheritdoc BaseAccount
    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    constructor(IEntryPoint anEntryPoint) {
        _entryPoint = anEntryPoint;
        _disableInitializers();
    }

    function _onlyOwner() internal view {
        //directly from EOA owner, or through the account itself (which gets redirected through execute())
        require(msg.sender == owner || msg.sender == address(this), "only owner");
    }

    /**
     * execute a transaction (called directly from owner, or by entryPoint)
     */
    function execute(address dest, uint256 value, bytes calldata func) external {
        bool isSession = _requireFromEntryPointOrOwnerOrSessionOwner();
        _call(dest, value, func);

        if (isSession) {
            Session storage session = sessions[msg.sender];
            address allowedDest = session.dest[session.nextStep];
            bytes memory allowedData = session.data[session.nextStep];
            require(dest == allowedDest, "SM: Forbidden target");
            require(keccak256(func) == keccak256(allowedData), "SM: Forbidden calldata");
            if (session.nextStep + 1 >= session.nbSteps) {
                // _removeSession(msg.sender);
            } else {
                session.nextStep++;
            }
        }

        emit Invoked(dest, value, func);
    }

    /**
     * execute a sequence of transactions
     * @dev to reduce gas consumption for trivial case (no value), use a zero-length array to mean zero value
     */
    function executeBatch(address[] calldata dest, uint256[] calldata value, bytes[] calldata func) external {
        uint256 totalAmountSpent = 0;
        if (value.length == 0) {
            for (uint256 i = 0; i < dest.length; i++) {
                totalAmountSpent += value[i];
            }
        }
        bool isSession = _requireFromEntryPointOrOwnerOrSessionOwner();
        require(dest.length == func.length && (value.length == 0 || value.length == func.length), "wrong array lengths");
        if (value.length == 0) {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], 0, func[i]);
            }
        } else {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], value[i], func[i]);
            }
        }
        emit BatchInvoked(dest, totalAmountSpent, func);
    }

    /**
     * execute a transaction (called directly from owner, or by entryPoint)
     */
    function addSession(address _sessionUser, uint256 _nbSteps, address[] memory _dest, bytes[] memory _data)
        external
    {
        _requireFromEntryPointOrOwner();
        _addSession(_sessionUser, _nbSteps, _dest, _data);
    }

    function removeSession(address sessionUser) external {
        _requireFromEntryPointOrOwner();
        _removeSession(sessionUser);
    }

    /**
     * @dev The _entryPoint member is immutable, to reduce gas consumption.  To upgrade EntryPoint,
     * a new implementation of SimpleAccount must be deployed with the new EntryPoint address, then upgrading
     * the implementation by calling `upgradeTo()`
     */
    function initialize(address anOwner) public virtual initializer {
        _initialize(anOwner);
    }

    function _initialize(address anOwner) internal virtual {
        owner = anOwner;
        emit SimpleAccountInitialized(_entryPoint, owner);
    }

    // Require the function call went through EntryPoint or owner
    function _requireFromEntryPointOrOwner() internal view {
        require(msg.sender == address(entryPoint()) || msg.sender == owner, "account: not Owner or EntryPoint");
    }

    function _requireFromEntryPointOrOwnerOrSessionOwner() internal view returns (bool isSession) {
        if (msg.sender == address(entryPoint()) || msg.sender == owner) return false;
        return true;
    }

    /// implement template method of BaseAccounts
    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
        internal
        virtual
        override
        returns (uint256 validationData)
    {
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        if (userOp.signature.length == 65) {
            if (owner == hash.recover(userOp.signature)) return 0;
            else return SIG_VALIDATION_FAILED;
        }
        address sessionUser = address(bytes20(userOp.signature[0:20]));
        bytes memory sessionSignature = userOp.signature[20:];
        if (sessionUser != hash.recover(sessionSignature)) return SIG_VALIDATION_FAILED;
        return 0;
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    /**
     * check current account deposit in the entryPoint
     */
    function getDeposit() public view returns (uint256) {
        return entryPoint().balanceOf(address(this));
    }

    /**
     * deposit more funds for this account in the entryPoint
     */
    function addDeposit() public payable {
        entryPoint().depositTo{value: msg.value}(address(this));
    }

    /**
     * withdraw value from the account's deposit
     * @param withdrawAddress target to send to
     * @param amount to withdraw
     */
    function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
        entryPoint().withdrawTo(withdrawAddress, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal view override {
        (newImplementation);
        _onlyOwner();
    }
}
