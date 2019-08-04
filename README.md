# Bar Crawl Planner

## Usage

Before the website can be used, modules must be installed by running `npm install` on the command line. The server can be started by then running `npm start`. The website will then be available at [localhost:3000](http://localhost:3000).

This website is meant to help people plan their bar crawl by seeking out the optimal route, given a start, end, and waypoints inbetween. The user must navigate through a 3-page form, each with instructions telling the user what to do. On the first page, the user must select 2 or more bars via a checkbox. On the second page, they can then select the start and end points of the bar crawl (it is possible to have the same start and end bar if the user wishes to go on a loop). The final page shows the user the route they should take via an embedded Google Map, as well as the list of bars in the order they should visit them on the side. At any point, the user can navigate back to a previous page and change their selections.

## Client-Side

The following will briefly explain how the functions in `index.js` works.

### `showTab(n)`
This function displays a page in the multi-step form and also fixes the Previous/Next buttons, depending on which page the user is on.

### `nextPrev(n)`
This function determines which page the user is shown. It runs when the user clicks one of the Previous/Next buttons. The parameter `n` can take the values of -1 and 1 for Previous and Next respectively. This then determines whether the user is advancing in the form or returning to a previous page.

### `validateForm()`
This function makes sure the form inputs are valid i.e. 2 or more bars have been selected on the first page. It also prepares the selected bars for the next page, where the user must choose the start and end.

### `fixStepIndicator(n)`
This function changes the active class of the step i.e. the green circles that show the user which page they are currently on.

The above functions were adapted from [w3schools](https://www.w3schools.com/howto/howto_js_form_steps.asp).

### `getCheckedBoxes(y)`
This function gets the selected checkboxes on the first page and puts the indexes in an array to be used later when determining the start, end, and waypoints.

### `getRoute(chosenBars,start,end)`
This function finds the optimal route, given the start, end, and waypoints inbetween. It sends a GET request to the server to retrieve a JSON file containing information about the route. The waypoint order is extracted from this, as this is what determines the optimal route. Once this hsa been established, an API call is made to Google Maps Embedded to display the route on a map to the user. The bar locations are described by a pair of latitude and longitude coordinates to ensure accuracy, since if the college names are used instead, this requires a reliance on Google to find the correct place, which does not always happen (e.g. John Snow College will point to the Stockton site, rather than the new college in Durham). As a result, the map can be a bit confusing to read and so there is a list next to it showing the bar crawl order.

## Server-Side

### `GET Optimize Route`
Returns a JSON file with information about the route. It is obtained by the following request:

`localhost:3000/optimizeRoute/START/END/WAYPOINTS`

where:

`START` is the name of the starting bar (selected from the dropdown on the second page).

`END` is the name of the end bar (selected from the dropdown on the second page).

`WAYPOINTS` is an array contained the selected bars, excluding the start and end.

These 3 parameters are passed to the function `getRoute(req,callback)` that makes an API call to Google Maps. The result is a JSON file that contains information about the route. The most important part of this JSON file is the `waypoint_order` as that determines the optimal route.