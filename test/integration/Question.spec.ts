import { expect } from "chai";
import { ethers } from "hardhat";
import {
  Alexandria,
  TagStore,
  TagLogic,
  QuestionStore,
  QuestionLogic,
} from "../../typechain";
import { generateId } from "../utils";
import {
  deployAlexandria,
  deployTagLogic,
  deployTagStore,
  deployQuestionLogic,
  deployQuestionStore,
} from "../../utils";

describe("Question", () => {
  let tagStore: TagStore;
  let tagLogic: TagLogic;
  let questionStore: QuestionStore;
  let questionLogic: QuestionLogic;
  let alexandria: Alexandria;

  beforeEach(async () => {
    // DEPLOY CONTRACTS
    // Tag
    tagStore = await deployTagStore();
    tagLogic = await deployTagLogic(tagStore.address);
    // Question
    questionStore = await deployQuestionStore();
    questionLogic = await deployQuestionLogic(questionStore.address);
    // Alexandria
    alexandria = await deployAlexandria(
      tagLogic.address,
      questionLogic.address
    );
    // update references
    await questionStore.upgradeLogic(questionLogic.address);
    await questionLogic.upgradeAlexandria(alexandria.address);
    await alexandria.upgradeTagLogic(questionLogic.address);
  });

  describe("Create question", () => {
    describe("Error cases", () => {
      it("should throw a 400 error if question already exists", async () => {
        let error = null;
        try {
          await alexandria.createQuestion("question title", "question body", [
            "tag1",
          ]);
        } catch (e: any) {
          error = e;
        }
        expect(error).to.eq(null);
        try {
          await alexandria.createQuestion("question title", "question body", [
            "tag1",
          ]);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("400");
      });
    });
    describe("Success cases", () => {
      it("should create a question and emit QuestionCreated event", (done) => {
        (async () => {
          const [signer] = await ethers.getSigners();
          const title = "question title";
          const body = "question body";
          const tags = ["tag1", "tag2"];

          const id = generateId(["string", "address"], [title, signer.address]);

          questionStore.on("QuestionCreated", (question) => {
            expect(question).to.not.eq(null);
            expect(question.id).to.eq(id);
            expect(question.title).to.eq(title);
            expect(question.body).to.eq(body);
            expect(question.tags).to.deep.eq(tags);
            expect(question.creator).to.eq(signer.address);
            expect(question.deleted).to.eq(false);
            done();
          });

          const addTx = await alexandria.createQuestion(title, body, tags);
          await addTx.wait();
        })();
      });
    });
  });

  describe("Update question", () => {
    describe("Error cases", () => {
      it("should return a 404 error if question does not exist", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        try {
          const updateTx = await alexandria.updateQuestion(
            generateId(
              ["string", "address"],
              ["question title", signer.address]
            ),
            "new title",
            "new body",
            ["tag1"]
          );
          await updateTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("404");
      });

      it("should return a 403 error if the caller is not the creator", async () => {
        let error = null;
        const [signer1, signer2] = await ethers.getSigners();
        try {
          const title = "question title";
          const createTx = await alexandria
            .connect(signer1)
            .createQuestion(title, "question body", ["tag1"]);
          await createTx.wait();
          const updateTx = await alexandria
            .connect(signer2)
            .updateQuestion(
              generateId(["string", "address"], [title, signer1.address]),
              "new title",
              "new body",
              ["tag1", "tag2"]
            );
          await updateTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("403");
      });
    });
    describe("Success cases", () => {
      it("should update the question and emit QuestionUpdated event", (done) => {
        (async () => {
          const [signer] = await ethers.getSigners();
          const title = "question title";
          const createTx = await alexandria.createQuestion(
            "question title",
            "question body",
            ["tag1"]
          );
          await createTx.wait();

          const newTitle = "question title updated";
          const newBody = "question body updated";
          const newTags = ["tag1", "tag2", "tag3"];
          const id = generateId(["string", "address"], [title, signer.address]);

          questionStore.on("QuestionUpdated", (question) => {
            expect(question.id).to.eq(id);
            expect(question.title).to.eq(newTitle);
            expect(question.body).to.eq(newBody);
            expect(question.creator).to.eq(signer.address);
            expect(question.tags).to.deep.eq(newTags);
            expect(question.deleted).to.eq(false);
            done();
          });

          const updateTx = await alexandria.updateQuestion(
            id,
            newTitle,
            newBody,
            newTags
          );
          await updateTx.wait();
        })();
      });
    });
  });

  describe("Get question by id", () => {
    describe("Error cases", () => {
      it("should return a 404 error if question does not exist", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        try {
          await alexandria.getQuestionById(
            generateId(
              ["string", "address"],
              ["unexisting question", signer.address]
            )
          );
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("404");
      });
    });
    describe("Success cases", () => {
      it("should return the existing question", async () => {
        const title = "pets";
        const body = "all about pets";
        const tags = ["tag1", "tag2"];
        const [signer] = await ethers.getSigners();

        const createTx = await alexandria.createQuestion(title, body, tags);
        await createTx.wait();

        const id = generateId(["string", "address"], [title, signer.address]);

        const question = await alexandria.getQuestionById(id);
        expect(question.id).to.eq(id);
        expect(question.title).to.eq(title);
        expect(question.body).to.eq(body);
        expect(question.deleted).to.eq(false);
        expect(question.creator).to.eq(signer.address);
        expect(question.tags).to.deep.eq(tags);
      });
    });
  });

  describe("Get question by index", () => {
    describe("Error cases", () => {
      it("should return a 404 error if tag does not exist", async () => {
        let error = null;
        try {
          await alexandria.getTagByIndex(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("404");
      });
    });
    describe("Success cases", () => {
      it("should return the existing question", async () => {
        const title = "question title";
        const body = "question description";
        const tags = ["tag1", "tag2"];
        const [signer] = await ethers.getSigners();

        const createTx = await alexandria.createQuestion(title, body, tags);
        await createTx.wait();

        const id = generateId(["string", "address"], [title, signer.address]);

        const question = await alexandria.getQuestionByIndex(0);
        expect(question.id).to.eq(id);
        expect(question.title).to.eq(title);
        expect(question.body).to.eq(body);
        expect(question.deleted).to.eq(false);
        expect(question.creator).to.eq(signer.address);
        expect(question.tags).to.deep.eq(tags);
      });
    });
  });

  describe("Delete question by id", () => {
    describe("Error cases", () => {
      it("should return a 404 error if tag does not exist", async () => {
        let error = null;
        try {
          await alexandria.deleteQuestionById(
            generateId(["string"], ["unexisting-tag"])
          );
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("404");
      });
      it("should return a 403 error if the caller is not the creator", async () => {
        let error = null;
        const [signer1, signer2] = await ethers.getSigners();
        try {
          const title = "question title";
          const createTx = await alexandria
            .connect(signer1)
            .createQuestion(title, "question description", ["tag1"]);
          await createTx.wait();
          const updateTx = await alexandria
            .connect(signer2)
            .deleteQuestionById(
              generateId(["string", "address"], [title, signer1.address])
            );
          await updateTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("403");
      });
    });
    describe("Success cases", () => {
      it("should delete the question", async () => {
        let error = null;
        const title = "question title";
        const [signer] = await ethers.getSigners();
        const createTx = await alexandria.createQuestion(
          title,
          "question body",
          ["tag1"]
        );
        await createTx.wait();

        const id = generateId(["string", "address"], [title, signer.address]);
        await alexandria.deleteQuestionById(id);

        try {
          await alexandria.getQuestionById(id);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("404");
      });
    });
  });

  describe("Count tags", () => {
    describe("Success cases", () => {
      it("should return the number of existing questions", async () => {
        let count = await alexandria.countTags();
        expect(count).to.eq(0);
        await alexandria.createQuestion("question title", "question body", [
          "tag1",
        ]);
        count = await alexandria.countQuestions();
        expect(count).to.eq(1);
      });
    });
  });
});
