import Head from "next/head";
import { useState } from "react";
import Div100vh from "react-div-100vh";

import Button from "../components/button";
import Input from "../components/input";
import TopBar from "../components/top-bar";
import { isDev } from "../lib/utils";

export function Welcome() {
  const [pageToSearch, setPageToSearch] = useState("");
  const [pageExists, setPageExists] = useState<any>();
  const [searchState, setSearchState] = useState("");
  const [errorMessage, setErrorMessage] = useState<any>();

  async function checkIfPageExists(e) {
    e.preventDefault();
    if (pageToSearch) {
      setSearchState("SEARCHING");
      try {
        let res = await fetch(`/api/app?app=${pageToSearch}`);
        if (res.status === 200) {
          setSearchState("ERROR");
          setPageExists({ name: `${pageToSearch}.static.fun` });
          return;
        }
        if (res.status === 404) {
          goToApp(pageToSearch);
        } else {
          let { message, stack } = await res.json();
          throw new Error(message);
        }
      } catch (e) {
        console.log(e.message);
        setErrorMessage(e.message);
        setSearchState("NETWORK_ERROR");
        return;
      }
    }
  }

  function goToApp(app) {
    if (isDev(window.location.host)) {
      window.location.href = `http://localhost:3000/?app=${app}`;
    } else {
      window.location.href = `https://${app}.svelterepl.site`;
    }
  }

  function pageSearchInputHandler(e) {
    if (searchState) {
      setSearchState("");
      setPageExists(null);
    }
    setPageToSearch(e.target.value.toLowerCase());
  }

  function renderButton() {
    switch (searchState) {
      case "SEARCHING":
        return (
          <Button bg="#cdae8f" disabled fontSize={32}>
            ⏳
          </Button>
        );
        break;
      case "ERROR":
        return (
          <Button bg="#f3424d" disabled fontSize={32}>
            →
          </Button>
        );
        break;
      case "NETWORK_ERROR":
        return (
          <Button bg="#000000" onClick={checkIfPageExists} fontSize={24}>
            ❌
          </Button>
        );
        break;
      default:
        return (
          <Button bg="#9b51e0" onClick={checkIfPageExists} fontSize={32}>
            →
          </Button>
        );
        break;
    }
  }

  return (
    <Div100vh>
      <Head>
        <title>Static Fun</title>
        <link rel="icon" href="/static/favicon.ico" type="image/x-icon" />
      </Head>
      <TopBar grayScale={Boolean(pageExists)} />
      <div className="welcome-container">
        <div className="welcome">
          <h1>Welcome to</h1>
          <div>
            <span className="static">static</span>
            <span className="fun">.fun</span>
          </div>
          <p>
            An{" "}
            <a href="https://github.com/vercel/static-fun" target="_blank">
              open source project
            </a>{" "}
            to demonstrate Vercel's support of{" "}
            <a href="https://vercel.com/blog/wildcard-domains" target="_blank">
              wildcard domains
            </a>
          </p>
        </div>
        <h2>To start go to</h2>
        <form className="form" onSubmit={checkIfPageExists}>
          <Input
            required
            color="#9b51e0"
            value={pageToSearch}
            onChange={pageSearchInputHandler}
            height={53}
            bg={null}
            borderColor={searchState === "ERROR" ? "#f3424d" : null}
            placeholder="my-fun-page"
            width={180}
            style={{ maxWidth: "40vw" }}
          />
          <span className="suffix">.static.fun</span>
          {renderButton()}
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {pageExists && (
          <p className="page-exists">
            🚨
            <a href={`https://${pageExists.name}`}>{pageExists.name}</a> taken!
            Try another one.
          </p>
        )}
        <div className="emojis" />
      </div>
      <style jsx>{`
          .welcome-container {
          display: flex;
          height: calc(100% - 50px);
          flex-direction: column;
          align-items: center;
        }
        .welcome {
          flex: 1 0 300px;
          padding: 30px 0 15px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .welcome span {
          font-weight: bold;
          font-size: 64px;
        }
        .welcome .static {
          color: #9b51e0;
        }
        .welcome .fun {
          font-family: "Comic Sans", "Comic Sans MS", "Chalkboard",
            "ChalkboardSE-Regular", monospace;
        }
        .welcome p {
          margin: 32px auto 0;
          padding: 0 15px;
          width: 650px;
          max-width: 100%;
          font-size: 14px;
          line-height: 28px;
          text-align: center;
          font-family: Menlo, monospace;
        }
        .welcome a {
          font-weight: bold;
          color: black;
        }
        .form {
          flex: 0;
          display: flex;
          align-items: center;
          text-align: center;
          margin-top: 15px;
          margin-bottom: 15px;
          white-space: nowrap;
          min-height: 50px;
        }
        .form h2 {
          margin-bottom: 16px;
        }
        .form .suffix {
          font-family: "Comic Sans", "Comic Sans MS", "Chalkboard",
            "ChalkboardSE-Regular", monospace;
          font-weight: bold;
          font-size: 18px;
          margin-left: 4px;
          margin-right: 8px;
        }

        .page-exists,
        .error-message {
          color: red;
          margin-top: 8px;
          font-family: Menlo, monospace;
          text-transform: uppercase;
        }
        .page-exists a {
          color: red;
        }
        .emojis {
          flex: 0 1 660px;
          width: 100%;
          background-image: url("/static/emoji-bg.png");
          background-repeat: repeat-x;
          background-size: auto 85%;
          background-position: bottom;
          pointer-events: none;
        }
        .powered-by {
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: fixed: 
          bottom: 0;
          width: 100%;
          height: 80px;
          color: white;
          background: #0085ff;
	}
	
	.powered-by a {
          color: white;
	  font-weight: bold;  
	  margin-left: 8px;
        }
	  
        @media (max-width: 899px) {
	    .powered-by {
		display: none;
        }
}

      `}</style>
      <style jsx>{`
        .welcome,
        .emojis {
          filter: ${pageExists ? "grayscale(1)" : "none"};
        }
      `}</style>
    </Div100vh>
  );
}
