var passport_ipfs;
var sop_ipfs;
const ipfs = window.IpfsApi('localhost', 5001);

function myFunction() {
    var name = document.getElementById("name").value.trim();
    var passport_number = document.getElementById("passport_number").value.trim();
    var password = document.getElementById("password").value.trim();
    uploadPassport(document.getElementById("passport_file").files[0]);
    uploadSop(document.getElementById("sop_file").files[0]);
    var email = document.getElementById("email").value.trim();
    setTimeout(function () {
        DocuNetContract.methods.addStudent(passport_number, name, email, password, passport_ipfs, sop_ipfs)
            .send()
            .then(result => {
                if (result.status === true) {
                    alert("Success");
                    console.log(result);
                    window.location.href = "./studentHome.html";
                }
            });
    }, 4000)
}

function uploadPassport(fle) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(fle);
    reader.onloadend = function () {
        const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
        var buf = buffer.Buffer.from(reader.result);
        ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
            if (err) {
                console.error(err)
                return
            }
            let url = `https://ipfs.io/ipfs/${result[0].hash}`
            console.log(`Url --> ${url}`);
            passport_ipfs = result[0].hash;
        })
    }
}

function uploadSop(fle) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fle);
    reader.onloadend = function () {
        const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
        var buf = buffer.Buffer.from(reader.result);
        ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
            if (err) {
                console.error(err)
                return
            }
            let url = `https://ipfs.io/ipfs/${result[0].hash}`
            console.log(`Url --> ${url}`);
            sop_ipfs = result[0].hash;
        })
    }
}