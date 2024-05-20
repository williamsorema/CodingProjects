<?php
    $inData = getRequestInfo();
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
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
                $stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID = ? AND FirstName = ? AND LastName = ?");
                $stmt->bind_param("sss", $UserID, $firstName, $lastName);
                if($stmt->execute())
                {
                  echo json_encode(["message" => "Contact Record was deleted"]);
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
