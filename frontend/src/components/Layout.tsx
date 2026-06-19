import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<div className="h-screen flex flex-col bg-[#f9fafb] overflow-hidden">
			<Header />
			<div className="flex flex-1 overflow-hidden">
				<Sidebar />
				<main className="flex-1 p-8 min-w-0 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}
