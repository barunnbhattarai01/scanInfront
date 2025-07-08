import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";

export default function Column({ column, task }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-90 flex-col rounded-lg bg-white p-4 max-h-400  min-h-180 transition-colors duration-200 ${
        isOver ? "bg-sky-500" : ""
      }`}
    >
      <h2 className="mb-4 font-semibold">{column.title}</h2>
      <div className="flex flex-1 flex-col gap-4">
        {task.map((t) => (
          <div key={t.id}>
            <Card task={t} />
          </div>
        ))}
      </div>
    </div>
  );
}
