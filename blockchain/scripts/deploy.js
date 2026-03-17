const { ethers } = require("hardhat");

async function main() {
  const PoliceComplaintSystem = await ethers.getContractFactory("PoliceComplaintSystem");
  const policeComplaintSystem = await PoliceComplaintSystem.deploy();

  await policeComplaintSystem.deployed();

  console.log("PoliceComplaintSystem deployed to:", policeComplaintSystem.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });