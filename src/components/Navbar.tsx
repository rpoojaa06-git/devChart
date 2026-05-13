
import Link from "next/link"

export default function Navbar(){
    return (
        <>
            <div className = "flex justify-between items-center h-auto font-bold bg-black text-teal-200 p-4">
                <Link href="/">
                    <h1 className = "text-2xl"> devChart </h1>
                </Link>
                <div className = "flex  gap-4  ">
                    <Link href="/dashboard">
                        <button className = "rounded-lg py-1.5 px-3  bg-teal-200 text-black"> DashBoard </button>
                    </Link>
                    <Link href="/create-task">
                        <button className = "rounded-lg py-1.5 px-3  bg-teal-200 text-black"> Create Task </button>
                    </Link>
                </div>
            </div>
        </>
    );
}