import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import type { Task } from "../types/task";

import { fetchTasks, createTask, updateTask, deleteTask } from "../api/task";

import EditTaskModal from "./EditTaskModal";

import AdjustIcon from "@mui/icons-material/Adjust";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Add from "@mui/icons-material/Add";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TodayIcon from "@mui/icons-material/Today";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextRotateUpOutlinedIcon from "@mui/icons-material/TextRotateUpOutlined";
import TextRotateVerticalOutlinedIcon from "@mui/icons-material/TextRotateVerticalOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [newTask, setNewTask] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const completionRate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const [highPriorityCount, setHighPriorityCount] = useState(0);
  const [dueTodayCount, setDueTodayCount] = useState(0);

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [sort, setSort] = useState<"dueDate" | "priority" | "alphabetical">(
    "dueDate"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { t } = useTranslation();

  const loadTasks = async () => {
    try {
      const fetchedTasks = await fetchTasks(page, 10, sort, sortDirection);

      if (fetchedTasks.tasks.length === 0 && page > 1) {
        setPage(page - 1);
        return;
      }

      setTasks(fetchedTasks.tasks);
      setTotalPages(fetchedTasks.totalPages);
      setCompletedCount(fetchedTasks.completedCount);
      setTotalCount(fetchedTasks.totalItems);
      setHighPriorityCount(fetchedTasks.highPriorityCount);
      setDueTodayCount(fetchedTasks.dueTodayCount);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setTasks([]);
      setTotalPages(1);
      setCompletedCount(0);
      setTotalCount(0);
      setHighPriorityCount(0);
      setDueTodayCount(0);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [page, sort, sortDirection]);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleCreate = async () => {
    const task = await createTask(newTask);
    setTasks([...tasks, task]);
    setNewTask("");
    loadTasks();
  };

  const toggleTask = async (id: number) => {
    const updatedTask = tasks.find((task) => task.id === id);
    if (!updatedTask) return;

    const newTask = { ...updatedTask, completed: !updatedTask.completed };

    setTasks(tasks.map((task) => (task.id === id ? newTask : task)));

    await updateTask(id, newTask);
    loadTasks();
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks(tasks.filter((t) => t.id !== id));
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-slate-50"> 
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 ">
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="bg-white shadow-lg rounded-lg p-6 border border-slate-200">
                <div className="pb-3">
                  <h1 className="text-lg flex items-center gap-2">
                    <AdjustIcon
                      className="text-emerald-600"
                      fontSize="medium"
                    />
                    {t("progress")}
                  </h1>
                </div>
                <div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{t("completion_rate")}</span>
                        <span className="font-semibold">
                          {completionRate}%{" "}
                          {completionRate === 100 ? (
                            <CelebrationOutlinedIcon
                              className="text-emerald-600 mb-2"
                              fontSize="small"
                            />
                          ) : null}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">
                          {completedCount}
                        </div>
                        <div className="text-xs text-slate-600">{t("completed")}</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-700">
                          {totalCount - completedCount}
                        </div>
                        <div className="text-xs text-slate-600">{t("remaining")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="min-w-full bg-white shadow-lg rounded-lg p-6 border border-slate-200">
                <div className="pb-3">
                  <h1 className="text-lg flex items-center gap-2">
                    <TrendingUpIcon
                      className="text-emerald-600"
                      fontSize="medium"
                    />
                    {t("quick_stats")}
                  </h1>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">{t("total_tasks")}</span>
                    <span className="font-semibold">{totalCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">
                      {t("high_priority")}
                    </span>
                    <span className="font-semibold text-red-600">
                      {highPriorityCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">{t("due_today")}</span>
                    <span className="font-semibold text-orange-600">
                      {dueTodayCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white shadow-lg rounded-lg p-6 border border-slate-200">
            <div>
              <div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <h1 className="text-xl font-semibold">{t("my_tasks")}</h1>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64 items-center justify-center">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        placeholder={t("placeholder_search")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border border-slate-300 rounded-lg w-full h-10 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        type="text"
                      />
                    </div>
                    <div className="relative inline-flex items-center">
                      <FilterAltIcon className="absolute left-3 text-slate-500 pointer-events-none" />
                      <select
                        value={filter}
                        onChange={(e) =>
                          setFilter(
                            e.target.value as "all" | "active" | "completed"
                          )
                        }
                        className="appearance-none pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="all">{t("all")}</option>
                        <option value="active">{t("active")}</option>
                        <option value="completed">{t("completed")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex gap-2 mb-6">
                  <input
                    placeholder={t("add_new_task")}
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCreate()}
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    type="text"
                  />
                  <button
                    onClick={handleCreate}
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white px-4 py-2 flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <Add className="mr-2" fontSize="medium" />
                    {t("button_add")}
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="mb-4 flex items-center justify-end gap-4">
                    <p className="font-semibold">{t("sort_by")}:</p>
                    <select
                      className="mt-1 block border border-slate-300 rounded-lg bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={sort}
                      onChange={(e) => {
                        setSort(
                          e.target.value as
                            | "dueDate"
                            | "priority"
                            | "alphabetical"
                        );
                      }}
                    >
                      <option value="dueDate">{t("due_date")}</option>
                      <option value="priority">{t("priority")}</option>
                      <option value="alphabetical">{t("alphabetical")}</option>
                    </select>
                    <button
                      className="border border-slate-300 rounded-lg px-2 py-1 text-black"
                      onClick={() =>
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc"
                        )
                      }
                    >
                      {sortDirection === "asc" ? (
                        <TextRotateUpOutlinedIcon fontSize="small" />
                      ) : (
                        <TextRotateVerticalOutlinedIcon fontSize="small" />
                      )}
                    </button>
                  </div>
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                      <TaskAltIcon
                        className="text-slate-300"
                        fontSize="large"
                      />
                      <div className="mb-4 text-slate-300" />
                      <p>{t("no_tasks")}</p>
                      <p className="text-sm">{t("task_started")}</p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-sm ${
                          task.completed
                            ? "bg-slate-50 border-slate-200"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <button
                          className="mb-1"
                          onClick={() => toggleTask(task.id)}
                        >
                          {task.completed ? (
                            <TaskAltIcon
                              fontSize="medium"
                              className="text-emerald-600"
                            />
                          ) : (
                            <RadioButtonUncheckedIcon
                              fontSize="medium"
                              className="text-slate-400"
                            />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 text-lg">
                            <span
                              className={`${
                                task.completed
                                  ? "line-through text-slate-500"
                                  : "text-slate-800"
                              }`}
                            >
                              {task.title}
                            </span>
                            <span
                              className={`text-sm font-semibold px-2 py-1 rounded-full ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-600"
                                  : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {task.priority === "high"
                                ? t("high")
                                : task.priority === "medium"
                                ? t("medium")
                                : t("low")}
                            </span>
                          </div>

                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <TodayIcon fontSize="small" />
                              {t("due")}:{" "}
                              {
                                new Date(task.dueDate)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            className="h-8 w-8 p-0"
                            onClick={() => handleEdit(task)}
                          >
                            <ModeEditIcon fontSize="small" />
                          </button>
                          <button
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(task.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  <EditTaskModal
                    task={selectedTask!}
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    onUpdated={loadTasks}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between mt-6">
              <span className="text-sm text-slate-600 mr-4">
                {t("showing")} {(page - 1) * 10 + 1}-{Math.min(page * 10, totalCount)}{" "}
                {t("of")} {totalCount} {t("tasks")}
              </span>
              <span className="flex items-center gap-2">
                <button
                  className="border border-slate-300 rounded-lg bg-emerald-600 px-2 py-1 text-white"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  {t("previous")}
                </button>
                <button
                  className="border border-slate-300 rounded-lg bg-emerald-600 px-2 py-1 text-white"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                >
                  {t("next")}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
