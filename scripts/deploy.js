const hre=require("hardhat");
//import './App.css';

async function main(){
    const tipAdderFactory=await hre.ethers.getContractFactory("TipDonate");
    const tipAdder=await tipAdderFactory.deploy();
    await tipAdder.waitForDeployment();
    console.log("TipAdder deployed to: ",await tipAdder.getAddress());
}
main().catch((error)=>{
    console.error(error);
    process.exitCode=1;
});