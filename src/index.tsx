import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import { Debug } from "./Debug";

ReactDOM.render(
    <HashRouter>
        <RecoilRoot>
            <Debug />
            <App />
        </RecoilRoot>
    </HashRouter>,
    document.getElementById("root")
);
