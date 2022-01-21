import { Disclosure } from "@headlessui/react";
import { Link } from "react-router-dom";
import fedexImg from "../../assets/fedex.png";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

type Props = {
    navigation: any[];
    headerHandler: any;
};

export const Head = ({ navigation, headerHandler }: Props) => {
    return (
        <div>
            <Disclosure as="nav" className="bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-20 w-20"
                                    src={fedexImg}
                                    alt="Workflow"
                                />
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navigation.map((item, index) => (
                                        <Link
                                            onClick={() => headerHandler(index)}
                                            key={item.name}
                                            to={item.to}
                                            className={classNames(
                                                item.current
                                                    ? "bg-gray-900 text-white"
                                                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                                "px-3 py-2 rounded-md text-sm font-medium"
                                            )}
                                            aria-current={
                                                item.current
                                                    ? "page"
                                                    : undefined
                                            }
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Disclosure>
        </div>
    );
};
