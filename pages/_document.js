import Document, { Html, Head, Main, NextScript } from "next/document";

class StaticFunDoc extends Document {
  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default StaticFunDoc;
