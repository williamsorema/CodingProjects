const app_name = "syntax-sensei-a349ca4c0ed0";

exports.buildPath = function (route) {
  if (process.env.NODE_ENV === "production")
  {
    return `https://${app_name}.herokuapp.com/${route}`;
  }
  else
  {
    const PORT = (process.env.PORT || 5000);
    const HOST = (process.env.HOST || 'localhost');

    return `http://${HOST}:${PORT}/${route}`;
  }
}

exports.buildPathFrontend = function (route) {
  if (process.env.NODE_ENV === "production")
  {
    return `https://${app_name}.herokuapp.com/${route}`;
  }
  else
  {
    return `http://localhost:3000/${route}`;
  }
}