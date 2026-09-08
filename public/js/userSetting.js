let pincodeInp=document.querySelector('#pincode')
let pinMsg=document.querySelector(".pinMsg")
let country = document.querySelector("#country");
let state = document.getElementById("state");
let locationForm=document.querySelector(".locFormBtn")
let hiddenform=document.querySelector('.form-container')
let locationContent=document.querySelector('.address-card__content')
locationForm.addEventListener("click",()=>{
  hiddenform.classList.remove("hidden")
  locationContent.classList.add("hidden")
})
// 1. Fetching Countries
fetch('https://api.countrystatecity.in/v1/countries', {
  headers: { 'X-CSCAPI-KEY': 'c967b379449c619747cf5418f1958fa8f062fbd31b6d132766ea0748566a4e8f' }
})
.then(response => response.json())
.then(data => {
  data.map((ele) => {
    let countryOpt = document.createElement("option");
    countryOpt.value = ele.name;
    countryOpt.innerText = ele.name;
    country.appendChild(countryOpt);
  });
})
.catch(error => console.error('Error fetching countries:', error));

// 2. Country Change Event Listener
country.addEventListener("change", (e) => {
  let selectedCountry = e.target.value;

  state.innerHTML = '<option value="">Select State</option>';

  if (selectedCountry) {
    fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        country: selectedCountry
      })
    })
    .then(response => response.json())
    .then(data => {
      // Safety check ki states exit karte hain ya nahi
      if (data.data && data.data.states) {
        let states = data.data.states;
        states.map((ele) => {
          let stateOpt = document.createElement("option"); // Added 'let'
          stateOpt.value = ele.name;
          stateOpt.innerText = ele.name;
          state.appendChild(stateOpt);
        });
      } else {
        let noStateOpt = document.createElement("option");
        noStateOpt.innerText = "No states found";
        state.appendChild(noStateOpt);
      }
    })
    .catch(error => console.error('Error fetching states:', error));
  }
});
pincodeInp.addEventListener("input",(e)=>{
  if (pincodeInp.value.length===6) {
       pinMsg.innerText=""
       fetch(`https://api.postalpincode.in/pincode/${pincodeInp.value}`)
       .then(res=>res.json())
       .then(data=>{
        let countryName=data[0].PostOffice[0].Country
        let stateName=data[0].PostOffice[0].State
        country.innerHTML=`<option value="${countryName}">${countryName}</option>`
        state.innerHTML=`<option value="${stateName}">${stateName}</option>`
       })
       .catch(err=>console.error(err)
       )}
else {
    pinMsg.innerText="Pincode Should be 6 digit"
}
})