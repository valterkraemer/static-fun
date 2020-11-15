import faunadb from "faunadb";

const FAUNADB_SECRET = process.env.FAUNADB_SECRET;

if (!FAUNADB_SECRET) {
  throw new Error(`FAUNADB_SECRET missing`);
}

export const client = new faunadb.Client({
  secret: FAUNADB_SECRET
});
