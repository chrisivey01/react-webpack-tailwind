import { Box } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { PhxUser, SecurityGroup, SecurityUserGroup } from "../../../../types/PhxUser";
import { PHX_USER_REQUEST, PHX_USER_SAVE_CONTROLLER } from "../../../apis";
import { httpRequestList } from "../../../apis/requests";
import { appState } from "../../../atom/app";
import { Severity } from "../../../features/Notification/atom";
import { userState, useUser } from "../../../features/Users/atoms/users";
import { SaveButton } from "../styles";

type Props = {
    app: any;
    setNotification: any;
};

const Users = ({ app, setNotification }: Props) => {
    const user = useRecoilValue(userState);
    const setUser = useSetRecoilState(userState);
    const saveHandler = async () => {
        let employee = JSON.parse(JSON.stringify(user.selectedUser));
        let params;
        try {
            params = {
                userId: app.employee.employeeId,
                phxUserList: [employee],
            };

            await httpRequestList(PHX_USER_SAVE_CONTROLLER, params);
            setNotification((state: any) => ({
                ...state,
                show: true,
                message: "Save Success!",
                severity: Severity.success,
            }));

            params = {
                fetchResources: true,
                securityAppEaiNbr: app.appId,
                userId: app.employee.employeeId,
                userIdList: [user.selectedUser.userId]
            };
            const results = await httpRequestList(PHX_USER_REQUEST, params);
            const emp: PhxUser = JSON.parse(JSON.stringify(results.phxUserList[0]));

            setUser((state: any) => ({
                ...state,
                savePending: false
            }));

        } catch (err: any) {
            setNotification((state: any) => ({
                ...state,
                show: true,
                message: err,
                severity: Severity.error,
            }));
            console.log(err);
        }
    };

    return (
        <Box
            style={{
                display: "flex",
                flexWrap: "wrap",
                position: "absolute",
                right: 0,
            }}
        >
            <SaveButton sx={{
                backgroundColor: user.savePending
                    ? "#00FF00"
                    : "#0063cc",
            }} onClick={() => saveHandler()}>Save</SaveButton>
        </Box>
    );
};

export default Users;