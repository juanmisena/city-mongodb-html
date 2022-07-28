let check_pass = $("#check_pass");
let check_pass2 = $("#check_pass2");
let check_pass3 = $("#check_pass3");
let pass_user = $("#pass_user");
let conf_pass_user = $("#conf_pass_user");
let i1 = $("#i1");
let i2 = $("#i2");
let i3 = $("#i3");
let gen_pass2 = $("#gen_pass2");
let _id_pass = $("#_id_pass");
$(document).ready(function () {
  setCheckouPass(check_pass, i1, pass_user);
  setCheckouPass(check_pass2, i2, pass_user, conf_pass_user);
  setCheckouPass(check_pass3, i3, pass_user, conf_pass_user);
  setGenerate();
  resetPass();
  getIdPass(_id_pass);
});
function setCheckouPass(checkbox, italic, seletor1, seletor2 = null) {
  $(checkbox).click(function () {
    if ($(this).is(":checked")) {
      if ($(italic).hasClass("bi-eye-fill")) {
        $(italic).removeClass("bi-eye-fill");
        $(italic).addClass("bi-eye-slash-fill");
      }
      $(seletor1).attr("type", "text");
      $(seletor2).attr("type", "text");
    } else {
      if ($(italic).hasClass("bi-eye-slash-fill")) {
        $(italic).removeClass("bi-eye-slash-fill");
        $(italic).addClass("bi-eye-fill");
      }
      $(seletor1).attr("type", "password");
      $(seletor2).attr("type", "password");
    }
  });
}
function setGenerate() {
  $(gen_pass2).click(function () {
    if ($(this).is(":checked")) {
      let pass = getGenerate();
      $(pass_user).val(pass);
      $(conf_pass_user).val(pass);
    } else {
      $(pass_user).val("");
      $(conf_pass_user).val("");
    }
  });
}
function getGenerate() {
  let length = 8;
  let base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.?,;-_¡!¿*%&$/°()[]{}|@><";
  return generatePass(base, length);
}
function generatePass(base, length) {
  let password = "";
  for (let i = 0; i < length; i++) {
    let random = Math.floor(Math.random() * base.length);
    password += base.charAt(random);
  }
  return password;
}
function resetPass() {
  $(".btn-outline-secondary").click(function () {
    Swal.fire({
      title: "Submit your username for reset", 
      input: "text", 
      showCancelButton: true, 
      confirmButtonText: "Yes, Reset it!",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      } 
    }).then((result) => {
      if (result.isConfirmed) {
        let user = result.value;
        $.get("/resetuser", {user},
        function (data, textStatus, jqXHR) {
          if (data == false) {
            Swal.fire({icon: "error", title: "Upps..", text: "The username not exists"});
          } else {
              Swal.fire({
                title: "Reset User!",
                icon: "success",
                timer: 1500
              });
              let _id = data._id;
              let encId = CryptoJS.AES.encrypt(_id, "secret");
              let strenc = encId.toString();
              localStorage.setItem('_idPass', JSON.stringify({_id: strenc}));
              window.location.href = "/resetpass";
            }
          }
        );
      } 
    });
  });
}
function getIdPass(selector = null) {
  if (localStorage.getItem('_idPass')) {
    let json = $.parseJSON(localStorage.getItem('_idPass'));
    let {_id} = json;
    let decId = CryptoJS.AES.decrypt(_id, "secret");
    let strdec = decId.toString(CryptoJS.enc.Utf8);
    $(selector).val(strdec);
    return;
  } 
}