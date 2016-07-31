// TODO: Using a small sample dictionary, testDictionary. Find an API, or 
// host a local dictionary of words not currently used for usernames. 
// If we do host our own, use a different data structure to speed searching.

var username;
var suggestions = [];


function checkAPI(username) {
  url = "http://chegg-tutors.appspot.com/coding-challenge/api/user/?username=" + username;

  // Check API for user suggested name
  // var xhr = new XMLHttpRequest();
  // xhr.open("GET", url, false);
  // xhr.send();
  // console.log(xhr.responseText);
  // return xhr.responseText;

  $.ajax(url).done(function(data) {
    console.log(data);
    return(data);
  });
}

function makeNumberSuggestion (userSuggestion) {
  // count digits
  var digits = 0;
  for (var i = 0; i<userSuggestion.length; i++) {
    if (!isNaN(userSuggestion[i])) {
      digits++;
    }
  }
  for (var i = 0; i<100; i++) {
    while (suggestions.length < 2 && digits < 2) {
      if (i < 10) {
          i = "0" + i;
      }
      var suggestion = userSuggestion + i;
      if (checkAPI(userSuggestion)) {
        suggestions.push(suggestion);
        digits++;
      }
      suggestion = i + userSuggestion;
      if (checkAPI(userSuggestion)) {
        suggestions.push(suggestion);
        digits++;
      }
    }
  }
}


function findSimilarWord(word) {

  while (suggestions.length < 3) {
    console.log(suggestions);
    // Find words in dictionary that contain user suggested name i.e. elect --> elected
    for (var i = 0; i < 100; i++) {
      if (testDictionary[i].includes(word)) {
        checkAPI(testDictionary[i])
        suggestions.push(testDictionary[i])
        if (suggestions.length === 3) {
          return
        }
      }
    }

    // check for a subset of user suggested name i.e. election --> elect
    for (var j = 0; j < word.length; j++) {
      var first = word.slice(0,i);
      var second = word.slice(i);

      if (testDictionary.includes(first) && (typeof(checkAPI(first)) === undefined)) {
          suggestions.push(first);
          if (suggestions.length === 3) {
          return
          }
      } else if (testDictionary.includes(second) && (typeof(checkAPI(second)) === undefined)) {
        suggestions.push(second);
        if (suggestions.length === 3) {
          return
        }
      } else if (i > 1) {
        for (var j=0; j<i; j++) {
          var middle = word.slice(j, i)
          if (testDictionary.includes(middle) && (typeof(checkAPI(middle)) === undefined)) {
            suggestions.push(word.slice(j,i));
            if (suggestions.length === 3) {
              return
            }
          }
        }   
      } else {
        while (suggestions < 3) {
          suggestion = testDictionary[Math.floor(Math.random()*items.length)];
          if ((typeof(checkAPI(suggestion)) === undefined)) {
            suggestions.push(suggestion)
          }
        }
        
      }
    }
  }
}


$("#chg-balloon-submit").click(function(){
  username = $("#chg-balloon-input").val();
  var nameInUse = checkAPI(username);

  // If response shows already in API, find suggestions, else, confirm availability
  if (typeof(nameInUse) != undefined) {
    console.log("find suggestions");

    // Add two digits to beginning or end of username
    makeNumberSuggestion(username);
    console.log(suggestions)
    
    // Find similar string (no numbers)
    findSimilarWord(username);
    console.log(suggestions);

    // Show suggestions
    $("#confirm").html('<p><img class="info" src="static/redx.png"> Sorry, ' + username + ' is not available.</p>');
    $("#suggest").html('How about one of these? <p> ' + suggestions[0] + '</p><p>' + suggestions[1] + '</p><p>' + suggestions[2] + '</p>');

  } else {
    // show confirmation
      $("#confirm").html('<p><img class="info" src="static/check.png"> Congratulations! ' + username + ' is available!</p>')

  }

})




