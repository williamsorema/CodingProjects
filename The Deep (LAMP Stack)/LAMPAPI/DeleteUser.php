<?php
    $inData = getRequestInfo();
    $Login = $inData["Login"];


    // Create database connection
    $conn = new mysqli("localhost", "TheApi", "1verygoodPassword", "COP4331");

    // Check connection
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("DELETE Users,Contacts FROM Users INNER JOIN Contacts ON Users.ID = Contacts.UserID WHERE Login = ?");
        $stmt->bind_param("s", $Login);

        if($stmt->execute())
        {
            echo json_encode(["message" => "User was deleted"]);
        }
        else
        {
            returnWithError($conn->error);
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>
