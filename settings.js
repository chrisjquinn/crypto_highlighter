// Create a new list item when clicking on the "Add" button
// TODO; re-factor the setSavedURLS() to use calls on this
function newElement() {
  var li = document.createElement("li");
  var input = document.getElementById("myInput");
  if (input.checkValidity()){
      let inputValue = input.value
      var t = document.createTextNode(inputValue);
      li.appendChild(t);
      document.getElementById("listRoot").appendChild(li);
      document.getElementById("myInput").value = "";
  }
  var span = document.createElement("span");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (let i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
  setSavedURLS();
}

const setSavedURLS = () => {
  // Get all the urls on the page
  let urls_to_save = [];
  let all_li = document.getElementsByTagName('li');
  for (let i = 0; i < all_li.length; i++){
    if (all_li[i].style.display !== "none"){
      console.log(`${all_li[i].childNodes[0].textContent} is not none`);
      urls_to_save.push(all_li[i].childNodes[0].textContent);
    }
  }
  chrome.storage.sync.set({["doNotRun"]: urls_to_save})
};


const getSavedURLS = async () => {
  let urls = await chrome.storage.sync.get(["doNotRun"]);
  urls = urls.doNotRun;
  console.log(`urls: ${urls}`);
  let list_root = document.getElementById("listRoot");
  for (let i = 0; i < urls.length; i++){
    let li = document.createElement("li");
    console.log(`urls[i]: ${urls[i]}`);
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

// Once the DOM is ready...
document.addEventListener('DOMContentLoaded', async () => {
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