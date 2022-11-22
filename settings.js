// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  let input = document.getElementById("myInput");
  let t = document.createTextNode(input.value);
  li.appendChild(t);
  input.value = "";
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.onclick = function(){
    li.style.display = "none";
    setSavedURLS();
  }
  span.appendChild(txt);
  li.appendChild(span);
  let list_root = document.getElementById("listRoot");
  list_root.appendChild(li);
  setSavedURLS();
}

const setSavedURLS = async () => {
  // Get all the urls on the page
  let urls_to_save = [];
  let all_li = document.getElementsByTagName('li');
  for (let i = 0; i < all_li.length; i++){
    if (all_li[i].style.display !== "none"){
      urls_to_save.push(all_li[i].childNodes[0].textContent);
    }
  }
  console.log(`${JSON.stringify(urls_to_save)}`);
  await chrome.storage.sync.set({["doNotRun"]: urls_to_save});
};


const getSavedURLS = async () => {
  let urls = await chrome.storage.sync.get(["doNotRun"]);
  urls = urls.doNotRun;
  let list_root = document.getElementById("listRoot");
  for (let i = 0; i < urls.length; i++){
    let li = document.createElement("li");
    li.textContent = urls[i];
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.onclick = function(){
      li.style.display = "none";
      setSavedURLS();
    }
    span.appendChild(txt);
    li.appendChild(span);
    list_root.appendChild(li);
  }
};


const setThemeMode = async () => {
  // retrieve current theme
  let color_theme = await chrome.storage.sync.get(['theme']);
  color_theme = color_theme.theme;

  // change html root class
  const html_root = document.getElementsByTagName('html')[0];
  html_root.classList = color_theme + '-mode';

  // change the radio buttons
  const theme_radiobtn = document.getElementById(color_theme);
  theme_radiobtn.checked = true;
  if (color_theme === "dark") {
    document.getElementById('light').addEventListener('change', toggleThemeMode);
  } else {
    document.getElementById('dark').addEventListener('change', toggleThemeMode);
  }
};

const toggleThemeMode = async () => {
  // change then reload the theme
  let color_theme = await chrome.storage.sync.get(['theme']);
  color_theme = color_theme.theme;
  if (color_theme === "dark") {
    await chrome.storage.sync.set({["theme"]: "light"});
  } else {
    await chrome.storage.sync.set({["theme"]: "dark"});
  }
  setThemeMode();
};

const loadPreferences = async () => {
  const preferences = await chrome.storage.sync.get(['preferences']);
  return preferences.preferences;
};

const setPreference = async (e) => {
  const preference = e.target.id;
  let current_preferences = await loadPreferences();
  const checkbox_element = document.getElementById(preference);
  current_preferences[preference] = checkbox_element.checked;
  chrome.storage.sync.set({['preferences']: current_preferences});
};

const populatePreferences = async () => {
  const preferences = await loadPreferences();
  for (let key in preferences){
    let checkbox_element = document.getElementById(key);
    checkbox_element.checked = preferences[key];
    checkbox_element.addEventListener('change', setPreference);
  }
};

// Once the DOM is ready...
document.addEventListener('DOMContentLoaded', async () => {
  populatePreferences();
  getSavedURLS();
  setThemeMode();
  document.getElementById('addBtn').addEventListener('click', newElement);

  // Get the input field
  var input = document.getElementById("myInput");

  // Execute a function when the user presses a key on the keyboard
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("addBtn").click();
      }
    });
});