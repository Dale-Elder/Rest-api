// Importing Joi for input validation and express for creating the server
import Joi from "joi";
import express from "express";
const app = express();

// Middleware to parse incoming request JSON data
app.use(express.json());

// Setting the port number
const port = process.env.PORT || 3000;

// Sample list of courses
const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
  { id: 4, name: "course4" },
  { id: 5, name: "course5" },
];

// Route to display "Hello World from Express!" on the homepage
app.get("/", (req, res) => {
  res.send("Hello World from Express!");
});

// Route to display a list of courses
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// Route to add a new course to the list
app.post("/api/courses", (req, res) => {
  // Validating the input data
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Creating a new course object and adding it to the list
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);

  // Sending the newly added course as response
  res.send(course);
});

// Route to update an existing course
app.put("/api/courses/:id", (req, res) => {
  // Looking up the course to update
  // If not existing, returning 404 - Not found
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  // Validating the input data
  // If invalid, returning 400 - Bad request
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Updating the course and sending the updated course as response
  course.name = req.body.name;
  res.send(course);
});

// Function to validate course input data
function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

// Route to delete an existing course
app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  // Deleting the course and sending the deleted course as response
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

// Route to display a single course
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  // Sending the course as response
  res.send(course);
});

// Starting the server and listening on the given port
app.listen(port, () => console.log(`Listening on port ${port}!`));
