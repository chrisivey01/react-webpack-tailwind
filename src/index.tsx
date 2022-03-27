import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import { Debug } from "./Debug";


Sentry.init({
    dsn: "https://e5c458938c4640ee938e8d0d7def5a84@o1171589.ingest.sentry.io/6266132",
    integrations: [new BrowserTracing()],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

ReactDOM.render(
    <HashRouter>
        <RecoilRoot>
            <Debug />
            <App />
        </RecoilRoot>
    </HashRouter>,
    document.getElementById("root")
);
