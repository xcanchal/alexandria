import { expect } from "chai";
import { ethers } from "hardhat";
import { validateDate } from "./utils";

async function deployContract() {
  const Users = await ethers.getContractFactory("Users");
  const users = await Users.deploy();
  await users.deployed();

  return users;
}

const usersData = [
  {
    id: 1,
    username: "xcanchal",
    bio: "Full stack software engineer",
    avatar: "ipfs://some-avatar.png",
  },
  {
    id: 2,
    username: "sdali",
    bio: "Surrealist painter",
    avatar: "ipfs://avatar-url.png",
  },
];

describe("Users", () => {
  describe("add()", () => {
    describe("Error cases", () => {
      it("should throw an error if the name length is lower than 2 characters", async () => {
        const users = await deployContract();
        let error: any;
        const [data] = usersData;
        try {
          const addTx = await users.add("u", data.bio, data.avatar);
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "username should at least have 2 characters"
        );
      });

      it("should throw an error if username already exists", async () => {
        const users = await deployContract();
        let error: any;
        const [data1, data2] = usersData;
        try {
          const add1Tx = await users.add(
            data1.username,
            data1.bio,
            data1.avatar
          );
          await add1Tx.wait();
          const add2Tx = await users.add(
            data1.username,
            data2.bio,
            data2.avatar
          );
          await add2Tx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Username already exists");
      });
    });

    describe("Success cases", () => {
      it("should properly set default attributes", async () => {
        const users = await deployContract();
        const [, signer1] = await ethers.getSigners();

        const [data] = usersData;
        const addTx = await users.connect(signer1).add(data.username, "", "");
        await addTx.wait();

        const [user] = await users.list();

        expect(user.id.toNumber()).eq(1);
        expect(user.username).eq(data.username);
        expect(user.bio).eq("");
        expect(user.avatar).eq("");
        expect(user.wallet).eq(signer1.address);
      });

      it("should create a user with all data sent in params", async () => {
        const users = await deployContract();
        const [, signer1] = await ethers.getSigners();

        const [, data] = usersData;
        const addTx = await users
          .connect(signer1)
          .add(data.username, data.bio, data.avatar);
        await addTx.wait();

        const [user] = await users.list();

        expect(user.id.toNumber()).eq(1);
        expect(user.username).eq(data.username);
        expect(user.bio).eq(data.bio);
        expect(user.avatar).eq(data.avatar);
        expect(user.wallet).eq(signer1.address);
      });

      it("should publish userAdded event", async () => {
        const users = await deployContract();
        const [, signer1] = await ethers.getSigners();

        const [data] = usersData;
        const addTx = await users
          .connect(signer1)
          .add(data.username, data.bio, data.avatar);

        const addTxReceipt = await addTx.wait();

        const events: any[] = addTxReceipt?.events ?? [];
        expect(events).to.have.length(1);
        expect(events[0].event).eq("userAdded");
        expect(events[0].args.user.username).eq(data.username);
        expect(events[0].args.user.bio).eq(data.bio);
        expect(events[0].args.user.avatar).eq(data.avatar);
        expect(events[0].args.user.wallet).eq(signer1.address);
      });
    });
  });

  describe("list()", () => {
    describe("Success cases", () => {
      it("should return an empty category list", async () => {
        const users = await deployContract();
        expect(await users.list()).to.have.length(0);
      });

      it("should return a list with existing users", async () => {
        const categories = await deployContract();
        const addTxs = await Promise.all(
          usersData.map(({ username, bio, avatar }) =>
            categories.add(username, bio, avatar)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));

        const userList = await categories.list();
        expect(userList).to.have.length(2);
        expect(userList[1].id.toNumber()).to.eq(2);
        expect(userList[1].username).eq(usersData[1].username);
        expect(userList[1].bio).eq(usersData[1].bio);
        expect(userList[1].avatar).eq(usersData[1].avatar);
      });
    });
  });

  describe("getById()", () => {
    describe("Error cases", () => {
      it("should throw an error if the id is lte 0", async () => {
        const users = await deployContract();
        let error: any;
        try {
          await users.getById(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("invalid id");
      });

      it("should return a not found error if category does not exist", async () => {
        const users = await deployContract();
        let error: any;
        try {
          await users.getById(3);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("User not found");
      });
    });
    describe("Success cases", () => {
      it("should return an existing category by id", async () => {
        const users = await deployContract();
        const [data] = usersData;
        const addTx = await users.add(data.username, data.bio, data.avatar);
        await addTx.wait();

        const user = await users.getById(1);
        expect(user.username).eq(data.username);
        expect(user.bio).eq(data.bio);
        expect(user.avatar).eq(data.avatar);
        validateDate(new Date(user.createdAt.toNumber()));
        validateDate(new Date(user.updatedAt.toNumber()));
      });
    });
  });

  describe("exists()", () => {
    describe("Error cases", () => {
      it("should throw an error if the id is lte 0", async () => {
        const users = await deployContract();
        let error: any;
        try {
          await users.exists(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("invalid id");
      });
    });

    describe("Success cases", () => {
      it("should return true if a user exists", async () => {
        const users = await deployContract();
        const [{ username, bio, avatar }] = usersData;
        const addTx = await users.add(username, bio, avatar);
        await addTx.wait();
        expect(await users.exists(1)).eq(true);
      });
      it("should return false if a user does not exist", async () => {
        const users = await deployContract();
        expect(await users.exists(5)).eq(false);
      });
    });
  });

  /* Test it by setting the "existsByUsername" function to "public"
  describe("existsByUsername()", () => {
    describe("Error cases", () => {
      it("should throw an error if username length is lt 2", async () => {
        const users = await deployContract();
        let error: any;
        try {
          await users.existsByUsername("u");
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains(
          "username should at least have 2 characters"
        );
      });
    });
    describe("Success cases", () => {
      it("should return true if a user exists", async () => {
        const users = await deployContract();
        const addTxs = await Promise.all(
          usersData.map(({ username, bio, avatar }) =>
            users.add(username, bio, avatar)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));
        expect(await users.existsByUsername(usersData[0].username)).eq(true);
      });
      it("should return false if a user does not exist", async () => {
        const users = await deployContract();
        const addTxs = await Promise.all(
          usersData.map(({ username, bio, avatar }) =>
            users.add(username, bio, avatar)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));
        expect(await users.existsByUsername("aketchum")).eq(false);
      });
    });
  }); */

  describe("getByAddress()", () => {
    describe("Error cases", () => {
      /* it("should throw an error if address format is invalid", async () => {
        const users = await deployContract();
        let error: any;
        try {
          await users.getByAddress("wrong-address");
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains(
          "Invalid format address"
        );
      }); */
      it("should throw a not found error", async () => {
        const users = await deployContract();
        const [, signer1, signer2] = await ethers.getSigners();
        let error: any;
        try {
          await users.connect(signer2).getByAddress(signer1.address);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("User not found with this address");
      });
    });
    describe("Success cases", () => {
      it("should return the user", async () => {
        const users = await deployContract();
        const [, signer1, signer2] = await ethers.getSigners();
        const [{ username, bio, avatar }] = usersData;
        await users.connect(signer1).add(username, bio, avatar);
        const user = await users.connect(signer2).getByAddress(signer1.address);
        expect(user.username).eq(username);
        expect(user.bio).eq(bio);
        expect(user.avatar).eq(avatar);
      });
    });
  });
});
