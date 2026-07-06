const express = require("express");
const userRoutes = require("./routes/users");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});