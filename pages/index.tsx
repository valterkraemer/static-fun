import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Spinner from "../components/spinner";
import { defaultMarkup, getAppData } from "../lib/data";
import { EditorLayout } from "../views/editor";
import { FixedCenterLayout } from "../views/fixed-center";
import { RenderStaticLayout } from "../views/static-layout";
import { Welcome } from "../views/welcome";

export default function IndexPage() {
  const [pageData, setPageData] = useState<any>();
  const [error, setError] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    let href = window.location.href;

    let linkToken = router.query.edit;

    if (linkToken) {
      document.cookie = `linkToken=${linkToken}`;
      window.location.href = "/";
    }

    if (!pageData) {
      getAppData(href)
        .then(data => {
          if (!data) {
            setPageData(null);
            return;
          }
          if (data.errorCode) {
            let { errorCode, stack, message } = data;
            setError({ errorCode, stack, message });
            return;
          }
          let { html, allowEdit, editLink } = data;
          setPageData({ html, allowEdit, editLink });
          return;
        })
        .catch(e => {
          setError({ message: e.message, stack: e.stack });
        });
    }
    return () => {};
  }, [pageData]);

  if (error) {
    return (
      <FixedCenterLayout>
        <div>
          {error.errorCode && <h1>HTTP Status: {error.errorCode}</h1>}
          <h2>{error.message}</h2>
          <img src="https://media.giphy.com/media/953Nn3kYUbGxO/giphy.gif" />
          {error.stack && (
            <div>
              <code>{JSON.stringify(error.stack)}</code>
            </div>
          )}
          <style jsx>{`
            div {
              text-align: center;
            }
            code {
              color: red;
            }
            img {
              max-width: 100%;
            }
          `}</style>
        </div>
      </FixedCenterLayout>
    );
  }

  if (typeof pageData === "undefined") {
    return (
      <FixedCenterLayout>
        <Spinner delay={300} />
      </FixedCenterLayout>
    );
  }

  if (pageData && pageData.html === null) {
    return <EditorLayout html={defaultMarkup} editLink={pageData.editLink} />;
  }

  if (pageData && pageData.html && pageData.allowEdit) {
    return <EditorLayout html={pageData.html} editLink={pageData.editLink} />;
  }

  if (pageData && pageData.html && !pageData.allowEdit) {
    return <RenderStaticLayout html={pageData.html} />;
  }

  return <Welcome />;
}
