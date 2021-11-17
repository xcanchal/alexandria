# Building Alexandria

## Contracts and data modeling

### Stateful contracts

In Ethereum, Smart Contracts are stateful, and all the data lives inside the contract, which means that it will keep growing over time. In order to efficiently manipulate it (in terms of gas and time), we must model it in a proper way. Are there any best-practices / recommended design patterns to follow?

### Storing and querying data

Some things to avoid:

- Having to iterate over arrays for searching or filtering: It's better to use mappings if possible (constant time complexity). In Alexandria, for instance, everytime that a user publishes a question to a category, the contract adds a new element to the `questionsByCategoryId` mapping (with key: `categoryId` and value: `Question`), so when the users request questions from a topic, the contract simply has to access `questionsByCategoryId[categoryId]` with time complexity O(1). Every decision of this kind always come with a trade-off, and when we talk about time/space complexity, sometimes you need to sacrifice one to benefit the other. In this case, creating new mapping requires more space improve efficiency when querying data.

### Relationships between data

When modeling data structures, it's common to have relationship between different models. For instnace, in Alexandria we have two different entities: `Answer` and `User`. When showing a list of answers under a question, we want to display the `username` of the user that created it. The only information that the `Answer` has about the user is the `id`, the username is stored under `User`. How to efficiently query these? Different solutions come to my mind:

- Creating extra data structures with normalized data (a more non-relational database approach). For instance, having a `DetailedAnswer` that holds all that information and is only used for displaying data, whereas the `Answer` is the source of truth for other operations. Problem? Having duplicate information and having to maintain all entities updated all the time, but since querying on the blockchain is not very efficient, we might again want to sacrifice space for time.

### Contracts organization

How many contracts to create? A single or multiple ones. For this, I followed the microservices approach and created separate contract for different entities and sub-entities / use-cases.

The benefits of splitting contracts are many:

- Clear responsibility.
- Not having to update everything for a change that just impacts a small part of the application.
- Size and deploy cost.
- Maintainability.

Some questions:

- How to call functions in other contracts? Each contract gets deployed to an address. To tell a contract B about another contract A, the address of the contract A must be sent in the constructor when instantiating B. Then B, can initialize and store A as a state variable pointing to the contract's address and call its functions.

### Data migration

Ethereum contracts can't be upgraded. If a contract needs to get updated because of adding new features or fixing existing ones, it needs to be redeployed to another address. So, how can we migrate data?

For now, I'm redeploying all the contracts to a new address everytime, and therefore, wiping all the data out on the web app eyes, but I will need to investigate further on this.

Other pain points:

- Data validation (use modifers...)
-

### Which layer to use (L1 Ethereum, L2 Matic...)

Pros and cons of using an L2 solution such as Matic over Ethereum:

From a developer perspective:

When using Ethereum (layer 1), testing in development or staging environments is a bit of a pain in the ass. Rinkeby is fast but there aren't many faucets and those that I found that work, drip little amounts of $ETH. Ropsten is better in that regard but at least from my experience, it's too slow validating transactions hence not efficient for developing.

OK, BUT ROPSTEN WORKS LIKE MAINNET AND RINKEBY DOE SNOT. GOOD POINT. TO GET A BEHAVIOR THAT RESEMBLES MORE MAINNET, YOU CAN USE ROPSTEN FOR STAGING AND RINKEBY FOR DEVELOPMENT!

Adding Matic to the wallet networks is pretty easy (EXPLAIN HOW?) and configuring Alchemy and Hardhat for deploying contracts is not different than doing it with Ethereum at all. In terms of transaction validation speed it's quite good and funding the wallet with test tokens was easy too. The first faucet I found and used (https://faucet.polygon.technology/) dripped me 1 $MATIC (priced around 1.8 USD at the time) in a single transaction, and since the transaction fees are lower in L2, it lasted me long enough to not having to worry for funding again in a considerable period of time.

From a user perspective:

Pros

- Lower transaction costs and faster transaction validation time.

Cons

- Another "level" of complexity added. They have to to configure a new network and buy $MATIC tokens to use the dApp.

### Security

- Private key: Set it environment and never uplad it to Github or any other site where other people can see it or all your funds can be stolen.


## Conclusion

### Like / dislike

Things I like about Ethereum:

- Modifiers

Things I dislike about Ethereum:

- Contracts can't be updated (and data lives in the contract)
