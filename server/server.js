const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");

const app = express();
const PORT = 5500;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
    keyFile: "./credentials/credentials.json", // Path to your credentials file
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// Replace with your Google Sheet ID
const SPREADSHEET_ID = "1fozmqGPk-DbDlJipZWbLSpYXaXABUSaRb3_z8GZoYEE";

// Default time slots
const defaultSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00" ];

// Track booked slots
let bookedSlots = {};

// Load booked slots from Google Sheets
async function loadBookedSlots() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Sheet1!D:E", // Assuming booking data is in columns D and E (Date, Time)
        });

        const rows = response.data.values || [];
        rows.forEach(([date, time]) => {
            if (!bookedSlots[date]) {
                bookedSlots[date] = [];
            }
            bookedSlots[date].push(time);
        });
    } catch (error) {
        console.error("Error loading booked slots from Google Sheets:", error);
    }
}

// Initialize booked slots on server start
loadBookedSlots();

// Endpoint to fetch slots
app.get("/slots/:date", (req, res) => {
    const { date } = req.params;
    const bookedForDate = bookedSlots[date] || [];
    const availableSlots = defaultSlots.filter((slot) => !bookedForDate.includes(slot));
    res.json(availableSlots);
});

// Endpoint to book a slot
app.post("/book", async (req, res) => {
    const { name, email, phone, date, time } = req.body;

    if (!defaultSlots.includes(time)) {
        return res.status(400).json({ message: "Invalid slot" });
    }

    if (!bookedSlots[date]) {
        bookedSlots[date] = [];
    }

    if (bookedSlots[date].includes(time)) {
        return res.status(400).json({ message: "Slot not available" });
    }

    bookedSlots[date].push(time);

    const bookingData = [[name, email, phone, date, time]];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Sheet1!A:E",
            valueInputOption: "RAW",
            resource: { values: bookingData },
        });

        res.json({ message: "Booking successful", booking: { name, email, phone, date, time } });
    } catch (error) {
        console.error("Error appending data to Google Sheet:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
