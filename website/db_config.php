<?php
$host = "localhost"; // Update with your database host
$user = "root"; // Update with your database username
$pass = "@Emm0rych1"; // Update with your database password
$dbname = "world happiness index"; // Update with your database name

// Create a MySQL connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Perform SQL queries here and fetch data

// Example query:
$sql = "SELECT * FROM happyscore";
$result = $conn->query($sql);

$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Return data as JSON
header("Content-Type: application/json");
echo json_encode($data);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($data['action'] === 'add') {
        $country = $data['country'];
        $region = $data['region'];
        $happiness_score = $data['happiness_score'];
        $gdp_per_capita = $data['gdp_per_capita'];
        $social_support = $data['social_support'];
        $healthy_life_expectancy = $data['healthy_life_expectancy'];
        $freedom_to_make_life_choices = $data['freedom_to_make_life_choices'];
        $generosity = $data['generosity'];
        $perceptions_of_corruption = $data['perceptions_of_corruption'];

        // Prepare and execute an SQL INSERT query
        $stmt = $conn->prepare("INSERT INTO happyscore (country, region, happiness_score, gdp_per_capita, social_support, healthy_life_expectancy, freedom_to_make_life_choices, generosity, perceptions_of_corruption) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssddddddd", $country, $region, $happiness_score, $gdp_per_capita, $social_support, $healthy_life_expectancy, $freedom_to_make_life_choices, $generosity, $perceptions_of_corruption);

        if ($stmt->execute()) {
            echo "success"; // Data added successfully
        } else {
            echo "error"; // Error adding data
        }
    } elseif ($data['action'] === 'edit') {
        $countryToEdit = $data['country'];
        // Retrieve other data fields as needed

        // Prepare and execute an SQL UPDATE query
        $stmt = $conn->prepare("UPDATE happyscore SET region=?, happiness_score=?, gdp_per_capita=?, social_support=?, healthy_life_expectancy=?, freedom_to_make_life_choices=?, generosity=?, perceptions_of_corruption=? WHERE country=?");
        $stmt->bind_param("dddddddds", $region, $happiness_score, $gdp_per_capita, $social_support, $healthy_life_expectancy, $freedom_to_make_life_choices, $generosity, $perceptions_of_corruption, $countryToEdit);

        if ($stmt->execute()) {
            echo "success"; // Data updated successfully
        } else {
            echo "error"; // Error updating data
        }
    } elseif ($data['action'] === 'search') {
        $searchQuery = $data['searchQuery'];

        // Prepare and execute an SQL SELECT query for the search
        $stmt = $conn->prepare("SELECT * FROM happyscore WHERE country LIKE ?");
        $searchQuery = "%" . $searchQuery . "%"; // Add wildcard for partial matching
        $stmt->bind_param("s", $searchQuery);
        $stmt->execute();

        $result = $stmt->get_result();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Return search results as JSON
        header("Content-Type: application/json");
        echo json_encode($data);
    }

    // Close the database connection
    $stmt->close();
    $conn->close();
}
?>