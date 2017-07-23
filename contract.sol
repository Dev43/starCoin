pragma solidity ^0.4.11;
import './SafeMath.sol';
contract ReviewToken {
    using SafeMath for uint256;

    uint8 public constant decimals = 18;
    string public constant name = "Rev Token";
    string public constant symbol = "STAR";

    uint256 public totalSupply = 10000000; // 10 million total supply

    mapping (address => mapping (address => uint256)) public approvals; // approval allotments

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    address public owner;
    mapping (address => bytes32) public voteCommits; // Commit associated with the product
    mapping (address => uint256) public productTime; // Time of product registration
    mapping (address => address) public reviews; // Product review

    mapping(address => uint256) public balances; // balance of Review Tokens

    // Events used to log what's going on in the contract
    event logAddress(string, address);
    event logReview(string, uint256);

    // to call constructor via console, append the input in hex + pad to 256 bytes
    // function ReviewToken(address _owner) {
    //     owner = _owner;
    //     logAddress('Owner', owner);
    // }

    /* Merchant registers product + with a commit reveal scheme to prevent censorship */
    function register (address _product, bytes32 _voteCommit) returns (bool success) {
        //require(msg.sender == owner); // must own the contract to register _product

        productTime[_product] = now;
        voteCommits[_product] = _voteCommit;
        logAddress('Registered', _product);
        return true;
    }


    /* Reviewer must submit product address, review address (IPFS hashing) and vote string */
    function review(address _product, address _review, string _vote) returns (bool success) {
        assert(productTime[_product] <= now - 60 seconds); // can only review after x time
        assert(voteCommits[_product] == keccak256(_vote)); // _vote must match commit

        reviews[_product] = _review;
        balances[msg.sender].safeAdd(1);
        logReview('Review recorded, new balance: ', balances[msg.sender]);
        return true;
    }

    function getReview(address _product) returns (address content) {
        require(reviews[_product] != address(0x0)); // there must be a review for that address
        return reviews[_product];
    }

    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }

    // All code below is related for tokens
    function deposit () payable returns (bool success) {
        require(msg.value != 0);
        balances[msg.sender] = balances[msg.sender].safeAdd(msg.value);
        totalSupply = totalSupply.safeAdd(msg.value);
        return true;
    }

    function withdraw (uint256 amount) returns (bool success) {
        require(amount != 0);
        require(balances[msg.sender] >= amount);
        balances[msg.sender] = balances[msg.sender].safeSubtract(amount);
        bool rv = msg.sender.send(amount);
        if (!rv) {
          balances[msg.sender] = balances[msg.sender].safeAdd(amount);
        }
        return rv;
    }

    // /* send _value amount of tokens to _to */
    function transfer (address _to, uint256 _value) returns (bool success) {
        require(_value != 0);
        require(balances[msg.sender] >= _value);
        balances[msg.sender] = balances[msg.sender].safeSubtract(_value);
        balances[_to] = balances[_to].safeAdd(_value);
        Transfer(msg.sender, _to, _value);
        return true;
    }

    /* send _value amount of tokens from address _from to address _to */
    function transferFrom (address _from, address _to, uint256 _value) returns (bool success) {
        require(_value != 0);
        require(msg.sender != _from);
        require(balances[_from] >= _value);
        assert(allowance(_from, msg.sender) >= _value);
        approvals[_from][msg.sender] = approvals[_from][msg.sender].safeSubtract(_value);
        balances[_from] = balances[_from].safeSubtract( _value);
        balances[_to] = balances[_to].safeAdd(_value);
        Transfer(_from, _to, _value);
        return true;
    }

    /* allow _spender to withdraw from your account. overwrites _value */
    function approve (address _spender, uint256 _value) returns (bool success) {
        require(msg.sender != _spender);
        approvals[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    /* returns the amount which _spender is still allowed to withdraw from _owner */
    function allowance (address _owner, address _spender) constant returns (uint256 remaining) {
        return approvals[_owner][_spender];
    }
}
