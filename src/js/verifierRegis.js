
function myFunction() {
    var name = document.getElementById("name").value.trim();
    setTimeout(function () {
        DocuNetContract.methods.addVerifier(name)
            .send()
            .then(result => {
                if (result.status === true) {
                    alert("Success");
                    console.log(result);
                    window.location.href = './addCreds.html'
                }
            });
    }, 4000)
}