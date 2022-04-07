import { Box } from "@mui/material";
import { useRecoilValue } from "recoil";
import { SecurityGroup, SecurityUserGroup } from "../../../../types/PhxUser";
import { PHX_USER_SAVE_CONTROLLER } from "../../../apis";
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
    const setUser = useUser();

    const saveHandler = async () => {
        let employee = JSON.parse(JSON.stringify(user.selectedUser));

        // employee.operationCd = "M";
        // let acquiredGroupsCopy = JSON.parse(JSON.stringify(user.acquiredGroups));
        // employee.securityUserGroupList = acquiredGroupsCopy.map((sug: SecurityUserGroup) => {
        //     return {
        //         securityAppEaiNbr: app.appId,
        //         securityGroup: sug,
        //         changeFlag: "I",
        //         operationCd: "I"
        //     };
        // });
        // employee.securityUserRoleList = JSON.parse(JSON.stringify(user.acquiredRoles));

        try {
            let params = {
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
            <SaveButton sx={{ backgroundColor: "#0063cc" }} onClick={() => saveHandler()}>Save</SaveButton>
        </Box>
    );
};

export default Users;