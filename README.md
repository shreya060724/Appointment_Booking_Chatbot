
# **Real Estate Bot Chatbot 🤖🏡**

This is a **Real Estate Bot** built using **Node.js** that allows users to book appointments and updates booking details in a **Google Sheet 📊**. The bot also provides users with a direct link to **WhatsApp 📱** to contact the admin upon submitting the booking form.

## **Features ✨**
- **Node.js Backend ⚙️**: The chatbot is built using Node.js for handling backend logic and requests.
- **Google Sheets Integration 📋**: When a user books an appointment, the details are automatically updated in a Google Sheet, allowing easy tracking of booking data.
- **WhatsApp Redirection 💬**: After submitting the booking form, users are redirected to WhatsApp to directly contact the admin for further inquiries or assistance.
- **Real-Time Updates 🔄**: The Google Sheet is updated in real-time when a user submits a booking.

## **Technologies Used 🛠️**
- **Node.js**: Backend framework used to handle server-side logic.
- **Google Sheets API 📑**: Integration with Google Sheets to store and retrieve booking data.
- **WhatsApp API 📲**: Allows users to contact the admin via WhatsApp after submitting the booking form.
- **Express.js**: Web framework for Node.js to manage routes and server-side handling.

## **Setup Instructions 🔧**

To run the chatbot locally, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/shreya060724/Appointment_Booking_Chatbot.git
```

### 2. Navigate to the Project Directory
```bash
cd "Real_Estate_Bot_Final"
```

### 3. Install Dependencies 📥
Install the necessary dependencies using npm:
```bash
npm install
```

### 4. Set Up Google Sheets API 📜
- Set up **Google Sheets API** by following the [Google Sheets API documentation](https://developers.google.com/sheets/api/quickstart/node).
- After setting up the Google Sheets API, place your **credentials.json** in the project directory to allow the bot to access your Google Sheets.

### 5. Run the Server 🚀
Run the Node.js server using the following command:
```bash
node server/server.js
```

This will start the server and the chatbot will be available for interactions. It listens for user inputs, processes the booking, and updates the Google Sheets with booking details.

### 6. Access the Chatbot 🌐
Once the server is running, you can interact with the bot through the designated interface (e.g., web interface or integration platform).

![image](https://github.com/user-attachments/assets/aa1b52a2-53a1-41d3-b739-a793a56c3a0a)
![image](https://github.com/user-attachments/assets/cb962a3f-2c16-4c5b-b53f-12bc59f8238e)



### 7. Contact Admin on WhatsApp 📞
After the booking form is submitted, users will be provided with a **WhatsApp link** where they can click to contact the admin directly via WhatsApp.

## **Contributing 🤝**

If you would like to contribute to this project, feel free to fork the repository, create a branch, and submit a pull request with your improvements or fixes.

## **License 📜**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

This version is now enhanced with emojis to make it more visually engaging and easier to follow.
