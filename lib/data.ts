import { getApp, getQueryParams } from "./utils";

async function getAppData(href): Promise<any> {
  const query = getQueryParams(window.location);
  const app = getApp(window.location.host, query);

  if (!app) {
    return;
  }

  let res = await fetch(`/api/app?app=${app}`);

  if (res.status === 200) {
    let { html, allowEdit, token } = await res.json();
    return { html, allowEdit, editLink: `${href}?edit=${token}` };
  }

  if (res.status === 404) {
    let { html, token } = await res.json();
    return { html, editLink: `${href}?edit=${token}` };
  }

  if (!res.ok && res.status !== 404) {
    let { stack, message } = await res.json();
    return { errorCode: res.status, stack, message };
  }
}

const defaultMarkup = `
<h1>Welcome to<br> static.fun!</h1>


`;

export { getAppData, defaultMarkup };
