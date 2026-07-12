// Seed demo data for the API (tasks 3-5)
// Run: node api/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./db');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const DAY = 24 * 60 * 60 * 1000;

async function main() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
  ]);

  const [alice, bob, carol] = await User.create([
    { name: 'Alice', email: 'alice@example.com', role: 'mentor' },
    { name: 'Bob', email: 'bob@example.com', role: 'student' },
    { name: 'Carol', email: 'carol@example.com', role: 'admin' },
  ]);

  // create() (not insertMany) so the pre('save') slug hook runs
  const [webApp, mobileApp] = await Project.create([
    { name: 'Web App Redesign', owner: alice._id },
    { name: 'Mobile App MVP', owner: carol._id },
  ]);

  const now = Date.now();
  await Task.create([
    { title: 'Design landing page', status: 'done', priority: 'high', dueDate: new Date(now - 10 * DAY), assignee: alice._id, project: webApp._id },
    { title: 'Implement login flow', status: 'in_progress', priority: 'high', dueDate: new Date(now - 2 * DAY), assignee: bob._id, project: webApp._id },
    { title: 'Write API docs', status: 'todo', priority: 'low', dueDate: new Date(now + 7 * DAY), assignee: bob._id, project: webApp._id },
    { title: 'Fix responsive layout', status: 'todo', priority: 'medium', dueDate: new Date(now - 1 * DAY), assignee: carol._id, project: webApp._id },
    { title: 'Set up CI pipeline', status: 'done', priority: 'medium', dueDate: new Date(now - 5 * DAY), assignee: carol._id, project: mobileApp._id },
    { title: 'Build onboarding screens', status: 'in_progress', priority: 'high', dueDate: new Date(now + 3 * DAY), assignee: alice._id, project: mobileApp._id },
    { title: 'Push notification spike', status: 'todo', priority: 'low', dueDate: new Date(now + 14 * DAY), project: mobileApp._id }, // unassigned
    { title: 'App store screenshots', status: 'todo', priority: 'medium', dueDate: new Date(now - 3 * DAY), assignee: bob._id, project: mobileApp._id },
  ]);

  console.log('Seeded:', {
    users: await User.countDocuments(),
    projects: await Project.countDocuments(),
    tasks: await Task.countDocuments(),
  });
  console.log('Sample ids:', {
    projectId: webApp._id.toString(),
    userId: bob._id.toString(),
  });

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
