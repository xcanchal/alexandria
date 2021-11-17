# Feature requests

- User firstName, lastName?
- User stats
- Board with proposed categories by the people and as long as a category reaches X votes, it gets automatically created? Users can propose a category and then a poll starts. See "polls" page.
- List latest posted questions
- Using NFTs as avatar. In the meantime, at least allow to publish avatars to IPFS or Arweave.
- Add followingTags to users for curating latest questions
- Add gamification (badges, achievements..) and tipping!
- Search questions functionality in home... The Graph?
- (DONE) Add userId to Category and categoriesByUserId
- Answers may have to have Comments...


# Technical improvements

- Deploy to Matic (Polygon) for cheap
- I should decide how to store data to be efficiently retrieved by an attribute's id. For instance, get all questions from a category given a categoryId. (FOR NOW, USING A MAPPING(uint categoryId -> Questions[])). What if I used The Graph instead? Could I get rid of some data redundancy?
- Proper validation of data inputs (Categories.tags can be null...)
- Rename category to topic?
- List and listByCategoryId should return the user already?
- (DONE) Create a Question detail page
- Add stats to question list
- Check out testing tools like MythX, Slither, Echidna, Mythril.
- Sign up for a dedicated free RPC URL using services like Infura, MaticVigil, QuickNode, Chainstack, or Ankr (instead of Alchemy public one, which may have rate limits)
- Add web3modal to UI
- Set a maxLen to text inputs
- (DONE) Categories might need a "userId" attribute to know who created a category. Users must register as users before being able to create categories, questions, answers...
- Tag should be an entity? with it's page, relationships...
- What about slugs and SEO?? Next.js?
- Fix userAdded updates to Account context and pill and redirect from signup to users