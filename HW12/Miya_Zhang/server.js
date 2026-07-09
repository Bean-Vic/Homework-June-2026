require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;

if (!uri) {
  console.error("Missing MONGODB_URI. Please create a .env file in the coding folder.");
  process.exit(1);
}

const app = express();
app.use(express.json());

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (value) => emailRegex.test(value),
        message: "Email format is invalid"
      }
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual("fullName").get(function () {
  return this.name;
});

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "Hw12ApiUser", required: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

projectSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

projectSchema.virtual("taskCount", {
  ref: "Hw12Task",
  localField: "_id",
  foreignField: "project",
  count: true
});

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    dueDate: Date,
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "Hw12ApiUser" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Hw12Project" },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

taskSchema.index({ status: 1 });
taskSchema.index({ status: 1, dueDate: -1 });
taskSchema.index({ title: "text" });

const User = mongoose.model("Hw12ApiUser", userSchema, "users");
const Project = mongoose.model("Hw12Project", projectSchema, "projects");
const Task = mongoose.model("Hw12Task", taskSchema, "tasks");

const reportCache = new Map();
const CACHE_TTL_MS = 30 * 1000;

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function dateMatchFromQuery(query) {
  const match = { deletedAt: null };
  if (query.startDate || query.endDate) {
    match.dueDate = {};
    if (query.startDate) match.dueDate.$gte = new Date(query.startDate);
    if (query.endDate) match.dueDate.$lte = new Date(query.endDate);
  }
  return match;
}

async function cachedReport(req, res, key, callback) {
  const cached = reportCache.get(key);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
    return res.json({ cached: true, data: cached.data });
  }

  const data = await callback();
  reportCache.set(key, { createdAt: Date.now(), data });
  return res.json({ cached: false, data });
}

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "HW12 API is running" });
});

app.post(
  "/users",
  asyncHandler(async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
  })
);

app.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  })
);

app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const { status, priority, page = 1, limit = 10, sortBy = "createdAt", q } = req.query;

    const filter = { deletedAt: null };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (q) filter.title = { $regex: q, $options: "i" };

    const safeLimit = Math.min(Number(limit) || 10, 50);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;
    const safeSortBy = ["createdAt", "dueDate"].includes(sortBy) ? sortBy : "createdAt";

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate("assignee", "name email role")
        .populate("project", "name slug")
        .sort({ [safeSortBy]: -1 })
        .skip(skip)
        .limit(safeLimit),
      Task.countDocuments(filter)
    ]);

    res.json({
      page: safePage,
      limit: safeLimit,
      total,
      tasks
    });
  })
);

app.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid task id" });
    }

    const task = await Task.findOne({ _id: req.params.id, deletedAt: null })
      .populate("assignee", "name email role")
      .populate("project", "name slug owner")
      .lean();

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  })
);

app.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  })
);

app.patch(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid task id" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  })
);

app.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid task id" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted with soft delete", task });
  })
);

app.post(
  "/projects",
  asyncHandler(async (req, res) => {
    const project = await Project.create(req.body);
    const populated = await Project.findById(project._id).populate("owner", "name email role");
    res.status(201).json(populated);
  })
);

app.post(
  "/projects/:projectId/tasks",
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const task = await Task.create({ ...req.body, project: project._id });
    const populated = await Task.findById(task._id)
      .populate("assignee", "name email role")
      .populate("project", "name slug");

    res.status(201).json(populated);
  })
);

app.get(
  "/projects/:projectId",
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const project = await Project.findById(req.params.projectId)
      .populate("owner", "name email role")
      .populate("taskCount");

    if (!project) return res.status(404).json({ error: "Project not found" });

    const tasks = await Task.find({ project: project._id, deletedAt: null })
      .populate("assignee", "name email role")
      .sort({ createdAt: -1 });

    res.json({ project, tasks });
  })
);

