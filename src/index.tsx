import ReactDOM from "react-dom";
import Root from "./Root";
import store from "./store/store";
import { Provider } from "react-redux";
import { Web3ContextProvider } from "./hooks";
import { SnackbarProvider } from "notistack";
import SnackMessage from "./components/Messages/snackbar";
import Snowflakes from "magic-snowflakes";

const snowflakes = new Snowflakes({
    color: "#fff", // Default: "#5ECDEF"
    count: 30, // 100 snowflakes. Default: 50
    rotation: true, // Default: true
    speed: 0.8, // The property affects the speed of falling. Default: 1
    wind: true, // Without wind. Default: true
    zIndex: 0, // Default: 9999
});

snowflakes.start();

ReactDOM.render(
    <SnackbarProvider
        maxSnack={4}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        content={(key, message: string) => <SnackMessage id={key} message={JSON.parse(message)} />}
        autoHideDuration={10000}
    >
        <Provider store={store}>
            <Web3ContextProvider>
                <Root />
            </Web3ContextProvider>
        </Provider>
    </SnackbarProvider>,
    document.getElementById("root"),
);
