// Function to hide all data sections
function hideAllDataSections() {
    document.getElementById("data-entry").style.display = "none";
    document.getElementById("data-search").style.display = "none";
    document.getElementById("data-edit").style.display = "none";
}

// Function to show a specific data section
function showDataSection(sectionId) {
    hideAllDataSections();
    document.getElementById(sectionId).style.display = "block";
}

// Show the Enter Data section by default
showDataSection("data-entry");

// Button click event listeners
document.getElementById("enter-button").addEventListener("click", function () {
    showDataSection("data-entry");
});

document.getElementById("search-button").addEventListener("click", function () {
    showDataSection("data-search");
});

document.getElementById("edit-button").addEventListener("click", function () {
    showDataSection("data-edit");
});

// Event listener for the "Edit Data" button within the edit section
document.getElementById("edit-data-button").addEventListener("click", function () {
    // Get the country name to edit
    const countryToEdit = document.getElementById("edit-country-input").value;

    // Fetch data for the selected country from your database
    fetch("db_config.php", { // Update the filename here
        method: "POST",
        body: JSON.stringify({
            action: "edit",
            country: countryToEdit
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(dataForCountry => {
        if (dataForCountry) {
            // Populate the edit form fields with the retrieved data
            document.getElementById("country-input").value = dataForCountry.country;
            document.getElementById("region-input").value = dataForCountry.region;
            document.getElementById("HappinessScore-input").value = dataForCountry.happiness_score;
            document.getElementById("GDP-input").value = dataForCountry.gdp_per_capita;
            document.getElementById("SocialSupport-input").value = dataForCountry.social_support;
            document.getElementById("LifeExpectancy-input").value = dataForCountry.healthy_life_expectancy;
            document.getElementById("Freedom-input").value = dataForCountry.freedom_to_make_life_choices;
            document.getElementById("Generosity-input").value = dataForCountry.generosity;
            document.getElementById("Corruption-input").value = dataForCountry.perceptions_of_corruption;
        } else {
            alert("Country not found. Please enter a valid country name.");
        }
    })
    .catch(error => console.error("Error fetching data for editing:", error));
});

// Event listener for the "Add Entry" button
document.getElementById("add-button").addEventListener("click", function () {
    // Retrieve data from input fields
    const country = document.getElementById("country-input").value;
    const region = document.getElementById("region-input").value;
    const happiness_score = parseFloat(document.getElementById("HappinessScore-input").value);
    const gdp_per_capita = parseFloat(document.getElementById("GDP-input").value);
    const social_support = parseFloat(document.getElementById("SocialSupport-input").value);
    const healthy_life_expectancy = parseFloat(document.getElementById("LifeExpectancy-input").value);
    const freedom_to_make_life_choices = parseFloat(document.getElementById("Freedom-input").value);
    const generosity = parseFloat(document.getElementById("Generosity-input").value);
    const perceptions_of_corruption = parseFloat(document.getElementById("Corruption-input").value);

    // Send data to the PHP file for insertion or update
    fetch("db_config.php", { // Update the filename here
        method: "POST",
        body: JSON.stringify({
            action: "add",
            country: country,
            region: region,
            happiness_score: happiness_score,
            gdp_per_capita: gdp_per_capita,
            social_support: social_support,
            healthy_life_expectancy: healthy_life_expectancy,
            freedom_to_make_life_choices: freedom_to_make_life_choices,
            generosity: generosity,
            perceptions_of_corruption: perceptions_of_corruption
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.text())
    .then(result => {
        if (result === "success") {
            alert("Data added successfully.");
            // Clear input fields or perform any other necessary actions
        } else {
            alert("Error adding data.");
        }
    })
    .catch(error => console.error("Error adding data:", error));
});

// Event listener for the "Search Data" button
document.getElementById("search-data-button").addEventListener("click", function () {
    // Retrieve search query from the input field
    const searchQuery = document.getElementById("search-input").value;

    // Send search query to the PHP file for retrieval
    fetch("db_config.php", { // Update the filename here
        method: "POST",
        body: JSON.stringify({
            action: "search",
            searchQuery: searchQuery
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        // Display search results here (update the HTML accordingly)
        if (data) {
            // Update the HTML to display search results
        } else {
            alert("No results found for the given search query.");
        }
    })
    .catch(error => console.error("Error searching data:", error));
});
