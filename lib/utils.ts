export function getQueryParams(location: Location): Record<string, string> {
  const queryParamsString = location.search.substr(1);

  return queryParamsString
    .split("&")
    .reduce((accumulator, singleQueryParam) => {
      const [key, value] = singleQueryParam.split("=");
      accumulator[key] = value;
      return accumulator;
    }, {});
}

export function isDev(host: string) {
  return host.includes("localhost");
}

export function getApp(host: string, params: Record<string, string>) {
  let app;

  if (isDev(host)) {
    app = params.app;
  } else {
    app = host.split(".")[0];
  }

  if (app === "www") {
    return;
  }

  return app;
}
