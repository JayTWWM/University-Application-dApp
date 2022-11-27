var studentCount = 0;
var verifierCount = 0;
var row = '';
var kr = {
    0: 'Incomplete',
    1: 'Submitted',
    2: 'Rejected',
    3: 'Accepted'
}

function myFunction(passportNum, acc) {
    DocuNetContract.methods.giveDecision(passportNum, acc)
        .send()
        .then(result => {
            if (result.status === true) {
                alert("Success");
                console.log(result);
                window.location.href = './studentList.html';
            }
        });
}

setTimeout(function () {
    DocuNetContract.methods.getStudentCount()
        .call((error, response) => {
            if (error) {
                console.log(error);
            } else {
                studentCount = response;
            }
        });
}, 6000);

setTimeout(function () {
    DocuNetContract.methods.getVerifierCount()
        .call((error, response) => {
            if (error) {
                console.log(error);
            } else {
                verifierCount = response;
            }
        });
}, 6000);

setTimeout(function () {
    for (let k = 0; k < studentCount; k++) {
        DocuNetContract.methods.getStudentFromIndex(k)
            .call((error, response) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response);
                    row = '<td><div class="card"> <div class="cover-photo"><img src="https://studentleadership.seattlecentral.edu/sites/icon-library/default-team-member.jpg" class="profile"> </div> <h3 class="profile-name">' + response[1] + '</h3> <p class="about">' + response[2] + '<br>' + kr[response[3]] + '</p> <a href="https://ipfs.io/ipfs/' + response[4] + '"><button class="btn">Passport</button></a> <a href="https://ipfs.io/ipfs/' + response[5] + '"><button class="btn">SOP</button></a> <button onclick="myFunction(\'' + response[0] + '\',true)" class="acc">Accept</button><button onclick="myFunction(\'' + response[0] + '\',false)" class="rej">Reject</button><h3 class="profile-name"> Credentials </h3>';
                    for (let j = 0; j < verifierCount; j++) {
                        DocuNetContract.methods.getCredsFromIndex(j,response[0])
                            .call((error, response1) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(response1);
                                    if (response1[1] != 'Not Required') {
                                        console.log('response1');
                                        if (response1[1] != '') {
                                            row += '<button class="btn">' + response1[0] + '</button> <a href="https://ipfs.io/ipfs/' + response1[1] + '"><button class="btn">View Document</button></a>';
                                        } else {
                                            console.log('response1');
                                            row += '<button class="btn">' + response1[0] + '</button> <button class="rej"> Empty </button>'; 
                                        }
                                    }
                                    if (j == verifierCount - 1) {
                                        row += '</div></td>';
                                        console.log(row);
                                        $("tbody").append(row);
                                        row = '';
                                    }
                                }
                            });
                    }
                }
            });
    }
}, 8000)
