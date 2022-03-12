//bringing in required dependancies
const express = require("express");
const path = require("path");
const db = require("express").Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const util = require("util");

// setting port structure
const PORT = process.env.PORT || 3001;

// declaring express app
const app = express();

// Middleware for parsing JSON and url encoded form data
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET Route for homepage
app.get("/", (req, res) =>
	res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET Route for notes page
app.get("/notes", (req, res) =>
	res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// *setting the ends points for CRUD method*

// POST request to add a review
app.post("/api/notes", (req, res) => {
	// Log that a POST request was received
	console.info(`${req.method} request received to add a note`);

	// Destructuring assignment for the items in req.body
	const { title, text } = req.body;

	// If all the required properties are present
	if (title && text) {
		// Variable for the object we will save
		const newReview = {
			title,
			text,
			review_id: uuid(),
		};

		// Obtain existing notes
		fs.readFile("./db/db.json", "utf8", (err, data) => {
			if (err) {
				console.error(err);
			} else {
				// Convert string into JSON object
				const parsedNotes = JSON.parse(data);

				// Add a new note
				parsedNotes.push(newNote);

				// Write updated reviews back to the file
				fs.writeFile(
					"./db/db.json",
					JSON.stringify(parsedNotes, null, 4),
					(writeErr) =>
						writeErr
							? console.error(writeErr)
							: console.info("Successfully updated notes!")
				);
			}
		});

		const response = {
			status: "success",
			body: newReview,
		};

		console.log(response);
		res.status(201).json(response);
	} else {
		res.status(500).json("Error in posting review");
	}
});

// logs port for local testing and use
app.listen(PORT, () =>
	console.log(`App listening at http://localhost:${PORT} 🚀`)
);
