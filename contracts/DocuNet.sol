// SPDX-License-Identifier: Apache-2.0
//
// Copyright 2022 Jay Dinesh Mehta
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

pragma solidity >=0.5.16;
import "./DocuLibrary.sol";

contract DocuNet {
    address university;

    constructor(address _university) public {
        university = _university;
    }

    mapping(address => DocuLibrary.Student) public studentLookup;
    mapping(address => DocuLibrary.Verifier) public verifierLookup;
    mapping(uint256 => address) internal verifierAddressLookup;
    mapping(string => address) internal addressLookup;
    mapping(uint256 => address) internal indexLookup;
    uint256 studentCount;
    uint256 numVerifiers;

    // Sign-up function
    function addStudent(
        string memory _passport,
        string memory _name,
        string memory _email,
        string memory _pass,
        string memory _passportHash,
        string memory _sopHash
    ) public {
        require(
            verifierLookup[msg.sender].adder == address(0),
            "You Already Have A Verifier!"
        );
        require(
            studentLookup[msg.sender].adder == address(0),
            "You Already Have An Account!"
        );
        DocuLibrary.Student storage newStudent = studentLookup[msg.sender];
        newStudent.passport = _passport;
        newStudent.name = _name;
        newStudent.email = _email;
        newStudent.pass = _pass;
        newStudent.passportHash = _passportHash;
        newStudent.sopHash = _sopHash;
        newStudent.adder = msg.sender;
        newStudent.status = 0;
        addressLookup[_passport] = msg.sender;
        indexLookup[studentCount] = msg.sender;
        studentCount++;
        emit StudentCreation(_name);
    }

    // Verify Student Login
    function studentLogin(string memory _email, string memory _pass)
        public
        view
        returns (bool)
    {
        require(
            studentLookup[msg.sender].adder != address(0),
            "You Do Not Have An Account!"
        );
        if (
            keccak256(abi.encodePacked((studentLookup[msg.sender].email))) ==
            keccak256(abi.encodePacked((_email))) &&
            keccak256(abi.encodePacked((studentLookup[msg.sender].pass))) ==
            keccak256(abi.encodePacked((_pass)))
        ) {
            return true;
        }
        return false;
    }

    // Check if application is complete
    function checkApplication() internal view returns (bool) {
        require(
            studentLookup[msg.sender].adder != address(0),
            "You Do Not Have An Account!"
        );
        for (uint256 i = 0; i < numVerifiers; i++) {
            if (
                keccak256(
                    abi.encodePacked(
                        (studentLookup[msg.sender].creds[i].hasher)
                    )
                ) ==
                keccak256(abi.encodePacked((""))) &&
                verifierLookup[verifierAddressLookup[i]].approved
            ) {
                return false;
            }
        }
        return true;
    }

    // Get student credentials
    function getCredsFromIndex(uint256 _id, string memory _passport)
        public
        view
        returns (string memory, string memory)
    {
        require(msg.sender == university, "You Do Not Have Authority!");
        if (verifierLookup[verifierAddressLookup[_id]].approved) {
            return (
                verifierLookup[verifierAddressLookup[_id]].name,
                studentLookup[addressLookup[_passport]].creds[_id].hasher
            );
        }
        return (
            verifierLookup[verifierAddressLookup[_id]].name,
            "Not Required"
        );
    }

    // Get student credentials
    function getCreds(uint256 _id)
        public
        view
        returns (string memory, string memory)
    {
        require(
            studentLookup[msg.sender].adder != address(0) ||
                msg.sender == university,
            "You Do Not Have An Account!"
        );
        if (verifierLookup[verifierAddressLookup[_id]].approved) {
            return (
                verifierLookup[verifierAddressLookup[_id]].name,
                studentLookup[msg.sender].creds[_id].hasher
            );
        }
        return (
            verifierLookup[verifierAddressLookup[_id]].name,
            "Not Required"
        );
    }

    // Submit the application
    function submitApplication() public {
        require(
            studentLookup[msg.sender].adder != address(0),
            "You Do Not Have An Account!"
        );
        require(checkApplication(), "Your Application Is Incomplete!");
        studentLookup[msg.sender].status = 1;
        emit ApplicationSubmitted(studentLookup[msg.sender].name);
    }

    // Add verifiers to the system
    function addVerifier(string memory _name) public {
        require(
            studentLookup[msg.sender].adder == address(0),
            "You Already Have An Account As A Student!"
        );
        require(
            verifierLookup[msg.sender].adder == address(0),
            "You Are Already A Verifier!"
        );
        DocuLibrary.Verifier storage newVerifier = verifierLookup[msg.sender];
        newVerifier.name = _name;
        newVerifier.adder = msg.sender;
        newVerifier.approved = false;
        newVerifier.id = numVerifiers;
        verifierAddressLookup[numVerifiers] = msg.sender;
        numVerifiers++;
        emit VerifierCreation(_name);
    }

    // Approve verifier
    function approveVerifier(uint256 _id) public {
        require(msg.sender == university, "You Do Not Have Authority!");
        require(
            verifierAddressLookup[_id] != address(0),
            "No Such Verifier Found!"
        );
        address _adder = verifierAddressLookup[_id];
        verifierLookup[_adder].approved = true;
        emit VerifierApproved(verifierLookup[_adder].name);
    }

    // Disapprove verifier
    function disapproveVerifier(uint256 _id) public {
        require(msg.sender == university, "You Do Not Have Authority!");
        require(
            verifierAddressLookup[_id] != address(0),
            "No Such Verifier Found!"
        );
        address _adder = verifierAddressLookup[_id];
        verifierLookup[_adder].approved = false;
        emit VerifierApproved(verifierLookup[_adder].name);
    }

    // Reject or accept student
    function giveDecision(string memory _passport, bool accepted) public {
        require(msg.sender == university, "You Do Not Have Authority!");
        require(
            addressLookup[_passport] != address(0),
            "No Such Student Exists!"
        );
        address _adder = addressLookup[_passport];
        require(
            studentLookup[_adder].status != 0,
            "Application Not Completed Yet!"
        );
        if (accepted) {
            studentLookup[_adder].status = 3;
        } else {
            studentLookup[_adder].status = 2;
        }
        emit DecisionMade(studentLookup[_adder].name);
    }

    // Update Student Credentials
    function updateCredentials(string memory _passport, string memory _hasher)
        public
    {
        require(
            verifierLookup[msg.sender].adder != address(0) &&
                verifierLookup[msg.sender].approved,
            "You Do Not Have Authority!"
        );
        require(
            addressLookup[_passport] != address(0),
            "No Such Student Exists!"
        );
        address _adder = addressLookup[_passport];
        require(
            studentLookup[_adder].status == 0,
            "The Application Is Already Submitted."
        );
        uint256 _id = verifierLookup[msg.sender].id;
        studentLookup[_adder].creds[_id] = DocuLibrary.File({
            hasher: _hasher,
            description: _id,
            owner: _adder
        });
        emit CredentialsUpdated(_passport,_id);
    }

    // Get student count
    function getStudentCount() public view returns (uint256) {
        require(msg.sender == university, "You Do Not Have Authority!");
        return studentCount;
    }

    // Get verifier count
    function getVerifierCount() public view returns (uint256) {
        require(
            verifierLookup[msg.sender].adder == address(0),
            "You Do Not Have Authority!"
        );
        return numVerifiers;
    }

    // Get student from index
    function getStudentFromIndex(uint256 _index)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            string memory,
            string memory
        )
    {
        require(msg.sender == university, "You Do Not Have Authority!");
        require(indexLookup[_index] != address(0), "No Such Student Exists!");
        address _adder = indexLookup[_index];
        return (
            studentLookup[_adder].passport,
            studentLookup[_adder].name,
            studentLookup[_adder].email,
            studentLookup[_adder].status,
            studentLookup[_adder].passportHash,
            studentLookup[_adder].sopHash
        );
    }

    // Get verifier from index
    function getVerifierFromIndex(uint256 _index)
        public
        view
        returns (string memory, bool)
    {
        require(msg.sender == university, "You Do Not Have Authority!");
        require(
            verifierAddressLookup[_index] != address(0),
            "No Such Verifier Exists!"
        );
        address _adder = verifierAddressLookup[_index];
        return (verifierLookup[_adder].name, verifierLookup[_adder].approved);
    }

    // Get student from passport
    function getStudentFromPassport(string memory _passport)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            string memory,
            string memory
        )
    {
        require(msg.sender == university, "You Do Not Have Authority!");
        require(
            addressLookup[_passport] != address(0),
            "No Such Student Exists!"
        );
        address _adder = addressLookup[_passport];
        return (
            studentLookup[_adder].passport,
            studentLookup[_adder].name,
            studentLookup[_adder].email,
            studentLookup[_adder].status,
            studentLookup[_adder].passportHash,
            studentLookup[_adder].sopHash
        );
    }

    // Get student from passport
    function getStudentInfo()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            string memory,
            string memory
        )
    {
        require(
            studentLookup[msg.sender].adder != address(0),
            "You Do Not Have An Account!"
        );
        return (
            studentLookup[msg.sender].passport,
            studentLookup[msg.sender].name,
            studentLookup[msg.sender].email,
            studentLookup[msg.sender].status,
            studentLookup[msg.sender].passportHash,
            studentLookup[msg.sender].sopHash
        );
    }

    //Testing methods
    // function getUniversity() public view returns (address) {
    //     return university;
    // }

    // function showSender() public view returns (address) {
    //     return (msg.sender);
    // }

    // function showNull() public view returns (address) {
    //     return verifierLookup[msg.sender].adder;
    // }

    event StudentCreation(string name);
    event VerifierCreation(string name);
    event VerifierApproved(string name);
    event CredentialsUpdated(string passport, uint256 id);
    event ApplicationSubmitted(string name);
    event DecisionMade(string name);
}
