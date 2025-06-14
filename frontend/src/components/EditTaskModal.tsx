import React,{ useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import type { Task } from "../types/task";
import { updateTask } from "../api/task";
import { toast } from "react-toastify";

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const EditTaskModal = ({ task, isOpen, onClose, onUpdated }:EditTaskModalProps) => {
  const [formData, setFormData] = useState<Partial<Task>>({});

  const { t } = useTranslation();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate,
        completed: task.completed,
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await updateTask(task.id, formData as Task);
        toast.success(t("task_updated_successfully"));
        onUpdated();
        onClose();
    } catch (error) {
        console.error("Error updating task:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">{t("edit_task")}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">{t("title")}</label>
            <input
              type="text"
              name="title"
              placeholder={t("placeholder_title")}
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full mt-1 border border-slate-300 rounded-lg h-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">{t("priority")}</label>
            <select
              name="priority"
              value={formData.priority || ""}
              onChange={handleChange}
              className="w-full mt-1 border border-slate-300 rounded-lg h-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="low">{t("low")}</option>
              <option value="medium">{t("medium")}</option>
              <option value="high">{t("high")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">{t("due_date")}</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate ? formData.dueDate.slice(0, 10) : ""}
              onChange={handleChange}
              className="w-full mt-1 border border-slate-300 rounded-lg h-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed || false}
              onChange={handleChange}
              className="mr-2 appearance-none h-4 w-4 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent checked:bg-emerald-600 checked:border-transparent"
            />
            <label className="text-sm">{t("completed")}</label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-slate-200 text-slate-800"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-600 text-white"
            >
              {t("save_changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;