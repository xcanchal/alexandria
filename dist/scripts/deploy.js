"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../test/utils");
async function main() {
    const tagStore = await utils_1.deployTagStore();
    console.log("TagStore deployed to:", tagStore.address);
    const tagLogic = await utils_1.deployTagLogic(tagStore.address);
    console.log("TagLogic deployed to:", tagLogic.address);
    const alexandria = await utils_1.deployAlexandria();
    console.log("Alexandria deployed to:", alexandria.address);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
