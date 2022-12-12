// Kuan Tsa Chen

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: "../config.env" });
dotenv.config({ path: "/etc/secrets/config.env" });

const DB_USER = "jason";
const DB_PASSWORD = "1234";
const DB_NAME = "E-connect";

function MyMongoDB() {
  const myDB = {};
  const url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.g3bcu3h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const collections = "card";
  const collectionsPub = "publiccard";
  const Equal = (obj1, obj2) => {
    Object.keys(obj1).forEach(function (key) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    });
    return true;
  };
  myDB.createCard = async (user, card) => {
    const client = new MongoClient(url);
    try {
      await client.connect();
      const database = client.db(DB_NAME);
      const cardsCol = database.collection(collections);
      const query = { username: user };
      const cardUser = await cardsCol.findOne(query);
      let newHash = 0;
      if (!cardUser) {
        await cardsCol.insertOne({
          username: user,
          mycards: [],
          othercards: [],
          hashing: 0,
        });
      } else {
        newHash = cardUser.hashing + 1;
      }
      card.id = user + newHash;
      console.log(card.id);
      await cardsCol.updateOne(query, {
        $set: {
          hashing: newHash,
        },
        $push: { mycards: card },
      });
      const check = await cardsCol.findOne({ cards: card });
      return check !== {};
    } finally {
      await client.close();
    }
  };

  myDB.fetchingCards = async (user, flag) => {
    const client = new MongoClient(url);
    try {
      await client.connect();
      const database = client.db(DB_NAME);
      const cardsCol = database.collection(collections);
      const query = { username: user };
      const cardUser = await cardsCol.findOne(query);
      const key = flag === "mine" ? "mycards" : "othercards";
      console.log("find user in card collections", cardUser);
      if (cardUser) {
        return cardUser[`${key}`];
      }
      return {};
    } finally {
      await client.close();
    }
  };

  myDB.fetchingPublicCards = async () => {
    const client = new MongoClient(url);
    try {
      await client.connect();
      const database = client.db(DB_NAME);
      const cardsCol = database.collection(collectionsPub);
      const cardUser = await cardsCol.find().limit(20).toArray();
      console.log("db public card", cardUser);
      if (cardUser) {
        return cardUser;
      } else {
        return {};
      }
    } finally {
      await client.close();
    }
  };

  myDB.updateCard = async (currentUser, card) => {
    const client = new MongoClient(url);
    try {
      await client.connect();
      const database = client.db(DB_NAME);
      const cardsCol = database.collection(collections);
      const query = {
        username: currentUser,
      };
      console.log("CARD", card);
      await cardsCol.updateOne(
        query,
        {
          $set: {
            "mycards.$[updateCard].profileImg": card.profileImg,
            "mycards.$[updateCard].firstName": card.firstName,
            "mycards.$[updateCard].lastName": card.lastName,
            "mycards.$[updateCard].email": card.email,
            "mycards.$[updateCard].intro": card.intro,
            "mycards.$[updateCard].phone": card.phone,
            "mycards.$[updateCard].job": card.job,
            "mycards.$[updateCard].location": card.location,
          },
        },
        {
          arrayFilters: [{ "updateCard.id": card.id }],
        }
      );
      const ncardUser = await cardsCol.findOne(query);
      for (let ncard of ncardUser.mycards) {
        console.log("ncard:", ncard);
        if (Equal(ncard, card)) {
          return true;
        }
      }
      return false;
    } finally {
      await client.close();
    }
  };

  myDB.deleteCard = async (currentUser, id) => {
    const client = new MongoClient(url);
    try {
      await client.connect();
      const database = client.db(DB_NAME);
      const cardsCol = database.collection(collections);
      const query = { username: currentUser };
      console.log("current user", currentUser);
      console.log("current id", id);

      await cardsCol.updateOne(
        query,
        { $pull: { mycards: { id: id } } },
        { multi: true }
      );
      const ncardUser = await cardsCol.findOne(query);
      console.log("after", ncardUser);
      for (let ncard of ncardUser.mycards) {
        if (ncard.id === id) {
          return false;
        }
      }
      return true;
    } finally {
      await client.close();
    }
  };

  return myDB;
}

export default MyMongoDB();
