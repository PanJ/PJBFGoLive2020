import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import WeddingDate from "../components/WeddingDate";
import WeddingLocation from "../components/WeddingLocation";
import heroImage from "../static/hero-2.jpg";
import names from "../static/names.png";
import footer from "../static/footer.jpg";
import { useAuthState } from "react-firebase-hooks/auth";
import { useObjectVal } from "react-firebase-hooks/database";
import firebase from "../Firebase";
import ClipLoader from "react-spinners/ClipLoader";
const auth = firebase.auth();
const login = async () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  await auth.signInWithRedirect(provider);
};

const activeButton =
  "font-bold w-1/3 block text-white bg-rose block my-2 mx-2 font-en p-2 rounded";
const normalButton =
  "font-bold w-1/3 block hover:text-white hover:bg-rose block my-2 mx-2 text-rose font-en p-2 border-solid border border-rose rounded";

export const WeddingReception = () => {
  const [user, authLoading] = useAuthState(auth);
  const ref = user ? firebase.database().ref(`users/${user.uid}`) : null;
  const [userData, userLoading] = useObjectVal(ref);
  useEffect(() => {
    const answer = window.localStorage.getItem("answer");
    if (answer && user && userData && userData.answer !== answer) {
      ref.update({
        answer,
        guest: -1,
      });
      window.localStorage.removeItem("answer");
    }
  }, [user, ref, userData]);
  useEffect(() => {
    if (!authLoading && user?.uid && !userLoading && userData === null) {
      ref.update({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        guest: -1,
      });
    }
  }, [user, userData, userLoading, ref, authLoading]);
  const handleRSVP = useCallback(
    async (e) => {
      if (!user) {
        window.localStorage.setItem(
          "answer",
          !e.target.value ? null : e.target.value
        );
        await login();
      } else {
        ref.update({
          answer: e.target.value,
          guest: -1,
        });
      }
    },
    [user, ref]
  );
  const handleGuest = useCallback(
    async (e) => {
      const guest =
        (!e.target.value || e.target.value) === "null"
          ? null
          : parseInt(e.target.value);
      ref.update({
        guest,
      });
    },
    [ref]
  );
  const handleMessage = useCallback(
    async (e) => {
      ref.update({
        message: e.target.value,
      });
    },
    [ref]
  );

  if (authLoading || userLoading) {
    return (
      <div className="flex flex-col w-full h-screen items-center justify-center">
        <ClipLoader size={80} color={"#E0A083"} loading />
      </div>
    );
  }
  return (
    <Layout>
      <img className="w-full" src={heroImage} alt="PJBF" />
      <div className="mt-5 font-en font-bold text-sm tracking-widest text-center text-rose">
        Save the date
      </div>
      <div className="px-10 pt-8">
        <img className="mx-auto" src={names} alt="Kornkanok and Panjamapong" />
      </div>
      <div className="my-12 mb-4 font-en text-rose text-center font-bold text-2xl tracking-widest">
        <div>Wedding Reception</div>
      </div>

      <MainWrapper>
        <WeddingDate date="29" />
        <div className="text-center font-en text-green py-8">
          <p className="">Saturday August 29, 2020</p>
          <p className="text-2xl font-bold">6:00pm onwards</p>
          <p className="text-rose my-3">(Cocktail reception)</p>

          {!authLoading && !userLoading && !userData?.answer && (
            <>
              <p className="mt-6 w-3/4 mx-auto">
                We would love to know if you can join our wedding reception.{" "}
              </p>
              <div className="flex flex-row mx-6 mt-5">
                <button
                  value="no"
                  onClick={handleRSVP}
                  className="font-bold w-1/2 block hover:text-white hover:bg-rose block my-2 mx-2 text-rose font-th p-2 border-solid border border-rose rounded"
                >
                  Can't go{" "}
                  <span role="img" aria-label="Sad emoji">
                    😞
                  </span>
                </button>
                <button
                  value="yes"
                  onClick={handleRSVP}
                  className="font-bold w-1/2 block text-white bg-rose block my-2 mx-2 font-th p-2 rounded"
                >
                  Going!{" "}
                  <span role="img" aria-label="Hooray">
                    🎉
                  </span>
                </button>
              </div>
            </>
          )}
          {!authLoading && userData?.answer === "yes" && userData?.guest < 0 && (
            <>
              <p className="mt-6 w-3/4 mx-auto">
                Could you tell us how many guests are you bringing? (Excluding
                yourself)
              </p>
              <div className="flex flex-row mx-6 mt-5">
                <button
                  value="0"
                  onClick={handleGuest}
                  className={
                    !userData?.guest || userData?.guest === 0
                      ? activeButton
                      : normalButton
                  }
                >
                  Just me
                </button>

                <button
                  value="1"
                  onClick={handleGuest}
                  className={
                    userData?.guest === 1 ? activeButton : normalButton
                  }
                >
                  1 guest
                </button>
                <button
                  value="2"
                  onClick={handleGuest}
                  className={
                    userData?.guest === 2 ? activeButton : normalButton
                  }
                >
                  2 guests
                </button>
              </div>
              <div className="flex flex-row mx-6 mt-5">
                <button
                  value=""
                  onClick={handleRSVP}
                  className="w-full block my-2 mx-2 text-rose font-th p-2"
                >
                  Change my answer
                </button>
              </div>
            </>
          )}

          {!authLoading && userData?.answer === "yes" && userData?.guest >= 0 && (
            <>
              <p className="mt-6 w-3/4 mx-auto">
                We received your response. See you at the event!!!
              </p>
              <div className="text-center">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="http://www.google.com/calendar/event?action=TEMPLATE&dates=20200829T110000Z%2F20200829T150000Z&text=Baifern%20%26%20PanJ%20Wedding%20Reception&location=Grand%20Mercure%20Bangkok%20Fortune&details=For%20details%2C%20please%20see%20here%3A%20https%3A%2F%2Fw.panjs.com%2Fb"
                  className="mx-auto text-large font-bold inline-block text-white bg-rose block my-4 mx-2 font-en p-3 rounded"
                >
                  Add to Google Calendar
                </a>
              </div>
              <div className="flex flex-row mx-6 mt-5">
                <button
                  value=""
                  onClick={handleRSVP}
                  className="w-full block my-2 mx-2 text-rose font-th p-2"
                >
                  Change my answer
                </button>
              </div>
            </>
          )}
          {!authLoading && userData?.answer === "no" && (
            <>
              <p className="mt-6 w-3/4 mx-auto">
                It's too bad you can't join us! Instead, you can set leave us a
                message below
              </p>
              <div className="flex flex-row mx-6 mt-5">
                <textarea
                  onChange={handleMessage}
                  value={userData.message}
                  className="w-full h-40 p-4 border border-solid border-lightGreen rounded"
                ></textarea>
              </div>
              {userData.message && userData.message.length > 3 && (
                <p className="mt-6 w-3/4 mx-auto text-lightGreen">
                  Your message is auto-saved!
                </p>
              )}

              <div className="flex flex-row mx-6 mt-5">
                <button
                  value=""
                  onClick={handleRSVP}
                  className="w-full block hover:text-white hover:bg-rose block my-2 mx-2 text-rose font-th p-2 border-solid border border-rose rounded"
                >
                  I can now join the event!
                </button>
              </div>
            </>
          )}

          <div className="my-6">
            <ClipLoader
              size={100}
              color={"#E0A083"}
              loading={authLoading || userLoading}
            />
          </div>
        </div>
        <div className="wedding-location-wrapper">
          <WeddingLocation date="29" />
        </div>

        <div className="mt-4 px-8 py-2 text-green font-th">
          Dress code is not specified.
        </div>
        <div className="font-en mt-12 mb-8 text-xs text-green font-normal text-center">
          #PJBFGoLive2020
        </div>
        <img src={footer} alt="Kornkanok and Panjamapong" />
      </MainWrapper>
    </Layout>
  );
};

const MainWrapper = styled.div`
  .wedding-name-wrapper {
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .wedding-name {
    font-family: Anuphan;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 31px;
    text-align: center;

    color: #e0a083;
  }

  .wedding-date {
    margin-top: 26px;
    margin-bottom: 26px;

    font-family: Anuphan;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 23px;
    text-align: center;

    color: #264a39;
  }

  .wedding-location-wrapper {
    margin-left: 34px;
    margin-right: 34px;
  }
`;
