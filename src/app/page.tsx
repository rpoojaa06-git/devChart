import Navbar from "@/components/Navbar"
import TaskCard from "@/components/TaskCard";
import connectDB from "@/lib/mongodb";



export default async function Home() {

  await connectDB();

  return (
    <div>
      <Navbar />
      <div className="flex flex-wrap items-center justify-center  m-3">
        <div className="max-w-xl">
          <h1 className="text-9xl font-bold text-teal-200 mx-18 mt-18 text-outline-black">
            devChart
          </h1>
          <div className="mx-18 font-medium text-2xl mt-5">
            <h3>An easy tool for managing your tasks and collaborating with your team!!</h3>
            <h2>Have a Nice Time Building...</h2>
          </div>
        </div>
        <img src="/logo.svg" alt="Logo" className="w-xl h-auto mx-auto my-6" />
      </div>
    </div>
  );
}