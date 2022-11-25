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

library DocuLibrary {
    struct File {
        string hasher;
        uint256 description;
        address owner;
    }

    struct Student {
        address adder;
        string passport;
        string name;
        string email;
        string pass;
        string passportHash;
        string sopHash;
        uint256 status;
        mapping(uint256 => File) creds;
    }

    struct Verifier {
        address adder;
        uint256 id;
        string name;
        bool approved;
    }
}

/*
Passport <- Student
Transcript <- Verifier 1
GRE ScoreCard <- Verifier 2
TOEFL ScoreCard <- Verifier 3
SOP <- Student
Degree Certificate <- Verifier 4
LOR1 <- Verifier 5
LOR2 <- Verifier 6
*/

/*
status
0 under_review
1 submitted
2 rejected
3 accepted
*/