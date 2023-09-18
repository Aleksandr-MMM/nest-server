// import { AbstractJavaScriptIndexCreationTask } from 'ravendb';
// import { UsersEntity } from "../entities/users.entity";
//
//
// export class userSearchMap {
//   public email: string;
//   public password: string;
//
//   public userId: string;
//   public searchTerms: string;
// }
//
// export class UserSearchIndex extends AbstractJavaScriptIndexCreationTask<
//   UsersEntity,
//   userSearchMap
//   > {
//   constructor() {
//     super();
//     this.map(new UsersEntity().collectionName, (doc) => {
//       const searchTerms =
//         doc.email + ' ' +
//         doc.password + ' ' +
//       doc.status;
//
//       return {
//         userId: doc['@metadata']['@id'],
//         email: doc.email,
//         password: doc.password,
//         status: doc.status,
//         searchTerms,
//       };
//     });
//
//     this.index('searchTerms', 'Search');
//     this.store('searchTerms', 'Yes');
//   }
// }