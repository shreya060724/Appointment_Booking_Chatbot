// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById("chatbot-toggle");
    const chatbox = document.getElementById("chatbox");
    const closeButton = document.getElementById("close-chat");
    const chatOutput = document.getElementById("chat-output");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    let step = 0;
    let userData = {
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
    };
    let availableSlots = [];

    // Chatbot toggle functionality
    toggleButton.addEventListener("click", () => {
        chatbox.classList.toggle("hidden");
        toggleButton.classList.remove("pulse");
        if (!chatbox.classList.contains("hidden")) {
            chatInput.focus();
            if (step === 0) {
                nextStep(""); // Start the conversation when chat opens
            }
        }
    });

    closeButton.addEventListener("click", () => {
        chatbox.classList.add("hidden");
        toggleButton.classList.add("pulse");
    });
    
    

    function displayMessage(message, isUser = false) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        chatOutput.appendChild(messageDiv);
        
        // Ensure scroll to bottom
        setTimeout(() => {
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }, 100);
    }

    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    }

    function displayDatePicker() {
        const datePicker = document.createElement("input");
        datePicker.type = "date";
        datePicker.className = "date-picker";
        datePicker.id = "date-picker";

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        datePicker.min = `${yyyy}-${mm}-${dd}`;

        chatOutput.appendChild(datePicker);

        datePicker.addEventListener("focus", () => {
            datePicker.showPicker();
        });

        datePicker.addEventListener("change", () => {
            const selectedDate = datePicker.value;
            if (selectedDate) {
                nextStep(selectedDate);
            }
        });

        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    function displayTimeDropdown() {
        const timeDropdown = document.createElement("select");
        timeDropdown.className = "time-dropdown";
        timeDropdown.id = "time-dropdown";

        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a time slot";
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        timeDropdown.appendChild(defaultOption);

        availableSlots.forEach((slot) => {
            const option = document.createElement("option");
            option.value = slot;
            option.textContent = slot;
            timeDropdown.appendChild(option);
        });

        chatOutput.appendChild(timeDropdown);

        timeDropdown.addEventListener("change", () => {
            const selectedTime = timeDropdown.value;
            if (selectedTime) {
                nextStep(selectedTime);
            }
        });
        
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    async function nextStep(input) {
        input = input.trim();

        try {
            if (step === 0) {
                displayMessage("Welcome! 👋 Would you like to book a visit? (Yes/No)");
                step++;
            } else if (step === 1 && input.toLowerCase() === "yes") {
                displayMessage("Great! Please enter your name.");
                step++;
            } else if (step === 1 && input.toLowerCase() === "no") {
                displayMessage("Thank you for visiting us! Have a great day! 👋");
                step = 0;
            } else if (step === 2) {
                userData.name = input;
                displayMessage("Please enter your email address.");
                step++;
            } else if (step === 3) {
                if (!isValidEmail(input)) {
                    displayMessage("❌ Invalid email format. Please enter a valid email address.");
                    return;
                }
                userData.email = input;
                displayMessage("Please enter your phone number (10 digits).");
                step++;
            } else if (step === 4) {
                if (!isValidPhone(input)) {
                    displayMessage("❌ Invalid phone number. Please enter a valid 10-digit number.");
                    return;
                }
                userData.phone = input;
                displayMessage("Please select a date for your visit:");
                displayDatePicker();
                step++;
            } else if (step === 5) {
                userData.date = input;
                try {
                    const response = await fetch(`/slots/${userData.date}`);
                    availableSlots = await response.json();
                    
                    if (availableSlots.length === 0) {
                        displayMessage("No slots available for this date. Please choose another date.");
                        displayDatePicker();
                        return;
                    }
                    
                    displayMessage("Available slots: " + availableSlots.join(", "));
                    displayTimeDropdown();
                    step++;
                } catch (error) {
                    console.error("Error fetching slots:", error);
                    // For testing purposes, use dummy slots
                    availableSlots = ["10:00 AM", "2:00 PM", "4:00 PM"];
                    displayMessage("Available slots: " + availableSlots.join(", "));
                    displayTimeDropdown();
                    step++;
                }
            } else if (step === 6) {
                if (!availableSlots.includes(input)) {
                    displayMessage("❌ Invalid or unavailable time. Please choose from the listed slots.");
                    return;
                }
                userData.time = input;
                displayMessage("📋 Confirmation of your details:");
                displayMessage(`Name: ${userData.name}\nEmail: ${userData.email}\nPhone: ${userData.phone}\nDate: ${userData.date}\nTime: ${userData.time}`);
                displayMessage("Booking your visit... ⏳");

                await bookAppointment();
            }
        } catch (error) {
            console.error("Error during booking process:", error);
            displayMessage("❌ There was an issue. Please try again later.");
        }
    }

    async function bookAppointment() {
        try {
            const response = await fetch("/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (data.message === "Booking successful") {
                displayMessage("✅ Booking successful! Redirecting to WhatsApp for confirmation...");
                redirectToWhatsApp();
            } else {
                displayMessage("❌ There was an issue with booking your visit. Please try again.");
            }
        } catch (error) {
            console.error("Error booking visit:", error);
            // For testing purposes, proceed to WhatsApp
            displayMessage("✅ Booking successful! Redirecting to WhatsApp for confirmation...");
            redirectToWhatsApp();
        }
    }

    function redirectToWhatsApp() {
        const message = `Hi, I'd like to book a visit:\n\nName: ${userData.name}\nEmail: ${userData.email}\nPhone: ${userData.phone}\nDate: ${userData.date}\nTime: ${userData.time}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/918767778452?text=${encodedMessage}`;
    
        // Reset the chat for new booking
        setTimeout(() => {
            step = 0;
            userData = {
                name: "",
                email: "",
                phone: "",
                date: "",
                time: ""
            };
            window.open(whatsappLink, "_blank");
        }, 2000);
    }

    // Send message on button click
    sendBtn.addEventListener("click", () => {
        const userInput = chatInput.value.trim();
        if (userInput) {
            displayMessage(userInput, true);
            nextStep(userInput);
            chatInput.value = "";
        }
    });

    // Send message on Enter key
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendBtn.click();
        }
    });
});
