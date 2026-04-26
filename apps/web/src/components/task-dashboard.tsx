"use client";

import { startTransition, useDeferredValue, useState } from "react";
import type { Task, TaskFilter, TaskPriority, TaskSortBy } from "@justdoit/shared";
import { taskFilters, taskPriorities } from "@justdoit/shared";
import { taskFormSchema, type TaskFormValues } from "../features/tasks/tasks.schema";
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useToggleTask,
  useUpdateTask,
} from "../features/tasks/use-tasks";

const sortOptions: Array<{ value: TaskSortBy; label: string }> = [
  { value: "createdAt", label: "Newest first" },
  { value: "priority", label: "Priority first" },
];

const priorityTone: Record<TaskPriority, string> = {
  low: "bg-white text-ink/70",
  medium: "bg-sand text-ink/80",
  high: "bg-ember text-white",
};

const filterLabels: Record<TaskFilter, string> = {
  all: "All",
  pending: "Pending",
  completed: "Done",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function StatsCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[28px] border border-black/5 bg-white/80 p-5 shadow-card backdrop-blur">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/45">{label}</p>
      <p className="mt-2 font-display text-4xl">{value}</p>
    </div>
  );
}

function TaskForm({
  onSubmit,
  loading,
  initialValues,
  submitLabel,
  onCancel,
}: {
  onSubmit: (values: TaskFormValues) => Promise<void>;
  loading: boolean;
  initialValues?: TaskFormValues;
  submitLabel: string;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(initialValues?.priority ?? "medium");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = taskFormSchema.safeParse({ title, description, priority });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid fields");
      return;
    }

    setError(null);
    await onSubmit(parsed.data);

    if (!initialValues) {
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink/70" htmlFor="title">
          Task title
        </label>
        <input
          id="title"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-ember"
          placeholder="Ship the first polished MVP"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink/70" htmlFor="description">
          Details
        </label>
        <textarea
          id="description"
          className="min-h-24 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-ember"
          placeholder="Keep it short and useful."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink/70" htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-ember"
          value={priority}
          onChange={(event) => setPriority(event.target.value as TaskPriority)}
        >
          {taskPriorities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="text-sm text-ember">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-moss disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            className="rounded-full border border-black/10 px-4 py-3 text-sm text-ink/70"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

function TaskItem({
  task,
  editing,
  onEdit,
  onCancelEdit,
  onSave,
  onToggle,
  onDelete,
  loading,
}: {
  task: Task;
  editing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (values: TaskFormValues) => Promise<void>;
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
  loading: boolean;
}) {
  if (editing) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-paper p-5">
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description,
            priority: task.priority,
          }}
          loading={loading}
          onCancel={onCancelEdit}
          onSubmit={onSave}
          submitLabel="Update task"
        />
      </div>
    );
  }

  return (
    <article className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-card backdrop-blur animate-rise">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            aria-label={`Mark ${task.title} as ${task.status === "completed" ? "pending" : "completed"}`}
            className={`mt-1 h-6 w-6 rounded-full border transition ${
              task.status === "completed"
                ? "border-moss bg-moss shadow-[inset_0_0_0_5px_white]"
                : "border-black/15 bg-white"
            }`}
            onClick={() => void onToggle()}
            type="button"
          />

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`text-lg font-medium ${task.status === "completed" ? "text-ink/45 line-through" : ""}`}>
                {task.title}
              </h3>
              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${priorityTone[task.priority]}`}>
                {task.priority}
              </span>
            </div>
            <p className="max-w-xl text-sm leading-6 text-ink/65">
              {task.description || "No extra details. Keep moving."}
            </p>
          </div>
        </div>

        <div className="text-right text-xs uppercase tracking-[0.2em] text-ink/35">
          <p>{task.status === "completed" ? "Finished" : "Created"}</p>
          <p className="mt-1">{formatDate(task.status === "completed" && task.completedAt ? task.completedAt : task.createdAt)}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="rounded-full border border-black/10 px-4 py-2 text-sm text-ink/80" onClick={onEdit} type="button">
          Edit
        </button>
        <button className="rounded-full border border-black/10 px-4 py-2 text-sm text-ink/80" onClick={() => void onToggle()} type="button">
          {task.status === "completed" ? "Mark pending" : "Complete"}
        </button>
        <button className="rounded-full border border-ember/20 px-4 py-2 text-sm text-ember" onClick={() => void onDelete()} type="button">
          Delete
        </button>
      </div>
    </article>
  );
}

export function TaskDashboard() {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [sortBy, setSortBy] = useState<TaskSortBy>("createdAt");
  const [editingId, setEditingId] = useState<string | null>(null);
  const deferredFilter = useDeferredValue(filter);

  const query = {
    status: deferredFilter,
    sortBy,
  } satisfies { status: TaskFilter; sortBy: TaskSortBy };

  const { data, isLoading, isError, error, refetch } = useTasks(query);
  const createTask = useCreateTask(query);
  const updateTask = useUpdateTask(query);
  const toggleTask = useToggleTask(query);
  const deleteTask = useDeleteTask(query);

  const visibleItems = data?.items ?? [];
  const stats = {
    total: visibleItems.length,
    pending: visibleItems.filter((item) => item.status === "pending").length,
    completed: visibleItems.filter((item) => item.status === "completed").length,
  };

  async function handleCreate(values: TaskFormValues) {
    await createTask.mutateAsync(values);
  }

  async function handleSave(id: string, values: TaskFormValues) {
    await updateTask.mutateAsync({ id, input: values });
    setEditingId(null);
  }

  async function handleToggle(task: Task) {
    await toggleTask.mutateAsync({
      id: task.id,
      input: { completed: task.status !== "completed" },
    });
  }

  async function handleDelete(id: string) {
    await deleteTask.mutateAsync(id);
    if (editingId === id) {
      setEditingId(null);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-black/5 bg-white/70 p-7 shadow-card backdrop-blur">
          <p className="text-sm uppercase tracking-[0.24em] text-ember">Portfolio-ready task app</p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-tight text-ink sm:text-6xl">
            Light task flow with a clean API-first foundation.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/65">
            Start with a fast web MVP. Keep domain rules isolated now so the same product logic can move toward mobile and desktop later.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatsCard label="Visible" value={stats.total} />
            <StatsCard label="Pending" value={stats.pending} />
            <StatsCard label="Done" value={stats.completed} />
          </div>
        </div>

        <div className="rounded-[32px] border border-black/5 bg-paper p-7 shadow-card">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-moss">Create task</p>
            <h2 className="mt-3 font-display text-3xl">What needs to move today?</h2>
          </div>

          <TaskForm loading={createTask.isPending} onSubmit={handleCreate} submitLabel="Add task" />
          {createTask.error ? <p className="mt-3 text-sm text-ember">{createTask.error.message}</p> : null}
        </div>
      </section>

      <section className="rounded-[32px] border border-black/5 bg-white/75 p-6 shadow-card backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-moss">Task board</p>
            <h2 className="mt-2 font-display text-3xl">Focused, sortable, easy to scan.</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex rounded-full border border-black/10 bg-white p-1">
              {taskFilters.map((item) => (
                <button
                  key={item}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    filter === item ? "bg-ink text-white" : "text-ink/65"
                  }`}
                  onClick={() =>
                    startTransition(() => {
                      setFilter(item);
                    })
                  }
                  type="button"
                >
                  {filterLabels[item]}
                </button>
              ))}
            </div>

            <select
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-ink/70 outline-none"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as TaskSortBy)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="rounded-[28px] border border-dashed border-black/10 bg-white/60 px-6 py-14 text-center text-ink/55">
              Loading tasks...
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-[28px] border border-ember/15 bg-white px-6 py-12 text-center">
              <p className="text-lg font-medium text-ink">Could not load tasks.</p>
              <p className="mt-2 text-sm text-ink/60">{error.message}</p>
              <button className="mt-5 rounded-full bg-ink px-4 py-2 text-sm text-white" onClick={() => void refetch()} type="button">
                Retry
              </button>
            </div>
          ) : null}

          {!isLoading && !isError && (data?.items.length ?? 0) === 0 ? (
            <div className="rounded-[28px] border border-dashed border-black/10 bg-white/60 px-6 py-14 text-center">
              <p className="font-display text-3xl">No tasks here yet.</p>
              <p className="mt-2 text-sm text-ink/60">
                Create the first one, or change the active filter if you are expecting completed items.
              </p>
            </div>
          ) : null}

          {!isLoading && !isError && (data?.items.length ?? 0) > 0 ? (
            <div className="grid gap-4">
              {data?.items.map((task) => (
                <TaskItem
                  key={task.id}
                  editing={editingId === task.id}
                  loading={updateTask.isPending || deleteTask.isPending || toggleTask.isPending}
                  onCancelEdit={() => setEditingId(null)}
                  onDelete={() => handleDelete(task.id)}
                  onEdit={() => setEditingId(task.id)}
                  onSave={(values) => handleSave(task.id, values)}
                  onToggle={() => handleToggle(task)}
                  task={task}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
