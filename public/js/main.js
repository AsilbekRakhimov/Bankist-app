const userForm = document.querySelector(".sign-in-form");
const modal = document.querySelector(".modal");
const signInBtn = document.querySelector(".sign-in-btn");
const backIcon = document.querySelector(".back-icon");
const usersList = document.querySelector(".users-list");
const signInBtnSubmit = document.querySelector(".sign-in-btn-submit");
const modalWrapper = document.querySelector(".modalWrapper");
const usernameInput = document.querySelector(".username-input");
const passwordInput = document.querySelector(".password-input");

//  get data from url
async function getUsers() {
  const res = await fetch("https://bankist-app-4.onrender.com/users");
  const data = await res.json();
  const boxUsers = document.createElement("div");
  boxUsers.className = "users-list-for-login";
  boxUsers.innerHTML =
    '<h1 class="users-heading">You can login by this accounts</h1>';
  for (let i = 0; i < 4; i++) {
    boxUsers.innerHTML += `
        <div class="user-data">
            <p>Username</p>
            <p>Password</p>
            <p>${data[i].username}</p>
            <p>${data[i].password}</p>
        </div>
    `;
  }
  usersList.appendChild(boxUsers);
}
getUsers();
//  get data from url

// Register
userForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = event.target.username.value;
  const password = event.target.password.value;
  const res = await fetch(`https://bankist-app-4.onrender.com/user`, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  if (res.status == 201 && res.ok) {
    window.location.href = `user?${username}`;
    // usernameInput.value = ''
    // passwordInput.value = ''
  } else {
    alert("Error with register");
    window.location.reload();
  }
});
// Register

signInBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

backIcon.addEventListener("click", (e) => {
  modal.classList.add("hidden");
});

modalWrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    modal.classList.add("hidden");
  }
});
