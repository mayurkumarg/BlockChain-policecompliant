// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PoliceComplaintSystem {
    struct Complaint {
        string id;
        string ipfsHash;
        string status;
        uint256 timestamp;
    }

    mapping(string => Complaint) public complaints;
    string[] public complaintIds;

    event ComplaintAdded(string id, string ipfsHash, uint256 timestamp);
    event StatusUpdated(string id, string newStatus);

    function addComplaint(string memory _id, string memory _ipfsHash) public {
        require(bytes(complaints[_id].id).length == 0, "Complaint already exists");
        
        complaints[_id] = Complaint(_id, _ipfsHash, "Pending", block.timestamp);
        complaintIds.push(_id);
        
        emit ComplaintAdded(_id, _ipfsHash, block.timestamp);
    }

    function getComplaint(string memory _id) public view returns (Complaint memory) {
        return complaints[_id];
    }

    function updateStatus(string memory _id, string memory _newStatus) public {
        require(bytes(complaints[_id].id).length != 0, "Complaint does not exist");
        
        complaints[_id].status = _newStatus;
        
        emit StatusUpdated(_id, _newStatus);
    }

    function getAllComplaintIds() public view returns (string[] memory) {
        return complaintIds;
    }
}