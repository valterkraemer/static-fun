import Head from "next/head";
import Div100vh from "react-div-100vh";

import EditorContainer from "../components/editor";
import TopBar from "../components/top-bar";

export function EditorLayout({ html, editLink }) {
  return (
    <Div100vh>
      <Head>
        <title>Static Fun</title>
        <link rel="icon" href="/static/favicon.ico" type="image/x-icon" />
      </Head>
      <TopBar info />
      <EditorContainer html={html} editLink={editLink} />
    </Div100vh>
  );
}
