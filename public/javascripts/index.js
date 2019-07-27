var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab
var barList = ["Collingwood", "Grey", "Hatfield", "Josephine Butler", "St Aidan's", "St Chad's", "St Cuthbert's Society", "St Hild & St Bede",
              "St John's", "St Mary's", "Trevelyan", "University", "Ustinov", "Van Mildert", "Stephenson", "John Snow"];
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
  var i;
  var checked = [];
  for (i = 0; i < y.length; i++) {
    if (y[i].checked == true)  {
      checked.push(i);
    }
  }
  return checked;
}

async function getRoute(chosenBars, start, end) {
  // format the API call with the parameters required (origin, destination, waypoints, mode)
  // need to remove special characters (', &) and replace spaces with +
  var barsURL = '';
  var i;
  var indexStart = chosenBars.indexOf(start);
  var indexEnd = chosenBars.indexOf(end);

  start = barList[start];
  end = barList[end];

  start = start.replace(/[&']/g, '').replace(/ /g, "+").concat("+College");
  end = end.replace(/[&']/g, '').replace(/ /g, "+").concat("+College");

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

  for (i = 0; i < chosenBars.length; i++) {
    barsURL = barsURL.concat(barList[chosenBars[i]].replace(/[&']/g, '').replace(/ /g, "+"), "+College", "|");
  }
  barsURL = barsURL.substring(0, barsURL.length - 1);

  // fetch('/optimizeRoute/' + start + '/' + end + '/' + barsURL);

  let response = await fetch('optimizeRoute/' + start + '/' + end +'/' + barsURL);
  console.log(response);
  let body = await response.text();
  console.log(body);
  body = await JSON.parse(body);
  console.log(body);

  var url = "https://www.google.com/maps/embed/v1/directions?origin=" + start +"&destination=" + end +"&mode=walking&waypoints=" + barsURL + "&key=AIzaSyCekgB4vQu-raXkvMR_pZXFUmqCG7LIXj4"
  console.log(url);
  document.getElementById("route").innerHTML = "<iframe width=\"600\" height=\"450\" frameborder=\"0\" style=\"border:0\" src=\"" + url + "\" allowfullscreen></iframe>"

}