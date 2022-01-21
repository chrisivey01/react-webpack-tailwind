import { useState } from "react";
import { Body } from "./components/Body";
import { Head } from "./components/Head";

const App = () => {
    const [navigation, setNavigation] = useState([
        { name: "Users", to: "/", current: true },
        { name: "Groups", to: "/groups", current: false },
        { name: "Roles", to: "/roles", current: false },
    ]);


    /**
     * Handles the select of the button.
     * @param index integer of selected button
     */
    const headerHandler = (index: number) => {
        let copyNav = [...navigation];
        copyNav.map((nav: any) => {
            nav.current = false;
            return nav;
        });
        copyNav[index].current = true;
        setNavigation(copyNav);
    };

    return (
        <>
            <Head navigation={navigation} headerHandler={headerHandler} />
            <div>
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 py-6 sm:px-0">
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                                <Body />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default App;
