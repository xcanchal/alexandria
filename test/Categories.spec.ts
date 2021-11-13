import { expect } from "chai";
import { ethers } from "hardhat";
import { validateDate } from "./utils";

async function deployContract() {
  const Categories = await ethers.getContractFactory("Categories");
  const categories = await Categories.deploy();
  await categories.deployed();

  return categories;
}

const categoriesData = [
  { name: "photography", description: "all about photography" },
  { name: "blockchain", description: "all about blockchain" },
  { name: "pets", description: "all about pets" },
];

describe("Categories", () => {
  describe("add()", () => {
    describe("Error cases", () => {
      it("should throw an error if the caller is not the owner", async () => {
        const categories = await deployContract();
        const [, signer1] = await ethers.getSigners();
        let error: any;
        const [data] = categoriesData;
        try {
          await categories.connect(signer1).add(data.name, data.description);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Ownable: caller is not the owner");
      });
      it("should throw an error if the name length is lt 2 characters", async () => {
        const categories = await deployContract();
        let error: any;
        const [data] = categoriesData;
        try {
          const addTx = await categories.add("", data.description);
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "name should at least have 2 characters"
        );
      });
      it("should throw an error if the description length is lt 2 characters", async () => {
        const categories = await deployContract();
        let error: any;
        const [data] = categoriesData;
        try {
          const addTx = await categories.add(data.name, "");
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "description should at least have 2 characters"
        );
      });
    });

    describe("Success cases", () => {
      it("should create a category", async () => {
        const categories = await deployContract();

        const addTx = await categories.add(
          "blockchain",
          "all about blockchain"
        );
        await addTx.wait();

        const [category] = await categories.list();

        expect(category.id.toNumber()).eql(1);
        expect(category.name).eq("blockchain");
        expect(category.description).eq("all about blockchain");
      });

      it("should publish categoryAdded event", async () => {
        const categories = await deployContract();

        const addTx = await categories.add(
          "blockchain",
          "all about blockchain"
        );
        const addTxReceipt = await addTx.wait();

        const events: any[] = addTxReceipt?.events ?? [];
        expect(events).to.have.length(1);
        expect(events[0].event).eq("categoryAdded");
        expect(events[0].args.category.id).eq(1);
        expect(events[0].args.category.name).eq("blockchain");
        expect(events[0].args.category.description).eq("all about blockchain");
      });
    });
  });

  describe("list()", () => {
    describe("Success cases", () => {
      it("should return an empty category list", async () => {
        const categories = await deployContract();
        expect(await categories.list()).to.have.length(0);
      });

      it("should return a list with existing categories", async () => {
        const categories = await deployContract();
        const addTxs = await Promise.all(
          categoriesData.map(({ name, description }) =>
            categories.add(name, description)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));

        const categoryList = await categories.list();
        expect(categoryList).to.have.length(3);
        expect(categoryList[2].id.toNumber()).to.eq(3);
        expect(categoryList[2].name).eq(categoriesData[2].name);
        expect(categoryList[2].description).eq(categoriesData[2].description);
      });
    });
  });

  describe("getById()", () => {
    describe("Error cases", () => {
      it("should throw an error if the id is lte 0", async () => {
        const categories = await deployContract();
        let error: any;
        try {
          await categories.getById(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("id must be greater than zero");
      });

      it("should return a not found error if category does not exist", async () => {
        const categories = await deployContract();
        let error: any;
        try {
          await categories.getById(3);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Category not found");
      });
    });

    describe("Success cases", () => {
      it("should return an existing category by id", async () => {
        const categories = await deployContract();
        const addTx = await categories.add(
          "blockchain",
          "all about blockchain"
        );
        await addTx.wait();

        const category = await categories.getById(1);
        expect(category.name).eq("blockchain");
        expect(category.description).eq("all about blockchain");
        validateDate(new Date(category.createdAt.toNumber()));
        validateDate(new Date(category.updatedAt.toNumber()));
      });
    });
  });

  describe("exists()", () => {
    describe("Error cases", () => {
      it("should throw an error if the id is lte 0", async () => {
        const categories = await deployContract();
        let error: any;
        try {
          await categories.exists(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("id must be greater than zero");
      });
    });
    describe("Success cases", () => {
      it("should return true if a category exists", async () => {
        const categories = await deployContract();
        const addTxs = await Promise.all(
          categoriesData.map(({ name, description }) =>
            categories.add(name, description)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));
        expect(await categories.exists(1)).eq(true);
      });

      it("should return false if a category does not exist", async () => {
        const categories = await deployContract();
        const addTxs = await Promise.all(
          categoriesData.map(({ name, description }) =>
            categories.add(name, description)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));
        expect(await categories.exists(5)).eq(false);
      });
    });
  });
});
