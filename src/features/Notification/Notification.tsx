import { Alert, Snackbar } from "@mui/material";
import { useRecoilValue } from "recoil";
import { notificationState, useNotification } from "./atom";

export const Notification = () => {
    const notification = useRecoilValue(notificationState);
    const setNotification = useNotification();

    const closeHandler = () => {
        setNotification((state) => ({ ...state, show: false }));
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={notification.show}
            autoHideDuration={4000}
            onClose={closeHandler}
        >
            <Alert variant="filled" severity={notification.severity}>
                {notification.message}
            </Alert>
        </Snackbar>
    );
};
