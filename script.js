// =========================
// Personal Quiz Database
// Part 1
// =========================

let pastedImage = "";

// Load database
let quizDatabase = JSON.parse(localStorage.getItem("quizDatabase")) || [];

// HTML Elements
const pasteArea = document.getElementById("pasteArea");
const preview = document.getElementById("preview");
const answerInput = document.getElementById("answer");
const numberInput = document.getElementById("questionNumber");
const categorySelect = document.getElementById("categorySelect");
const saveButton = document.getElementById("saveButton");

// =========================
// Paste Image (CTRL + V)
// =========================

document.addEventListener("paste", function (event) {

    const items = event.clipboardData.items;

    for (let item of items) {

        if (item.type.indexOf("image") !== -1) {

            const file = item.getAsFile();

            const reader = new FileReader();

            reader.onload = function (e) {

                pastedImage = e.target.result;

                preview.src = pastedImage;

                preview.style.display = "block";

            };

            reader.readAsDataURL(file);

        }

    }

});

// =========================
// ENTER = SAVE
// =========================

document.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        saveQuestion();

    }

});

// =========================
// Save Button
// =========================

saveButton.addEventListener("click", saveQuestion);

// =========================
// Save Question
// =========================

function saveQuestion() {

    if (pastedImage === "") {

        alert("Please paste an image first.");

        return;

    }

    if (answerInput.value.trim() === "") {

        alert("Please type the correct answer.");

        return;

    }

    const question = {

        id: Date.now(),

        image: pastedImage,

        answer: answerInput.value.trim(),

        number: numberInput.value.trim(),

        category: categorySelect.value,

        created: new Date().toLocaleString()

    };

    quizDatabase.push(question);

    localStorage.setItem(

        "quizDatabase",

        JSON.stringify(quizDatabase)

    );

    alert("Question Saved!");

    clearForm();

    console.log(quizDatabase);

}

// =========================
// Clear Form
// =========================

function clearForm() {

    pastedImage = "";

    preview.src = "";

    preview.style.display = "none";

    answerInput.value = "";

    numberInput.value = "";

}

// =========================
// Load Database
// =========================

function loadDatabase() {

    quizDatabase = JSON.parse(

        localStorage.getItem("quizDatabase")

    ) || [];

    console.log(

        "Questions:",

        quizDatabase.length

    );

}

loadDatabase();

// =========================
// Show All Questions
// (Console Version)
// =========================

function showDatabase() {

    console.clear();

    console.log("========== DATABASE ==========");

    quizDatabase.forEach(function (q) {

        console.log(

            "ID:", q.id,

            "| Number:", q.number,

            "| Answer:", q.answer,

            "| Category:", q.category

        );

    });

}

// =========================
// Delete Question
// =========================

function deleteQuestion(id) {

    quizDatabase = quizDatabase.filter(function (q) {

        return q.id !== id;

    });

    localStorage.setItem(

        "quizDatabase",

        JSON.stringify(quizDatabase)

    );

}

// =========================
// Find Question
// =========================

function findQuestion(id) {

    return quizDatabase.find(function (q) {

        return q.id === id;

    });

}

// =========================
// Export Database
// =========================

function exportDatabase() {

    const data = JSON.stringify(

        quizDatabase,

        null,

        2

    );

    const blob = new Blob(

        [data],

        {

            type: "application/json"

        }

    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "quizDatabase.json";

    a.click();

}

// =========================
// Clear Database
// =========================

function clearDatabase() {

    if (!confirm("Delete ALL questions?"))

        return;

    quizDatabase = [];

    localStorage.removeItem("quizDatabase");

    alert("Database Cleared");

}

// =========================
// Statistics
// =========================

function databaseStats() {

    console.log(

        "Total Questions:",

        quizDatabase.length

    );

}
