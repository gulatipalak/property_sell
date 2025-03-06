import { ReactNode } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface PanelLayoutProps {
    children : ReactNode;
}

const PanelLayout = ({children}: PanelLayoutProps) => {
    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex-1">
                <Header/>
                <div className="bg-white h-[calc(100vh-60px)] overflow-y-auto rounded-tl-[20px] p-[40px]">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default PanelLayout;