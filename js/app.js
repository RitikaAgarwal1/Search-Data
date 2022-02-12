$(document).ready(function () {

  // Triggers user detail method when clicking on Go button
  $("#btn-search").on("click", async function (e) {
    userDetail(e);
  });

  // Triggers user detail method when pressing enter key
  $('input[type="text"]').keypress(function (event) {
    keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      userDetail(event);
    }
  });

  /**
  * Makes a request to ltv API to search an specific email address.
  * If there's a response, it gets stored in the local storage and redirects to results page
  */
  async function userDetail(e) {
    e.preventDefault();
    localStorage.clear(); //Clears storage for next request
    value = $('input[type="text"]').val().toLowerCase();

    let email, phone;
    value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ? email = true : email = false;
    value.match(/\d{10,}/)? phone = true: phone = false;

    if (email || (phone && value.length == 10)) {
      document.querySelector('input[type="text"]').parentNode.classList.remove("error");
      try {
        const url = email? 'https://ltv-data-api.herokuapp.com/api/v1/records.json?email=' + value: 'https://ltv-data-api.herokuapp.com/api/v1/records.json?phone=' + value;
        const response = await fetch(url);
        const contents = await response.text();
        console.log(contents);
        localStorage.setItem("userObject", contents);
        window.location.href = "result.html";
      } catch (error) {
        console.log(error);
      }
    } else if (!email && (!phone || value.length !== 10)) {
      document.querySelector('input[type="text"]').parentNode.classList.add("error");
    }
  }
});