app.get(
  "/reports/tasks/summary",
  asyncHandler(async (req, res) => {
    const key = `summary:${JSON.stringify(req.query)}`;
    return cachedReport(req, res, key, async () => {
      const [summary] = await Task.aggregate([
        { $match: dateMatchFromQuery(req.query) },
        {
          $group: {
            _id: null,
            totalTasks: { $sum: 1 },
            todo: { $sum: { $cond: [{ $eq: ["$status", "todo"] }, 1, 0] } },
            inProgress: { $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] } },
            done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } }
          }
        },
        {
          $project: {
            _id: 0,
            totalTasks: 1,
            taskCountByStatus: {
              todo: "$todo",
              in_progress: "$inProgress",
              done: "$done"
            }
          }
        }
      ]);

      return summary || { totalTasks: 0, taskCountByStatus: { todo: 0, in_progress: 0, done: 0 } };
    });
  })
);

app.get(
  "/reports/tasks/by-project",
  asyncHandler(async (req, res) => {
    const key = `by-project:${JSON.stringify(req.query)}`;
    return cachedReport(req, res, key, async () => {
      return Task.aggregate([
        { $match: { ...dateMatchFromQuery(req.query), project: { $ne: null } } },
        { $group: { _id: "$project", taskCount: { $sum: 1 } } },
        {
          $lookup: {
            from: "projects",
            localField: "_id",
            foreignField: "_id",
            as: "project"
          }
        },
        { $unwind: "$project" },
        {
          $project: {
            _id: 0,
            projectId: "$_id",
            projectName: "$project.name",
            projectSlug: "$project.slug",
            taskCount: 1
          }
        },
        { $sort: { taskCount: -1, projectName: 1 } }
      ]);
    });
  })
);

app.get(
  "/reports/tasks/by-assignee",
  asyncHandler(async (req, res) => {
    const key = `by-assignee:${JSON.stringify(req.query)}`;
    return cachedReport(req, res, key, async () => {
      return Task.aggregate([
        { $match: { ...dateMatchFromQuery(req.query), assignee: { $ne: null } } },
        { $group: { _id: "$assignee", taskCount: { $sum: 1 } } },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "assignee"
          }
        },
        { $unwind: "$assignee" },
        {
          $project: {
            _id: 0,
            assigneeId: "$_id",
            assigneeName: "$assignee.name",
            assigneeEmail: "$assignee.email",
            taskCount: 1
          }
        },
        { $sort: { taskCount: -1, assigneeName: 1 } }
      ]);
    });
  })
);

app.get(
  "/reports/tasks/overdue",
  asyncHandler(async (req, res) => {
    const key = `overdue:${JSON.stringify(req.query)}`;
    return cachedReport(req, res, key, async () => {
      return Task.aggregate([
        {
          $match: {
            ...dateMatchFromQuery(req.query),
            dueDate: { $lt: new Date() },
            status: { $ne: "done" }
          }
        },
        {
          $project: {
            title: 1,
            status: 1,
            priority: 1,
            dueDate: 1,
            daysOverdue: {
              $dateDiff: { startDate: "$dueDate", endDate: new Date(), unit: "day" }
            }
          }
        },
        { $sort: { dueDate: 1 } },
        { $limit: 50 }
      ]);
    });
  })
);

app.get(
  "/reports/tasks/grouped",
  asyncHandler(async (req, res) => {
    const allowed = ["status", "priority", "project", "assignee"];
    const groupBy = allowed.includes(req.query.groupBy) ? req.query.groupBy : "status";

    const result = await Task.aggregate([
      { $match: dateMatchFromQuery(req.query) },
      { $group: { _id: `$${groupBy}`, taskCount: { $sum: 1 } } },
      { $sort: { taskCount: -1 } },
      { $project: { _id: 0, groupBy, value: "$_id", taskCount: 1 } }
    ]);

    res.json(result);
  })
);

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: "Duplicate key error", details: err.keyValue });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

mongoose
  .connect(uri, { dbName: "hw12_task_api" })
  .then(() => {
    app.listen(port, () => {
      console.log(`HW12 API server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB:");
    console.error(error);
    process.exit(1);
  });
