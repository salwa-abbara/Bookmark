var siteName = document.getElementById("bookmarkName");
var siteURL = document.getElementById("bookmarkURL");
var submitBtn = document.getElementById("submitBtn");
var tableContent = document.getElementById("tableContent");
var closeBtn = document.getElementById("closeBtn");
var validationMessage = document.querySelector(".validation");
var deleteBtns;
var visitBtns;
var bookmarks;

// take all data stored in localStorage and display it
if (localStorage.getItem("bookmarksList") == null) {
    bookmarks=[];
}
else{
    bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
    for (var x = 0; x < bookmarks.length; x++) {
      displayBookmark(x);
    }
}


//capitalize first letter of site name
function capitalizeFirstLetter(userString) {
    var userStringArr = userString.split("");
    userStringArr[0] = userStringArr[0].toUpperCase();
    return userStringArr.join("");
}


// make sure that the user enter valied site name and url
var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;
siteName.addEventListener("input", function () {
  validate(siteName, nameRegex);
});

siteURL.addEventListener("input", function () {
  validate(siteURL, urlRegex);
});

function validate(element, regex) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}

// when user click submit
submitBtn.addEventListener("click", function () {
    if (siteName.classList.contains("is-valid") && siteURL.classList.contains("is-valid")) {
      var bookmark = {
        siteName: capitalizeFirstLetter(siteName.value),
        siteURL: siteURL.value,
      };
      bookmarks.push(bookmark);
      localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
      displayBookmark(bookmarks.length - 1);
      clear();
      siteName.classList.remove("is-valid");
      siteURL.classList.remove("is-valid");
    } else {
        validationMessage.classList.remove("d-none");
    }
  });

// Clear user input
function clear() {
    siteName.value = "";
    siteURL.value = "";
}

// display function that display  bookmark site based on the index abd adding events to delet and visit buttons
function displayBookmark(index) {
    var newBookmark = `<tr>
                  <td>${index + 1}</td>
                  <td>${bookmarks[index].siteName}</td>              
                  <td>
                    <button class="btn btn-visit" data-index="${index}">
                      <i class="fa-solid fa-eye pe-2"></i>Visit
                    </button>
                  </td>
                  <td>
                    <button class="btn btn-delete pe-2" data-index="${index}">
                      <i class="fa-solid fa-trash-can"></i>Delete
                    </button>
                  </td>
              </tr>`;
    tableContent.innerHTML += newBookmark;
  
    // adding event to all delete buttons
    deleteBtns = document.querySelectorAll(".btn-delete");
    if (deleteBtns != null) {
      for (var i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener("click", function (e) {
          deleteBookmark(e);
        });
      }
    }
  
    // adding event to all visit buttons
    visitBtns = document.querySelectorAll(".btn-visit");
    if (visitBtns != null) {
      for (var j = 0; j < visitBtns.length; j++) {
        visitBtns[j].addEventListener("click", function (e) {
          visitWebsite(e);
        });
      }
    }
}

// delete function
function deleteBookmark(e) {
    tableContent.innerHTML = "";
    var deletedBookMark = e.target.dataset.index;
    bookmarks.splice(deletedBookMark, 1);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    for (var k = 0; k < bookmarks.length; k++) {
      displayBookmark(k);
    }
}
  
// visit function
function visitWebsite(e) {
    var bookMarkIndex = e.target.dataset.index;
    var httpsRegex = /^https?:\/\//;
    if (httpsRegex.test(bookmarks[bookMarkIndex].siteURL)) {
      open(bookmarks[bookMarkIndex].siteURL);
    } else {
      open(`https://${bookmarks[bookMarkIndex].siteURL}`);
    }
}

//------------close validation box message-------------
//Close icon Function
function closeIcon() {
    validationMessage.classList.add("d-none");
}
  // close by close button
closeBtn.addEventListener("click", closeIcon);
//close by  clicking outside validation box message
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("validation")) {
      closeIcon();
    }
});
//close by esc key on keyboard
document.addEventListener("keydown", function (e) {
    if (e.key == "Escape") {
      closeIcon();
    }
});
