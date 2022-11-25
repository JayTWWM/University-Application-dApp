const DocuNet = artifacts.require("./DocuNet.sol");

module.exports = function(deployer) {
    const _university = '0x7334B5381CfCB9e0C7D7983D9Ac35Eea2e29338e';
    deployer.deploy(DocuNet,_university);
};