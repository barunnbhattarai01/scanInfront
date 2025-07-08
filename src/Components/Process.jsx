import { useEffect, useState } from "react";
import Columns from "./Columns";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { BACKENDURL } from "../configuration";
import { useNavigate } from "react-router-dom";

const COLUMNS = [
  { id: "New", title: "New" },
  { id: "Qualified", title: "Qualified" },
  { id: "Proposition", title: "Proposition" },
  { id: "Won", title: "Won" },
];

const initial = [
  {
    id: "1",
    title: "Research project",
    description: "Gather requirements and create initial documentation",
    status: "New",
  },
  {
    id: "2",
    title: "Client onboarding",
    description: "Walk client through the product tour",
    status: "New",
  },
  {
    id: "3",
    title: "Design wireframes",
    description: "Create low-fidelity wireframes for homepage",
    status: "Qualified",
  },
  {
    id: "4",
    title: "Internal review",
    description: "Review feedback from design team",
    status: "Qualified",
  },
  {
    id: "5",
    title: "Prepare pitch",
    description: "Compile all documents and get ready for client meeting",
    status: "Proposition",
  },
  {
    id: "6",
    title: "Send proposal",
    description: "Send detailed proposal and pricing",
    status: "Proposition",
  },
  {
    id: "7",
    title: "Finalize deal",
    description: "Negotiate final terms and close the deal",
    status: "Won",
  },
  {
    id: "8",
    title: "Launch prep",
    description: "Prep resources and kickoff tasks",
    status: "Won",
},
];

export default function Process({ companyID }) {
  const [task, setTask] = useState(initial);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchProcess() {
      try {
        const url = `${BACKENDURL}/getprocessbycompany/` + companyID;
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
      
        if(data == null){
          return; 
        }

        const tasksFromApi = data.map((val) => ({
          id: val.id,
          title: val.title,
          description: val.description,
          status: val.status,
        }));
        
        setTask(tasksFromApi);
      } catch (e) {
        alert(`Failed to fetch process: ${e.message}`);
      }
    }

    fetchProcess();
  }, [navigate]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTask((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );
  }

  return (
    <div className="p-4 flex flex-row gap-2">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        {COLUMNS.map((c) => (
          <Columns
            key={c.id}
            column={c}
            task={task.filter((t) => t.status === c.id)}
          />
        ))}
      </DndContext>
    </div>
  );
}
