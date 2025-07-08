import { useDraggable } from "@dnd-kit/core";
import { useRef } from "react";

export default function Card({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <>
      <div
        style={style}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="cursor-grab rounded-lg bg-gray-200 p-4 shadow-xl hover:shadow-2xl hover:scale-105"
      >
        <h3 className="font-medium "> {task.title}</h3>
        <p className="font-medium  ">{task.description}</p>
      </div>
    </>
  );
}
