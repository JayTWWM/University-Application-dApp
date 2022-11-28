var verifierCount = 0;
var row = '';
var kr = {
    0: 'Incomplete',
    1: 'Submitted',
    2: 'Rejected',
    3: 'Accepted'
}

function submitFunc() {
    DocuNetContract.methods.submitApplication()
        .send()
        .then(result => {
            if (result.status === true) {
                alert("Success");
                console.log(result);
            }
        });
}

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
    DocuNetContract.methods.getStudentInfo()
        .call((error, response) => {
            if (error) {
                console.log(error);
            } else {
                console.log(response);
                row = '<td><div class="card"> <div class="cover-photo"><img src="https://studentleadership.seattlecentral.edu/sites/icon-library/default-team-member.jpg" class="profile"> </div> <h3 class="profile-name">' + response[1] + '</h3> <p class="about">' + response[2] + '<br>' + kr[response[3]] + '</p> <a href="https://ipfs.io/ipfs/' + response[4] + '"><button class="btn">Passport</button></a> <a href="https://ipfs.io/ipfs/' + response[5] + '"><button class="btn">SOP</button></a> <h3 class="profile-name"> Credentials </h3>';
                for (let j = 0; j < verifierCount; j++) {
                    DocuNetContract.methods.getCreds(j)
                        .call((error, response1) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log(response1);
                                if (response1[1] != 'Not Required') {
                                    if (response1[1] != '') {
                                        row += '<button class="btn">' + response1[0] + '</button> <a href="https://ipfs.io/ipfs/' + response1[1] + '"><button class="btn">View Document</button></a>';
                                    } else {
                                        row += '<button class="btn">' + response1[0] + '</button> <button class="rej"> Empty </button>';
                                    }
                                }
                                if (j == verifierCount - 1) {
                                    row += '</div></td>';
                                    $("tbody").append(row);
                                    row = '';
                                }
                            }
                        });
                }
                if (verifierCount == 0) {
                    row += '</div></td>';
                    $("tbody").append(row);
                    row = '';
                }
            }
        });
    let sub = '<button onclick="submitFunc()" class="btn"> Submit </button>';
    $("body").append(sub);
}, 8000)
