$(document).ready(function () {

  // hiding input box for phone number
  $("form div input").eq(1).hide();
  $(".spinner").hide();

  // Switching between phone number and email address
  $(".switch-container span").on("click", function (event) {
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
    event.target.dataset.value == 'email' ? $("form div input").eq(0).show() : $("form div input").eq(0).hide();
    event.target.dataset.value == 'phone' ? $("form div input").eq(1).show() : $("form div input").eq(1).hide();
  });

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

    // assiging index of the input box
    let index;
    $('input').each(function (i, obj) {
      if (obj.style.cssText != "display: none;"){
        index = i;
      }
    });
    value = $("input").eq(index).val().toLowerCase();

    let email, phone;
    value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ? email = true : email = false;
    value.match(/\d{10,}/) ? phone = true : phone = false;

    if (email || (phone && value.length == 10)) {
      document.querySelector('input[type="text"]').parentNode.classList.remove("error");
      try {
        $(".spinner").show();
        const url = email ? 'https://ltv-data-api.herokuapp.com/api/v1/records.json?email=' + value : 'https://ltv-data-api.herokuapp.com/api/v1/records.json?phone=' + value;
        const response = await fetch(url);
        const contents = await response.text();
        console.log(contents);
        localStorage.setItem("userObject", contents);
        $(".spinner").hide();
        window.location.href = "result.html";
      } catch (error) {
        $(".spinner").hide();
        console.log(error);
      }
    } else if (!email && (!phone || value.length !== 10)) {

      index == 0? document.querySelector('input[type="text"]').parentNode.querySelector('.error-msg').innerHTML = 'Please enter a valid email address': document.querySelector('input[type="text"]').parentNode.querySelector('.error-msg').innerHTML = 'Please enter a valid phone number';
      document.querySelector('input[type="text"]').parentNode.classList.add("error");
    }
  }
});
