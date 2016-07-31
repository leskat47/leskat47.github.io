// TODO: Using a small sample dictionary testDictionary. Find an API, or 
// host a local dictionary of words not currently used for usernames. 
// If we do host our own, use a different data structure to speed searching.

var username;
var suggestions = [];

function checkAPI(username) {
  url = "http://chegg-tutors.appspot.com/coding-challenge/api/user/?username=" + $("#username").val();

  // Check API for user suggested name
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send();
  return xhr.responseText

}

function makeNumberSuggestion (userSuggestion) {
  for (var i = 0; i<100; i++) {
    while (suggestions.length < 2) {
      if (i < 10) {
          i = "0" + i;
      }
      var suggestion = userSuggestion + i;
      if (checkAPI(userSuggestion)) {
        suggestions.push(suggestion)
      }
      suggestion = i + userSuggestion;
      if (checkAPI(userSuggestion)) {
        suggestions.push(suggestion)
      }
    }
  }
}


function findSimilarWord(word) {

  while (suggestions.length < 3) {
    // Find words that contain user suggested name i.e. elect --> elected
    for (var i = 0; i<100; i++) {
      if (testDictionary[i].includes(word)) {
        checkAPI(testDictionary[i])
        console.log("API")
        suggestions.push(testDictionary[i])
        return
      }


      // check for a subset of user suggested name i.e. election --> elect
      var first = word.slice(0,i);
      var second = word.slice(i);

      if (testDictionary.includes(first)) {
        suggestions.push(first);
      } else if (testDictionary.includes(second)) {
        suggestions.push(second);
      } else if (i > 1) {
        for (var j=0; j<i; j++) {
          var middle = word.slice(j, i)
          if (testDictionary.includes(middle)) {
            suggestions.push(word.slice(j,i));
          }
        }   
      }
    }
  }
}


$("#username").change(function () {
  username = $("#username").val()
  nameInUse = checkAPI(username)
    

  // If response shows already in API, find suggestions, else, confirm availability
  if (nameInUse) {
    // Add two digits to beginning or end of username

    makeNumberSuggestion(username);
    

    // Find similar string (no numbers)
    findSimilarWord(username);
    console.log(suggestions)
    // Show suggestions

  } else {
      // TODO: show confirmation

  }

});



