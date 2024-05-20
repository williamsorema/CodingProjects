<?php
    $inData = getRequestInfo();
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $Phone = $inData["Phone"];
    $Email = $inData["Email"];
    $UserID = $inData["UserID"];

    // Create database connection
    $conn = new mysqli("localhost", "TheApi", "1verygoodPassword", "COP4331");

    // Check connection
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $firstName, $lastName, $Phone, $Email, $UserID);

        if ($stmt->execute()) {
            // Get the ID of the last inserted row
            $last_id = $conn->insert_id;
            // Return the ID as JSON response
            sendResultInfoAsJson(json_encode(["message" => "New Contact Record was created", "id" => $last_id]));
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
