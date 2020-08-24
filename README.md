# L.A Active Businesses backend
This is a nodejs + express + sequelize backend for reading and parsing ​L.A. active businesses data: https://data.lacity.org/A-Prosperous-City/Listing-of-Active-Businesses/6rrh-rzua

The needs for this application are the following:

# User Story #1
As a user using the application
I want to be able to click a button and have it show the business with the most locations
Because I want to be able to tell which one it is

# User Story #2
As a user using the application
I want to be able to click a button and have it show me the oldest business
Because I want to be able to tell which one it is


Based on that, we need to retrieve the data from the API and parse it in a way that makes it easier for the front-end to quickly have these informations.

It's important to notice 4 things in the API:  
- It has more than 500,000 rows 
- We're not allowed to use the API filters
- Each row is a business location - A business can have more than one location, this means that the same business can appear more than once in the API
- The API has a monthly update interval.

As teh client wants to know the businesses with the most locations, would be impossible to iterate over all the API rows to bring back the results, so we'll have a database to store that parsed data!
For the sake of the exercise, a public endpoint was made to import the data to a MySQL database - /businesses/import/ - of course in a real-word scenario that would be a private cron-job, or some routine that runs once a month to update the data.
As it has more than 500,000 rows this import can take a while, if you just want to test it, feel free to run it for a few minutes and then stop it and at least you'll have some real data to take a look.

This creates two tables in the database - business and locations - and we have the following columns on these table:
# business:
id, name, startDate, totalLocations, createdAt, updatedAt.
# locations:
public id, name, businessId, city, locationDescription, naics, createdAt, updatedAt.

This way the front-end can just access the /businesses endpoint and easilly get the data ordered by the business with most locations, older businesses or by name.
By default it's ordered by name, but you just need to pass the orderBy query param to get the desired results:
`?orderBy=startDate`
`?orderBy=totalLocations`
`?orderBy=name`

This will return 50 rows each time, and the offset query param is needed to iterate through all the results:
`?offset=51`

So an example API call to get the businesses ordered by most locations will be:
`http://localhost:3001/businesses/?orderBy=totalLocations`
and to get more results:
`http://localhost:3001/businesses/?orderBy=totalLocations&offset=51`

You can request the business locations detailed data using the `/business/:id/locations/` endpoint, this will return all the locations for a business - pagination will be implemented in the future if needed.

You can see the front-end for this application [here](https://github.com/victorcarvalhosp/la-active-businesses-frontend)

#To-do:
[ ] Increase test coverage

