authentification explinatin
the "./" route takes you to a page that has a button to login
that page looks for a jwt token in local storage every 100 milisec
if there is no token, do nothing
if there is token, redirect to ./app logged in portion of the app
when user clicks login button they are redirected to auth0 popup to enter credentials
successfull authentifation redirects them back to ./ with a hashtag jwt token
when the jwt token is present in the url at this page the
the user is redirected to ./app
