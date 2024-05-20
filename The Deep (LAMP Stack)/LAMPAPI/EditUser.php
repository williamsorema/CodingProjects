<?php
$inData = getRequestInfo();
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$Login = $inData["Login"];
$Password = $inData["Password"]; 

// Create database connection
$conn = new mysqli("localhost", "TheApi", "1verygoodPassword", "COP4331");

// Check connection
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Use UPDATE query based on Login
    $stmt = $conn->prepare("UPDATE Users SET FirstName=?, LastName=?, Password=? WHERE Login=?");
    $stmt->bind_param("ssss", $firstName, $lastName, $Password, $Login);

    if ($stmt->execute()) {
        echo json_encode(["message" => "User Record was updated"]);
    } else {
        returnWithError($conn->error);
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>
