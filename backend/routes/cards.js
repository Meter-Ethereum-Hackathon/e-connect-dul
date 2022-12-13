// Kuan Tsa Chen
import express from "express";
import myDB from "../db/cardDB.js";

const cardrouter = express.Router();

// create
cardrouter.post("/createMyCard", async (req, res) => {
  const card = req.body;
  card.username = req.session.user;
  console.log("createmycard session user", req.session.user);
  console.log("card:", card);

  const ret = await myDB.createCard(card.username, card);
  if (ret) {
    res.send("successful");
  } else {
    res.send("failure");
  }
});

// read
cardrouter.get("/getMyCards", async (req, res) => {
  console.log("getmycard session user", req.session.user);
  const current = req.session.user;
  const flag = "mine";
  if (current !== undefined) {
    const ret = await myDB.fetchingCards(current, flag);
    if (ret) {
      console.log("success");
      res.send(ret);
    } else {
      console.log("fail");
      res.send({});
    }
  }
});

cardrouter.get("/getOtherCards", async (req, res) => {
  const current = req.session.user;
  const flag = "other";
  if (current !== undefined) {
    const ret = await myDB.fetchingCards(current, flag);
    res.send(ret);
  } else {
    res.send({});
  }
});

cardrouter.get("/getPublicCards", async (req, res) => {
  const ret = await myDB.fetchingPublicCards();
  if (ret) {
    console.log("publiccard ret", ret);
    res.send(ret);
  } else {
    res.send({});
  }
});

// update
cardrouter.post("/updateCard", async (req, res) => {
  const currentUser = req.session.user;
  const card = req.body;

  if (currentUser !== undefined) {
    const ret = await myDB.updateCard(currentUser, card);
    if (ret) {
      console.log("update fetch successful");
    } else {
      console.log("update fetch failure");
    }
    res.json(ret);
  } else {
    console.log("User undefined");
    res.json({});
  }
});

// delete
cardrouter.post("/deleteCard", async (req, res) => {
  const id = req.body.id;
  console.log("id:", id);
  const currentUser = req.session.user;

  if (currentUser !== undefined) {
    const ret = await myDB.deleteCard(currentUser, id);
    if (ret) {
      console.log("delete fetch successful");
    } else {
      console.log("delete fetch failure");
    }
    res.json(ret);
  } else {
    console.log("User undefined");
    res.json({});
  }
});

//find
cardrouter.post("/api/searchCards", async (req, res) => {
  const keyword = req.query.query;
  const [getResults, getResultsSize] = await myDB.searchCards(keyword);
  res.status(200).json({ data: getResults, size: getResultsSize });
});

export default cardrouter;
