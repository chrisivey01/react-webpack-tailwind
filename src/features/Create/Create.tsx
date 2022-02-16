import {
    Autocomplete,
    Box,
    Button,
    Divider,
    Grid,
    TextField,
} from "@mui/material";
import { CreateHeader } from "./components/CreateHeader";
import { CreateRoleButton, CreateRoleContainer } from "./styles";

interface Props {
    setOpen: any;
    windowType: string;
}
export const Create = ({ setOpen, windowType }: Props) => {
    return (
        <CreateRoleContainer>
            <CreateHeader windowType={windowType} />
            <Divider style={{ margin: 10 }} />
            <Box>
                <Grid
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        paddingTop: 10,
                    }}
                >
                    <CreateRoleButton onClick={() => setOpen(false)}>
                        Ok
                    </CreateRoleButton>
                    <CreateRoleButton onClick={() => setOpen(false)}>
                        Cancel
                    </CreateRoleButton>
                    <CreateRoleButton>Reset</CreateRoleButton>
                </Grid>
            </Box>
        </CreateRoleContainer>
    );
};
