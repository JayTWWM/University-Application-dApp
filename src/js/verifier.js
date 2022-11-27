var verifierCount = 0;

function myFunction1(id) {
    DocuNetContract.methods.approveVerifier(id)
        .send()
        .then(result => {
            if (result.status === true) {
                alert("Success");
                console.log(result);
                window.location.href = './verifierList.html';
            }
        });
}

function myFunction2(id) {
    DocuNetContract.methods.disapproveVerifier(id)
        .send()
        .then(result => {
            if (result.status === true) {
                alert("Success");
                console.log(result);
                window.location.href = './verifierList.html';
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
    for (let k = 0; k < verifierCount; k++) {
        DocuNetContract.methods.getVerifierFromIndex(k)
            .call((error, response) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response);
                    if (response[1]) {
                        let row = '<td><div class="card"> <div class="cover-photo"><img src="https://studentleadership.seattlecentral.edu/sites/icon-library/default-team-member.jpg" class="profile"> </div> <h3 class="profile-name">' + response[0] + '</h3> <button onclick="myFunction2(' + k + ')" class="rej">Disapprove</button></div> </td>';
                        $("tbody").append(row);
                    } else {
                        let row = '<td><div class="card"> <div class="cover-photo"><img src="https://studentleadership.seattlecentral.edu/sites/icon-library/default-team-member.jpg" class="profile"> </div> <h3 class="profile-name">' + response[0] + '</h3> <button onclick="myFunction1(' + k + ')" class="acc">Approve</button></div> </td>';
                        $("tbody").append(row);
                    }
                }
            });
    }
}, 8000)
