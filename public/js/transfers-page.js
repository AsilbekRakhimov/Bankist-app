const currentTime = document.querySelector(".current-time");
const balanceMoney = document.querySelector(".balance-money");
const transfersHistory = document.querySelector(".tranfers-list");
const allInMoney = document.querySelector(".all-in-money");
const allOutMoney = document.querySelector(".all-out-money");
const transferForm = document.querySelector(".transfer-form");
const transferToUsername = document.querySelector(".transfer_to_username");
const transferToAmount = document.querySelector(".transfer_to_amount");
const loanForm = document.querySelector(".loan-form");

//  timesetterrrr
function timeSetter(params) {
  let month =
    new Date().getMonth() + 1 >= 10
      ? "" + (new Date().getMonth() + 1)
      : "0" + (new Date().getMonth() + 1);
  currentTime.textContent = `As of ${
    new Date().getDate() >= 10
      ? "" + new Date().getDate()
      : "0" + new Date().getDate()
  }/
  ${month}/
  ${new Date().getFullYear()}, ${
    new Date().getHours() >= 10
      ? "" + new Date().getHours()
      : "0" + new Date().getHours()
  }:${
    new Date().getMinutes() >= 10
      ? "" + new Date().getMinutes()
      : "0" + new Date().getMinutes()
  }`;
}
timeSetter();
setInterval(() => {
  timeSetter();
}, 60000);
//  timesetterrrr

async function getUserData() {
  const res = await fetch(
    `https://bankist-app-4.onrender.com/user_data?${window.location.href.split("?")[1]}`
  );
  const data = await res.json();
  return data;
}

function showTransfers(data) {
  balanceMoney.textContent = "$" + `${data.balanse}`;
  let inMoney = 0;
  let outMoney = 0;
  for (let i = 0; i < data.transfers.length; i++) {
    if (data.transfers[i] > 0) inMoney += data.transfers[i];
    else outMoney += data.transfers[i];
  }
  allInMoney.textContent = "$" + inMoney;
  allOutMoney.textContent = "$" + outMoney;

  const box = document.createElement("div");
  box.className = 'transfers-list-inner'
  data.transfers = data.transfers.reverse()
  for (let i = 0; i < data.transfers.length; i++) {
    if (data.transfers[i] > 0) {
      box.innerHTML += `
        <div>
        <p style="font-weight:750" class="deposit" >deposit<p/>
        <p style="font-weight:750" >$${data.transfers[i]}</p>
        </div>
      `
    }else{
      box.innerHTML +=
      `
      <div>
        <p class="withdrawal" style="font-weight:750" >withdrawal<p/>
        <p style="font-weight:750" >$${data.transfers[i]}</p>
        </div>
      `
    }
  }
  transfersHistory.appendChild(box)
}

// transfers
transferForm.addEventListener("submit", async (event)=>{
  event.preventDefault();
  const fromUsername = window.location.href.split("?")[1];
  const toUsername = event.target.transfer_to_username.value;
  const amount = event.target.transfer_to_amount.value
  try {
    const res = await fetch(`https://bankist-app-4.onrender.com/update` , {
    method:"POST",
    body:JSON.stringify({
      fromUsername:fromUsername,
      toUsername:toUsername,
      amount:amount
    })
  })
  } catch (error) {
    throw error
  }
  transferToUsername.value = ''
  transferToAmount.value = ''
  window.location.reload()
})
// transfers

// get loan
loanForm.addEventListener("submit", async (e) =>{
  e.preventDefault()
  const loan_amount = e.target.loan_amount.value
  console.log(loan_amount);
  const username = window.location.href.split("?")[1]
  const res = await fetch(`https://bankist-app-4.onrender.com/loan`, {
    method:"POST",
    body:JSON.stringify({
      username:username,
      loan_amount:loan_amount
    })
  });
  window.location.reload()
})
// get loan

getUserData().then((data) => {
  showTransfers(data);
});
