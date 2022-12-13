// Kuan Tsa Chen
import "./search.css";
import Card from "../../components/Card";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const SearchScreen = () => {
  const [user, setUser] = useState(undefined);
  const [isSearched, setIsSearched] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams("");
  const [searchCardData, setSearchCardData] = useState([]);

  const getUser = () => {
    fetch("/getusers")
      .then((res) => res.json())
      .then((user) => {
        console.log("home screen getuser", user.user);
        setUser(user.user);
      })
      .catch(() => {
        console.log("home screen fail");
      });
  };
  const changeUser = (prop) => {
    setUser(prop);
  };
  useEffect(getUser, []);
  const [cards, setCards] = useState([]);
  // const [user, setUser] = useState({});
  const [searchContent, setSearchContent] = useState("");

  const handeler = (evt) => {
    evt.preventDefault();
    setIsSearched(true);
    console.log("search content", searchContent);
    console.log("query", searchParams.get("query"));
    fetch(`/api/searchCards/?query=${searchContent}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => setSearchCardData(data));
  };

  const populateCards = () => {
    fetch(`/getPublicCards`)
      .then((res) => res.json())
      .then((item) => {
        console.log("fetching public cards");
        if (item.length > 20) {
          item = item.subarray(20);
        }
        setCards(item);
        console.log("current cards len", item);
      })
      .catch(() => {
        console.log("fetching error");
      });
  };

  useEffect(populateCards, []);

  const renderCards = () => {
    if (!isSearched) {
      return cards !== undefined && cards.length > 0 ? (
        cards.map((items) => (
          <div className="col-sm-3" key={items.id}>
            <Card currentUser={items} status={true} />
          </div>
        ))
      ) : (
        <h3 className="p-3">You don't have any cards here!</h3>
      );
    } else {
      const searchSize = searchCardData.searchSize;
      const searchData = searchCardData.data;
      return searchData !== undefined && searchData.length > 0 ? (
        searchData.map((items) => (
          <div className="col-sm-3" key={items.id}>
            <Card currentUser={items} status={true} />
          </div>
        ))
      ) : (
        <h3 className="p-3">No Cards Found</h3>
      );
    }
  };

  return (
    <main>
      <Navigation current={user} changeUser={changeUser} />
      <div className="row">
        <div className="col-10 pt-5 search-bar">
          <div className="search-input m-5">
            <h1>Find Your Card!</h1>
            <input
              type="text"
              id="search-input"
              placeholder="Search Cards..."
              value={searchContent}
              onChange={(event) => {
                setSearchContent(event.target.value);
                setSearchParams(event.target.value);
              }}
            ></input>
            <button className="search-button mx-3" onClick={handeler}>
              Search
            </button>
          </div>
          <div className="search-result px-5">
            <div className="row">{renderCards()}</div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};
export default SearchScreen;
