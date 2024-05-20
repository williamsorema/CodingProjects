<?php
    $inData = getRequestInfo();
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $Login = $inData["Login"];
    $Password = $inData["Password"];

        // Create database connection
        $conn = new mysqli("localhost", "TheApi", "1verygoodPassword", "COP4331");

        // Check connection
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }
        else
        {
                $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?, ?, ?, ?)");
                $stmt->bind_param("ssss", $firstName, $lastName, $Login, $Password);
                if($stmt->execute())
        {
            echo json_encode(["message" => "New Record was created"]);
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
