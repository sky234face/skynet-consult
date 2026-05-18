const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname))); // Serves your HTML/CSS files

// Route for the Contact Form
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // 1. Setup Email Transport (Using Gmail as an example)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Your company email
            pass: 'your-app-password'     // Your Gmail App Password
        }
    });

    // 2. Email Content
    const mailOptions = {
        from: email,
        to: 'your-email@gmail.com', 
        subject: `New Skynet Consult Inquiry from ${name}`,
        text: `You have a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // 3. Send the Email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send("Something went wrong. Please try again.");
        } else {
            console.log('Email sent: ' + info.response);
            res.send("<h1>Submission Successful! We will contact you shortly.</h1>");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Skynet Consult Server is running on http://localhost:${PORT}`);
});