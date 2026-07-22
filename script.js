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
// =======================================
// PART 2
// Category Management + Gallery
// =======================================

// ---------- Category Database ----------

let categories =
JSON.parse(localStorage.getItem("quizCategories")) || [

    "Math Sequence Puzzle",

    "Spatial Intelligence",

    "Logic"

];

const newCategoryInput =
document.getElementById("newCategory");

const categoryList =
document.getElementById("categoryList");

// ---------- Load Categories ----------

function loadCategories(){

    categorySelect.innerHTML = "";

    categoryList.innerHTML = "";

    categories.forEach(function(cat){

        // Dropdown

        let option =
        document.createElement("option");

        option.textContent = cat;

        option.value = cat;

        categorySelect.appendChild(option);

        // Category List

        let li =
        document.createElement("li");

        li.textContent = cat + " ";

        let btn =
        document.createElement("button");

        btn.textContent = "Delete";

        btn.onclick = function(){

            deleteCategory(cat);

        };

        li.appendChild(btn);

        categoryList.appendChild(li);

    });

}

loadCategories();


// ---------- Add Category ----------

function addCategory(){

    const name =
    newCategoryInput.value.trim();

    if(name==""){

        alert("Category name required.");

        return;

    }

    if(categories.includes(name)){

        alert("Category already exists.");

        return;

    }

    categories.push(name);

    localStorage.setItem(

        "quizCategories",

        JSON.stringify(categories)

    );

    newCategoryInput.value="";

    loadCategories();

}

const addButton =
document.querySelector("#category button");

if(addButton){

    addButton.addEventListener(

        "click",

        addCategory

    );

}

// ---------- Delete Category ----------

function deleteCategory(name){

    if(!confirm("Delete category?"))

        return;

    categories =
    categories.filter(function(c){

        return c != name;

    });

    localStorage.setItem(

        "quizCategories",

        JSON.stringify(categories)

    );

    loadCategories();

}


// =======================================
// Gallery
// =======================================

const gallery =
document.getElementById("gallery");

function renderGallery(){

    if(!gallery) return;

    gallery.innerHTML="";

    if(quizDatabase.length==0){

        gallery.innerHTML="<h3>No Questions Yet</h3>";

        return;

    }

    quizDatabase.forEach(function(q){

        let card =
        document.createElement("div");

        card.className="card";

        let img =
        document.createElement("img");

        img.src=q.image;

        img.width=200;

        img.style.cursor="pointer";

        img.onclick=function(){

            alert(

                "Answer: "

                +q.answer+

                "\nCategory: "

                +q.category+

                "\nQuestion #: "

                +q.number

            );

        };

        let del =
        document.createElement("button");

        del.textContent="Delete";

        del.onclick=function(){

            if(confirm("Delete question?")){

                deleteQuestion(q.id);

                renderGallery();

            }

        };

        card.appendChild(img);

        card.appendChild(document.createElement("br"));

        card.appendChild(del);

        gallery.appendChild(card);

    });

}

renderGallery();


// =======================================
// Update Gallery after Saving
// =======================================

const oldSaveQuestion = saveQuestion;

saveQuestion = function(){

    oldSaveQuestion();

    renderGallery();

}


// =======================================
// Search by Category
// =======================================

function showCategory(category){

    if(!gallery) return;

    gallery.innerHTML="";

    quizDatabase

    .filter(function(q){

        return q.category==category;

    })

    .forEach(function(q){

        let img =
        document.createElement("img");

        img.src=q.image;

        img.width=200;

        img.style.margin="10px";

        gallery.appendChild(img);

    });

}


// =======================================
// Random Question
// =======================================

function randomQuestion(){

    if(quizDatabase.length==0){

        alert("Database Empty");

        return;

    }

    const random =

    quizDatabase[

        Math.floor(

            Math.random()

            *quizDatabase.length

        )

    ];

    alert(

        "Question #"

        +random.number+

        "\nCategory: "

        +random.category+

        "\nAnswer: "

        +random.answer

    );

}

// ======================================
// PART 3
// Practice System
// ======================================

let practiceList = [];

let currentQuestion = 0;

let correctScore = 0;

let totalScore = 0;

// Elements

const practiceImage =
document.getElementById("practiceImage");

const userAnswer =
document.getElementById("userAnswer");

const checkBtn =
document.getElementById("checkAnswerBtn");

const resultText =
document.getElementById("resultText");

const scoreText =
document.getElementById("scoreText");

const nextBtn =
document.getElementById("nextBtn");

const prevBtn =
document.getElementById("prevBtn");

const randomBtn =
document.getElementById("randomBtn");


// ======================================
// Start Practice
// ======================================

function startPractice(){

    if(quizDatabase.length==0){

        alert("No Questions");

        return;

    }

    practiceList = [...quizDatabase];

    currentQuestion = 0;

    loadPracticeQuestion();

}


// ======================================
// Practice By Category
// ======================================

function startCategoryPractice(cat){

    practiceList =

    quizDatabase.filter(function(q){

        return q.category == cat;

    });

    if(practiceList.length==0){

        alert("No Questions");

        return;

    }

    currentQuestion = 0;

    loadPracticeQuestion();

}


// ======================================
// Load Question
// ======================================

function loadPracticeQuestion(){

    if(practiceList.length==0)

        return;

    const q =

    practiceList[currentQuestion];

    practiceImage.src = q.image;

    userAnswer.value = "";

    resultText.innerHTML = "";

}


// ======================================
// Check Answer
// ======================================

function checkAnswer(){

    const q =

    practiceList[currentQuestion];

    totalScore++;

    if(

        userAnswer.value

        .trim()

        .toLowerCase()

        ==

        q.answer

        .toLowerCase()

    ){

        correctScore++;

        resultText.innerHTML =

        "✅ Correct";

    }

    else{

        resultText.innerHTML =

        "❌ Wrong<br>Correct: "

        + q.answer;

    }

    scoreText.innerHTML =

    "Score: "

    + correctScore +

    " / "

    + totalScore;

}


// ======================================
// Next
// ======================================

function nextQuestion(){

    if(

        currentQuestion

        <

        practiceList.length - 1

    ){

        currentQuestion++;

        loadPracticeQuestion();

    }

}


// ======================================
// Previous
// ======================================

function previousQuestion(){

    if(currentQuestion > 0){

        currentQuestion--;

        loadPracticeQuestion();

    }

}


// ======================================
// Random
// ======================================

function randomPractice(){

    if(practiceList.length==0)

        return;

    currentQuestion =

    Math.floor(

        Math.random()

        * practiceList.length

    );

    loadPracticeQuestion();

}


// ======================================
// Event Listeners
// ======================================

if(checkBtn){

    checkBtn.addEventListener(

        "click",

        checkAnswer

    );

}

if(nextBtn){

    nextBtn.addEventListener(

        "click",

        nextQuestion

    );

}

if(prevBtn){

    prevBtn.addEventListener(

        "click",

        previousQuestion

    );

}

if(randomBtn){

    randomBtn.addEventListener(

        "click",

        randomPractice

    );

}


// ======================================
// ENTER = CHECK
// ======================================

userAnswer.addEventListener(

    "keydown",

    function(e){

        if(e.key=="Enter"){

            checkAnswer();

        }

    }

);


// ======================================
// Shuffle
// ======================================

function shufflePractice(){

    for(

        let i =

        practiceList.length - 1;

        i > 0;

        i--

    ){

        const j =

        Math.floor(

            Math.random()

            * (i + 1)

        );

        [

            practiceList[i],

            practiceList[j]

        ]

        =

        [

            practiceList[j],

            practiceList[i]

        ];

    }

}
