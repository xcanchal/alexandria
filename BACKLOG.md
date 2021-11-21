# Features

- User firstName, lastName?
- User stats
- Update user bio/avatar.
- Being able to upload an avatar to a decentralized service and store it (manage it at signup and also update time).
- Using NFTs as a user avatar. In the meantime, at least allow to publish avatars to IPFS or Arweave.
- Add gamification (badges, achievements..) and tipping!
- Search questions functionality in home... The Graph?
- An Answer may need to have Comments.
- Topic polls: A board with proposed Topics by the people. When a topic reaches X votes, it gets automatically created. This would be done instead of letting every user flood the app with new categories.
- Adding a "latest categories" section to the home page.
- Adding a "latest questions" section to the home page.
- Add web3modal to UI to support different web3 providers (Metamask, Openconnect...)
- Add followingTags to users for curating latest questions (more personalized than simply "latest questions")
---
- (DONE) Add userId to Topic and topicsByUserId
- (DONE) Create a Question detail page

# Technical improvements

- Decide how to store data to be efficiently retrieved. For instance, get all questions from a category. For now, I'm ussing a mapping(uint categoryId -> Questions[]) that duplicates the data that I'm also storing in an array). Could I get rid of this data redundancy? What if I published all the data to IPFS, Swarm or Arweave and I just reference it? What if I used The Graph instead? or maybe GraphQL builds on top of this with the mission to perform faster and more complex queries? (so I can get rid of as much duplicated data as needed)
- More exhaustive validation of input data (Categories.tags can be null...)
- Questions list and questions.listByCategoryId should return the user already?
- Check out security testing tools like MythX, Slither, Echidna, Mythril.
- Sign up for a dedicated free RPC URL node using services like Infura, MaticVigil, QuickNode, Chainstack, or Ankr (instead of Alchemy public one, which may have rate limits)
- Tag should be an entity? with it's page, relationships...
- What about slugs and SEO?? Next.js?
- Fix userAdded updates to Account context and pill and redirect from signup to users
- Add stats to question list
---
- (DONE) Deploy to Matic (Polygon) for cheaper transactions
- (DONE) Categories might need a "userId" attribute to know who created it. Users must register being able to publish any type of data.
- (DONE) Set a maxLen to text inputs
- (DONE) Rename category to topic