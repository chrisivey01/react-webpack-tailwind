import { Box } from "@mui/material";
import { useRecoilValue } from "recoil";
import { SecurityGroup } from "../../../../types/PhxUser";
import { SECURITY_GROUP_SAVE_REQUEST } from "../../../apis";
import { httpRequestList } from "../../../apis/requests";
import { createGroupState, useCreateGroup } from "../../../features/Groups/atoms/createGroup";
import { groupState, useGroups } from "../../../features/Groups/atoms/groups";
import { Severity } from "../../../features/Notification/atom";
import { SaveButton } from "../styles";

type Props = {
    app: any;
    setNotification: any;
};

type SaveParams = {
    userId: string,
    securityGroupList: SecurityGroup[];
};

const Groups = ({ app, setNotification }: Props) => {
    const group = useRecoilValue(groupState);
    const setGroup = useGroups();
    const createGroup = useRecoilValue(createGroupState);
    const setCreateGroup = useCreateGroup();


    const saveHandler = async () => {
        let params = {
            userId: app.employee.employeeId,
            securityGroupList: [],
        } as SaveParams;

        params.securityGroupList.push(group.selectedGroup);

        if (createGroup.createdPending) {
            let copyGroupsMasterList = JSON.parse(JSON.stringify(group.groupsMasterList));
            copyGroupsMasterList.push({
                groupName: group.selectedGroup?.groupName
            });
            setGroup((state: any) => ({
                ...state,
                groupsMasterList: copyGroupsMasterList,
            }));
        }


        try {
            await httpRequestList(SECURITY_GROUP_SAVE_REQUEST, params);
            setNotification((state: any) => ({
                ...state,
                show: true,
                message: "Save Success!",
                severity: Severity.success,
            }));
            setGroup((state: any) => ({
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
        }
        setCreateGroup((state) => ({
            ...state,
            createdPending: false
        }));
    };

    const newGroupHandler = () => {
        setCreateGroup((state) => ({
            ...state,
            show: true,
        }));
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
            <SaveButton sx={{ backgroundColor: "#0063cc" }} onClick={() => newGroupHandler()}>
                New Group
            </SaveButton>
            <SaveButton sx={{
                backgroundColor: createGroup.createdPending || group.savePending
                    ? "#00FF00"
                    : "#0063cc",
            }} onClick={() => saveHandler()}>Save</SaveButton>
        </Box>
    );
};

export default Groups;