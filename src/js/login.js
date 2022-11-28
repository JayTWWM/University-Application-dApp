function myFunction() {
    var password = document.getElementById("password").value.trim();
    var email = document.getElementById("email").value.trim();
    setTimeout(function () {
        DocuNetContract.methods.studentLogin(email,password)
            .call((error, response) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response);
                    if(response) {
                        window.location.href = "./studentHome.html";
                    } else {
                        alert("Please check your email and password again!");
                    }
                }
            });
    }, 4000)
}