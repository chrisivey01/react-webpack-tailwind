import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "../../../types/Nav";
import fedexImg from "../../assets/fedex.png";

type Props = {
    navigation: any[];
};

export const Head = ({ navigation }: Props) => {
    const navigate = useNavigate();
    return (
        <AppBar position="static">
            <Toolbar>
                <img
                    src={fedexImg}
                    alt="Workflow"
                    style={{ width: 80, height: 80 }}
                />
                <Box style={{ width: "100%" }}>
                    <Box
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        {navigation.map((nav: Nav, index: number) => (
                            <Button
                                key={index}
                                onClick={() => navigate(nav.to)}
                                style={{ color: "inherit" }}
                            >
                                {nav.name}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

{
    /* <Button color="inherit">Login</Button>
<Button color="inherit">Login</Button>
<Button color="inherit">Login</Button> */
}
// <Disclosure as="nav" className="bg-gray-800">
// <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="flex items-center justify-between h-16">
//         <div className="flex items-center">
//             <div className="flex-shrink-0">
//                 <img
//                     className="h-20 w-20"
//                     src={fedexImg}
//                     alt="Workflow"
//                 />
//             </div>
//             <div className="hidden md:block">
//                 <div className="ml-10 flex items-baseline space-x-4">
//                     {navigation.map((item, index) => (
//                         <Link
//                             onClick={() => headerHandler(index)}
//                             key={item.name}
//                             to={item.to}
//                             className={classNames(
//                                 item.current
//                                     ? "bg-gray-900 text-white"
//                                     : "text-gray-300 hover:bg-gray-700 hover:text-white",
//                                 "px-3 py-2 rounded-md text-sm font-medium"
//                             )}
//                             aria-current={
//                                 item.current
//                                     ? "page"
//                                     : undefined
//                             }
//                         >
//                             {item.name}
//                         </Link>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>
// </Disclosure>
