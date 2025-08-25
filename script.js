let linksData = {};
const commandsList = [
  "/study", "/science", "/maths", "/history", "/english", "/facts", "/tech", "/geography",
  "/news", "/sports", "/quotes", "/puzzles", "/history-facts", "/projects", "/ai", "/coding"
];

// Load links.json
fetch("links.json")
  .then(res => res.json())
  .then(data => { linksData = data; })
  .catch(err => console.error("Failed to load links.json:", err));

// ELEMENTS
const input = document.getElementById("commandInput");
const resultsDiv = document.getElementById("results");

let currentFocus = -1;

// Move closeAllLists outside so both functions can use it
function closeAllLists(elmnt) {
  const items = document.getElementsByClassName("autocomplete-items");
  for (let i = 0; i < items.length; i++) {
    if (elmnt != items[i] && elmnt != input) {
      items[i].parentNode.removeChild(items[i]);
    }
  }
}

// Process Command Search
function processCommand() {
  closeAllLists();
  const inputVal = input.value.trim();

  if (!linksData || Object.keys(linksData).length === 0) {
    resultsDiv.innerHTML = "<p>⏳ Loading resources, please wait...</p>";
    return;
  }

  resultsDiv.innerHTML = "";
  if (linksData[inputVal]) {
    linksData[inputVal].forEach(site => {
      const btn = document.createElement("a");
      btn.href = site.url;
      btn.target = "_blank";
      btn.className = "site-btn";
      btn.innerHTML = `${site.name} <span class="stars">${"⭐".repeat(site.rating)}</span>`;
      resultsDiv.appendChild(btn);
    });
  } else {
    resultsDiv.innerHTML = "<p>❌ Unknown command. Try /study, /science, etc.</p>";
  }
}

// AUTOCOMPLETE FUNCTION
function autocomplete(inp, arr) {
  inp.addEventListener("input", function() {
    let val = this.value;
    closeAllLists();
    if (!val) return false;
    currentFocus = -1;

    // Create container for autocomplete items:
    const list = document.createElement("DIV");
    list.setAttribute("id", this.id + "autocomplete-list");
    list.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(list);

    // Filter and add matching commands
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        const item = document.createElement("DIV");
        item.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>" + arr[i].substr(val.length);
        item.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        
        item.addEventListener("click", function() {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
          processCommand();
        });
        list.appendChild(item);
      }
    }
  });

  inp.addEventListener("keydown", function(e) {
    let list = document.getElementById(this.id + "autocomplete-list");
    if (list) list = list.getElementsByTagName("div");
    if (e.keyCode == 40) {
      // Arrow DOWN
      currentFocus++;
      addActive(list);
    } else if (e.keyCode == 38) {
      // Arrow UP
      currentFocus--;
      addActive(list);
    } else if (e.keyCode == 13) {
      // ENTER key
      e.preventDefault();
      if (currentFocus > -1) {
        if (list) list[currentFocus].click();
      } else {
        processCommand();
      }
      closeAllLists();
    }
  });

  function addActive(list) {
    if (!list) return false;
    removeActive(list);
    if (currentFocus >= list.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = list.length - 1;
    list[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(list) {
    for (let i = 0; i < list.length; i++) {
      list[i].classList.remove("autocomplete-active");
    }
  }

  // Removed closeAllLists from here (now global)

  // Close when clicking outside
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}

// Initialize autocomplete on page load
document.addEventListener("DOMContentLoaded", function() {
  autocomplete(input, commandsList);
});