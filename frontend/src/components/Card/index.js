// Kuan Tsa Chen
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "./Card.css";

const Card = ({ currentUser, status }) => {
    const defaultUser = {
        firstName: "Jimmy",
        lastName: "Zhang",
        email: "jimmylovewebdev@gmail.com",
        intro: "Hi, My name is Jimmy and I'm a software engineer. My current focus is taking John's web class.",
        phone: "206123456789",
        job: "Web Developer",
        location: "San Mateo, CA",
        profileImg: "/images/profile-icon1.png",
    };

    const [updateCard, setUpdateCard] = useState(false);
    const user = currentUser === undefined ? defaultUser : currentUser;
    const [isPublic, setIsPublic] = useState(false);
    const settingPub = () => {
        if (status) {
            setIsPublic(true);
        }
    };
    useEffect(settingPub, [status]);

    const onSubmitUpdateCard = (event) => {
        const user = {};
        user.firstName = event.target.firstName.value
            ? event.target.firstName.value
            : currentUser.firstName;
        user.lastName = event.target.lastName.value
            ? event.target.lastName.value
            : currentUser.lastName;
        user.email = event.target.email.value
            ? event.target.email.value
            : currentUser.email;
        user.intro = event.target.intro.value
            ? event.target.intro.value
            : currentUser.intro;
        user.phone = event.target.phone.value
            ? event.target.phone.value
            : currentUser.phone;
        user.job = event.target.job.value
            ? event.target.job.value
            : currentUser.job;
        user.location = event.target.location.value
            ? event.target.location.value
            : currentUser.location;
        user.image = event.target.image.value
            ? event.target.image.value
            : currentUser.image;
        user.id = currentUser.id;
        fetch("/updateCard", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
    };

    const [show, setShow] = useState(true);
    const deleteCard = () => {
        let req = { id: currentUser.id };
        fetch("/deleteCard", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req),
        });
        setShow(false);
    };
    const [disable, setDisable] = useState(false);
    const galleryCard = () => {
        console.log("search rendering", status);
        if (status === "gallery") {
            return "";
        } else if (status === true) {
            return (
                <span>
                    <button
                        type="submit"
                        className="btn btn-primary mx-2"
                        onClick={() => addPublicCard()}
                        disable={disable}
                    >
                        {disable ? "Added" : "Add"}
                    </button>
                </span>
            );
        }
    };
    const addPublicCard = () => {
        setDisable(true);
        fetch("/addPublicCard", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentUser),
        });
    };

    return (
        <>
            <div
                className="card text-center"
                style={{ display: show ? "block" : "none" }}
            >
                <img
                    src={user.profileImg}
                    className="img img-responsive card-icon"
                    alt="card-icon"
                />

                <div
                    className="card-content"
                    style={{ display: updateCard ? "none" : "block" }}
                >
                    <div className="card-name">
                        {user.firstName + " " + user.lastName}
                        <p>{user.email}</p>
                    </div>
                    <div className="card-description">{user.intro}</div>
                    <div className="row">
                        <div className="col-xs-4">
                            <div className="card-overview">
                                <p>PHONE</p>
                                <p>{user.phone}</p>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="card-overview">
                                <p>JOB</p>
                                <p>{user.job}</p>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="card-overview">
                                <p>LOCATION</p>
                                <p>{user.location}</p>
                            </div>
                        </div>
                        <div className="col-xs-4 buttons-container">
                            {isPublic ? (
                                galleryCard()
                            ) : (
                                <span>
                                    <button
                                        onClick={() =>
                                            setUpdateCard((prev) => !prev)
                                        }
                                    >
                                        <img
                                            src="/images/edit-icon2.png"
                                            alt="edit-button"
                                        />
                                    </button>
                                    <button onClick={deleteCard}>
                                        <img
                                            src="/images/delete-icon.png"
                                            alt="delete-button"
                                        />
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className="card-update-form"
                    style={{ display: updateCard ? "block" : "none" }}
                >
                    <form
                        className="updateCard px-1"
                        onSubmit={onSubmitUpdateCard}
                    >
                        <h3>Update your card</h3>
                        <div className="form-group">
                            <label for="firstName">FirstName</label>
                            <input
                                type="FirstName"
                                className="form-control"
                                placeholder={user.firstName}
                                // required={true}
                                name="firstName"
                            ></input>
                        </div>
                        <div className="form-group">
                            <label for="lastName">LastName</label>
                            <input
                                type="lastName"
                                className="form-control"
                                placeholder={user.lastName}
                                // required={true}
                                name="lastName"
                            ></input>
                        </div>
                        <div className="form-group">
                            <label for="email">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder={user.email}
                                // required={true}
                                name="email"
                            ></input>
                        </div>
                        <div className="form-group">
                            <label for="intro">Intro</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={user.intro}
                                // required={true}
                                name="intro"
                            ></input>
                        </div>
                        <div className="form-group">
                            <label for="phone">Phone</label>
                            <input
                                type="phone"
                                className="form-control"
                                placeholder={user.phone}
                                // required={true}
                                name="phone"
                            ></input>
                        </div>
                        <div className="form-group">
                            <label for="job">Job</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={user.job}
                                // required={true}
                                name="job"
                            ></input>
                        </div>
                        <div className="form-group">
                            <label for="location">Location</label>
                            <input
                                type="location"
                                className="form-control"
                                placeholder={user.location}
                                // required={true}
                                name="location"
                            ></input>
                        </div>
                        <div className="form-group">
                            <label for="profieImg">Upload your photo </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control-file"
                                name="image"
                            ></input>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary mx-2"
                            onClick={() => setUpdateCard((prev) => !prev)}
                        >
                            update
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

Card.protoType = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    intro: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    profileImg: PropTypes.string.isRequired,
};

export default Card;
