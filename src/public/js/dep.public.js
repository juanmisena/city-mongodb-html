const tbodyDep = $("#tbodydep");
let trDep = $(tbodyDep).children();
let searchDep = $("#searchDep");
$(document).ready(function () {
  ajaxDataDep();
  setDeleteDep();
  setEditDep();
  getEditDep();
  setSearchDep();
  setDeleteDep();
  getSessionName();
});
function ajaxDataDep() {
  $.get("/list",
    function (data, textStatus, jqXHR) {
      if (data.length > 0) {
        $(tbodyDep).html("");
        $.each(data, function (i, dep) { 
          $(trDep).find("th").text((i + 1));
          $(trDep).find("td:eq(0)").text(dep.name_dep);
          $(trDep).find(".btn-info").data("id", dep._id);
          $(trDep).find(".btn-danger").data("id", dep._id);
          const clone = $(trDep).clone(true);
          $(tbodyDep).append(clone);
        });
      } else {
        emptyFields(tbodyDep);
      }
    }
  );
  getSessionName();
}
function setDeleteDep() {
  $(tbodyDep).on("click", ".btn-danger", function () {
    let _id = $(this).data("id");
    Swal.fire({title: "Are you sure?", text: "You won't be able to revert this!", icon: "warning", showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Yes, delete it!"}).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your Dep has been deleted.", "success");
        $.get("/onecity", {data: _id},
          function (data, textStatus, jqXHR) {
            let _idci;
            $.each(data, function (i, city) { 
              _idci = city._id;
              $.post("/deleteci/" + _idci,
                function (data, textStatus, jqXHR) {
                  if (data) {
                    ajaxDataDep();
                  } 
                }
              );
            });
          } 
        );
        $.post("/deletedep/" + _id,
          function (data, textStatus, jqXHR) {
            if (data) {
              ajaxDataDep();
            }
          }
        );
      }
    });
  });
}
function setEditDep() {
  $(tbodyDep).on("click", ".btn-info", function () {
    let _id = $(this).data("id");
    _id = _id.toString();
    let encrypted = CryptoJS.AES.encrypt(_id, "secret");
    let strenc = encrypted.toString();
    localStorage.setItem('_idDep', JSON.stringify({_idDep: strenc}));
    window.location.href = "/editdep";
  });
}
function getEditDep() {
  if (localStorage.getItem('_idDep')) {
    let {_idDep} = JSON.parse(localStorage.getItem('_idDep'));
    let decrypted = CryptoJS.AES.decrypt(_idDep, "secret");
    let strdecrypted = decrypted.toString(CryptoJS.enc.Utf8);
    $.get("/oneeditdep/" + strdecrypted,
      function (data, textStatus, jqXHR) {
        if (!data) throw new Error('Something bad happened.'); 
        const {_id} = data;
        const {name_dep} = data;
        $("#_id_edit").val(_id);
        $("#name_dep_edit").val(name_dep);
      }
    );
  } 
}
function setSearchDep() {
  $(searchDep).on("input", function (e) {
    let val = $(e.target).val();
    if (val.length > 0) {
      let arr = val.split(" ");
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }
      let str2 = arr.join(" ");
      // val = `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
      $.get("/searchdep", {data: str2},
        function (data, textStatus, jqXHR) {
          if (data.length > 0) {
            $(tbodyDep).html("");
            $.each(data, function (i, dep) { 
              $(trDep).find("th").text((i + 1));
              $(trDep).find("td:eq(0)").text(dep.name_dep);
              $(trDep).find(".btn-info").data("id", dep._id);
              $(trDep).find(".btn-danger").data("id", dep._id);
              const clone = $(trDep).clone(true);
              $(tbodyDep).append(clone);
            });
          }
        }
      );
    } else {
      ajaxDataDep();
    }
  });
}
function getSessionName() {
  $.get("/sessionname",
    function (data, textStatus, jqXHR) {
      $("#person").text(data);
    }
  );
}
/**
 * @param {any} tbody
 */
function emptyFields(tbody) {
  return $(tbody).hide();
}