import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const TaskCard = ({ task, onEdit, onDelete, isOwn, isAdmin }) => {
  const getStatusColor = () => {
    switch (task.status) {
      case "done":
        return "bg-green-100 text-green-700 border-green-300";
      case "inprogress":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-red-100 text-red-700 border-red-300";
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-md hover:shadow-xl transition-all p-6 flex flex-col gap-4">

      
      <div>
        <h3 className="text-xl font-semibold text-slate-900">{task.title}</h3>

        <p className="text-slate-600 text-sm mt-1">
          {task.description || "No description provided"}
        </p>
      </div>

      
      <span
        className={`px-3 py-1 text-xs w-fit rounded-full border ${getStatusColor()}`}
      >
        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
      </span>

      
      <div className="text-xs text-slate-500">
        <p>
          👤 Created by: <span className="font-medium">{task.ownerName}</span>
        </p>

        <p className="mt-1">
          🕒 Created at:{" "}
          {new Date(task.createdAt).toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      
      <div className="flex gap-3 mt-3">

        
        {isOwn && onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Pencil size={14} /> Edit
          </button>
        )}

        
        {(isOwn || isAdmin) && (
          <button
            onClick={() => onDelete(task.id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg shadow hover:bg-red-700 transition"
          >
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
