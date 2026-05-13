"use client";

import Navbar from "@/components/Navbar"
import TaskCard from "@/components/TaskCard";
import React,{ useState, useEffect } from "react";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  completion: boolean;
};

export default function Home(){

    const [tasks,setTasks] = useState<Task[]>([]);

    async function fetchTasks() {

      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    }

    useEffect(() => {
      fetchTasks();
    }, []);


    return (
      <>
        <Navbar />
        <div className="flex flex-wrap items-start gap-4 m-3">
          {tasks.map((task)=>(
            <TaskCard 
              key={task._id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              completion={task.completion}
            />
          ))}
        </div>
      </>
    );
}