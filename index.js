var contractABI = null;
var contractAddress = null;
var account0 = null;
var DocuNetContract = null;
$.ajax({
    url: "./build/contracts/DocuNet.json",
    async: false,
    dataType: "json",
    delay: 500,
    success: function (json) {
        assignVariable(json);
    }
});

function assignVariable(data) {
    contractABI = data.abi;
    contractAddress = data.networks[5777].address;
}

web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
web3.eth.getAccounts().then(function (result) {
    account0 = result[2];
    console.log(result);
});

setTimeout(function delay() {
    DocuNetContract = new web3.eth.Contract(
        contractABI,
        contractAddress, { from: account0, gas: 3000000 }
    );
}, 1000);


setTimeout(function delay() {
    console.log(account0);

    // Start Test Script
    // DocuNetContract.methods.getUniversity().call((error, response) => {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log(response);
    //     }
    // });
    // DocuNetContract.methods.showSender().call((error, response) => {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log(response);
    //     }
    // });
    // DocuNetContract.methods.showNull().call((error, response) => {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log(response);
    //     }
    // });
    // DocuNetContract.methods.getStudentCount().call((error, response) => {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log(response);
    //     }
    // });
    // DocuNetContract.methods.getStudentFromPassport("Passport").call((error, response) => {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log(response);
    //     }
    // });
    // DocuNetContract.methods.getStudentFromIndex(0).call((error, response) => {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log(response);
    //     }
    // });
    // DocuNetContract.methods.addStudent("K7072353","Avi Mehta","amehta65@asu.edu","Yeet1234","QmPRELP8RcNTib6k1g7QAfN3gddDiXwT1W9fxWuiLk7svM","QmNnBtoCPzcGPnRdBKkXvy55PjkyzassXUA2yGJrWjhNWr")
    // .send()
    // .then(result => {
    //     if (result.status === true) {
    //         alert("Success");
    //         console.log(result);
    //     }
    // });
    // DocuNetContract.methods.addVerifier("ETS")
    // .send()
    // .then(result => {
    //     if (result.status === true) {
    //         alert("Success");
    //         console.log(result);
    //     }
    // });
    // DocuNetContract.methods.submitApplication()
    // .send()
    // .then(result => {
    //     if (result.status === true) {
    //         alert("Success");
    //         console.log(result);
    //     }
    // });
    // End Test Script

    Object.freeze(account0);
}, 4000);