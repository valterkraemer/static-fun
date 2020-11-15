import faunadb from "faunadb";
import uid from "uid-promise";

import { getApp } from "../../lib/utils";
import { client } from "../../lib/db";

const { Get, Match, Index, Update, Create, Collection } = faunadb.query;

async function get(req, res) {
  let {
    query: { app },
    cookies: { token, linkToken }
  } = req;

  console.log("GET");

  if (!app) {
    res.status(400).json({ message: "Bad Request: provide an app to query" });
    return;
  }

  if (app === "www") {
    res.status(200).json({ html: null });
    return;
  }

  let sessionId;

  if (linkToken) {
    sessionId = linkToken;
    res.setHeader("Set-Cookie", `token=${linkToken}`);
  } else if (token && !linkToken) {
    sessionId = token;
    res.setHeader("Set-Cookie", `token=${token}`);
  } else {
    try {
      sessionId = await uid(10);
      token = sessionId;
      res.setHeader("Set-Cookie", `token=${token}`);
    } catch (e) {
      console.error({ stack: e.stack, message: e.message });
      res.status(500).json({ stack: e.stack, message: e.message });
      return;
    }
  }

  try {
    let {
      data: { sessionId: appSessionId, html }
    } = (await client.query(Get(Match(Index("app_by_slug"), app)))) as any;

    if (appSessionId === sessionId) {
      res.status(200).json({ html, allowEdit: true, token });
      return;
    } else {
      res.status(200).json({ html, allowEdit: false, token });
      return;
    }
  } catch (error) {
    if (error.name === "NotFound") {
      res.status(404).json({ html: null, token });
      return;
    }

    if (error.syscall === "getaddrinfo") {
      res.status(500).json({
        stack: error.stack,
        message:
          "There was a network error, please check connection and try again"
      });
      return;
    } else {
      console.error({ error });
      res.status(500).json({ stack: error.stack, message: error.message });
      return;
    }
  }
}

async function post(req, res) {
  let {
    cookies: { token },
    body: { html },
    headers: { host },
    query
  } = req;

  console.time("SAVE");

  const sessionId = token;

  const appSlug = getApp(host, query);

  if (!appSlug) {
    return;
  }

  try {
    const {
      data: { sessionId: appSessionId },
      ref
    } = (await client.query(Get(Match(Index("app_by_slug"), appSlug)))) as any;

    if (sessionId === appSessionId) {
      await client.query(
        Update(ref, {
          data: {
            html
          }
        })
      );
    }

    res.setHeader("Set-Cookie", `token=${token}`);
    res.status(200).json({ editLink: `${req.headers.host}/?edit=${token}'` });
    return;
  } catch (e) {
    if (e.name === "NotFound") {
      try {
        await client.query(
          Create(Collection("apps"), {
            data: {
              sessionId,
              html,
              slug: appSlug
            }
          })
        );
        res.setHeader("Set-Cookie", `token=${token}`);
        res
          .status(200)
          .json({ editLink: `${req.headers.host}/?edit=${token}'` });
        return;
      } catch (e) {
        console.error(new Error(e.message));
        res.status(500).json({ stack: e.stack, message: e.message });
        return;
      }
    } else {
      console.error(new Error(e.message));
      res.status(500).json({ stack: e.stack, message: e.message });
      return;
    }
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return get(req, res);
  } else if (req.method === "POST") {
    return post(req, res);
  }

  res.status(404).json({});
}
