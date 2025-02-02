import express from "express";

const app = express();
const PORT = 3000;

// Route that checks a query parameter and returns true or false
app.get("/check", (req, res) => {
	const { value } = req.query;

	// Example logic: Return true if value is "yes", otherwise false
	const result = value === "yes";

	res.json({ result });
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
