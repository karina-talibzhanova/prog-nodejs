var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab
var barList = ["Collingwood", "Grey", "Hatfield", "Josephine Butler", "St Aidan's", "St Chad's", "St Cuthbert's Society", "St Hild & St Bede",
              "St John's", "St Mary's", "Trevelyan", "University", "Ustinov", "Van Mildert", "Stephenson", "John Snow"];

var collegeCoords = {
  "Collingwood": [54.7629, -1.5765],
  "Grey": [54.7648, -1.5756],
  "Hatfield": [54.774305, -1.574551],
  "Josephine Butler": [54.7598, -1.5798],
  "St Aidan's": [54.7650, -1.5832],
  "St Chad's": [54.772925, -1.574695],
  "St Cuthbert's Society": [54.7708, -1.5774],
  "St Hild & St Bede": [54.7775, -1.564815],
  "St John's": [54.7719, -1.5757],
  "St Mary's": [54.7663, -1.5778],
  "Trevelyan": [54.7644, -1.5799],
  "University": [54.7752, -1.5764],
  "Ustinov": [54.769288, -1.591382],
  "Van Mildert": [54.7632, -1.5811],
  "Stephenson": [54.7596, -1.5813],
  "John Snow": [54.759667, -1.580917],
}

var checkedBars;

function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").style.display = "none";
  } else {
    document.getElementById("nextBtn").style.display = "inline";
  }
  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");

  // checks if fewer than 2 options have been selected on the first page of the form
  var count = 0;
  if (currentTab == 0) {
    for (i = 0; i < y.length; i++) {
      if (y[i].checked == true) {
        count += 1;
      }
    }
    if (count < 2) {
      valid = false;
      alert("Error: please select 2 or more options.");
    }
    checkedBars = getCheckedBoxes(y);  // gets the selected bars to use in the next tab
    var contentStr, j;
    for (j = 0; j < checkedBars.length; j++) {
      contentStr += "<option>" + barList[checkedBars[j]] + "</option>"
    }
    document.getElementById("barDropDown1").innerHTML = contentStr;
    document.getElementById("barDropDown2").innerHTML = contentStr;
  }

  if (currentTab == 1) {
    var e = document.getElementById("barDropDown1");
    var start = e.options[e.selectedIndex].text;
    start = barList.indexOf(start);
    var f = document.getElementById("barDropDown2");
    var end = f.options[f.selectedIndex].text;
    end = barList.indexOf(end);
    getRoute(checkedBars, start, end);
  }

  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}

// gets the selected checkboxes and puts their indexes in an array
function getCheckedBoxes(y) {
  var checked = [];
  for (var i = 0; i < y.length; i++) {
    if (y[i].checked == true)  {
      checked.push(i);
    }
  }
  return checked;
}

async function getRoute(chosenBars, start, end) {
  var barsURL = '';
  var indexStart = chosenBars.indexOf(start);
  var indexEnd = chosenBars.indexOf(end);

  start = barList[start];
  end = barList[end];

  // removes start and end bars from chosen bar list
  if (indexStart == indexEnd) {
    chosenBars.splice(indexStart, 1);
  } else if (indexStart < indexEnd) {
    chosenBars.splice(indexEnd, 1);
    chosenBars.splice(indexStart, 1);
  } else {
    chosenBars.splice(indexStart), 1;
    chosenBars.splice(indexEnd, 1);
  }

  let waypoints = [];
  for (var i = 0; i < chosenBars.length; i++) {
    waypoints.push(barList[chosenBars[i]]);
  }
 
  let response = await fetch('/optimizeRoute/' + start + '/' + end + '/' + waypoints);
  let body = await response.text();

  body = JSON.parse(body);
  let waypointOrder = body.json.routes[0].waypoint_order;  // an array containing the indexes of the waypoints in the optimal order

  let waypointCollegeName = [];
  for (var j = 0; j < waypointOrder.length; j++) {
    waypointCollegeName.push(waypoints[waypointOrder[j]]);
  }

  let waypointCoords = [];
  for (var k = 0; k < waypointCollegeName.length; k++) {
    waypointCoords.push(collegeCoords[waypointCollegeName[k]]);
  }

  // creating a list of the bars to visit in the optimal order to show to the user
  // since by using coordinates with google maps, it does not show the college name
  let routeList = waypointCollegeName;
  routeList.unshift(start);
  routeList.push(end);

  start = collegeCoords[start];
  end = collegeCoords[end];

  for (var m = 0; m < waypointCoords.length; m++) {
    barsURL = barsURL.concat(waypointCoords[m], "|");
  }

  barsURL = barsURL.substring(0, barsURL.length - 1);

  // format the API call with the parameters required (origin, destination, waypoints, mode)
  var url = "https://www.google.com/maps/embed/v1/directions?origin=" + start +"&destination=" + end +"&mode=walking&waypoints=" + barsURL + "&key=AIzaSyCekgB4vQu-raXkvMR_pZXFUmqCG7LIXj4"

  document.getElementById("route").innerHTML = "<iframe width=\"600\" height=\"450\" frameborder=\"0\" style=\"border:0\" src=\"" + url + "\" allowfullscreen></iframe>"

  let routeListHTML = "";
  for (var n = 0; n < routeList.length; n++) {
    routeListHTML += "<li>" + routeList[n] + "</li>";
  }

  document.getElementById("route-list").innerHTML = "<ul>" + routeListHTML + "</ul>"

}