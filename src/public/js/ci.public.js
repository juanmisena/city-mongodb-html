const tbodyCi = $("#tbodyCi");
let trCi = $(tbodyCi).children();
const selectDep = $("#inputGroupSelect01");
const selectCi = $("#inputGroupSelect02");
let child1 = $(selectDep).find("#child1");
let child2 = $(selectDep).find("#child2");
let childEdit1 = $(selectCi).find("#child_edit_1");
let childEdit2 = $(selectCi).find("#child_edit_2");
let searchCId = $("#searchCi");
$(document).ready(function () {
  setSelectDep();
  ajaxDataCi();
  setDeleteCi();
  setEditCi();
  getEditCi();
  searchCi();
  searchCiOuters();
  getSessionName();
});
function ajaxDataCi() {
  let fdeps;
  let beginCi;
  $.get("/begin",
    function (cities, textStatus, jqXHR) {
      $.get("/list",
        function (deps, textStatus, jqXHR) {
          $(tbodyCi).html("");
          $.each(cities, function (i, city) { 
            fdeps = deps.filter((dep) => {
              if (cities.length > 0 || deps.length > 0) {
                return dep._id == city._idDep;
              }
            });
            $.each(fdeps, function (i, dep) {
              beginCi = {_id: city._id, name_ci: city.name_ci, name_dep: dep.name_dep};
            });
            $(trCi).find("th").text((i + 1));
            $(trCi).find("td:eq(0)").text(beginCi.name_ci);
            $(trCi).find("td:eq(1)").text(beginCi.name_dep);
            $(trCi).find(".btn-info").data("id", beginCi._id);
            $(trCi).find(".btn-danger").data("id", beginCi._id);
            const clone = $(trCi).clone(true);
            $(tbodyCi).append(clone);
          });
        }
      );
    }
  );
}
function setSelectDep() {
  $.get("/list",
    function (data, textStatus, jqXHR) {
      if (data) {
        $(selectDep).html("");
        $.each(data, function (i, dep) { 
          $(child2).val(dep._id).text(dep.name_dep);
          const clone = $(child2).clone(true);
          $(selectDep).append(clone).append(child1);
        });
      } 
    }
  );
  getSessionName();
}
function setDeleteCi() {
  $(tbodyCi).on("click", ".btn-danger", function () {
    let _id = $(this).data("id");
    Swal.fire({title: "Are You Sure?", text: "this city has deleted if enter click!", icon: "warning", showCancelButton: true, confirmButtonText: "Yes, deleted it!"}).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted", "this your city has been deleted", "success");
        $.post("/deleteci/" + _id,
          function (data, textStatus, jqXHR) {
            if (data) {
              ajaxDataCi();
            }
          }
        );
      } 
    })
  });
}
function setEditCi() {
  $(tbodyCi).on("click", ".btn-info", function () {
    let _id = $(this).data("id");
    let encrypted = CryptoJS.AES.encrypt(_id, "secret");
    let strenc = encrypted.toString();
    localStorage.setItem('_idCi', JSON.stringify({_idCi: strenc}));
    window.location.href = "/editci";
  });
}
function getEditCi() {
  if (localStorage.getItem('_idCi')) {
    let {_idCi} = $.parseJSON(localStorage.getItem('_idCi'));
    let decrypted = CryptoJS.AES.decrypt(_idCi, "secret");
    let strdec = decrypted.toString(CryptoJS.enc.Utf8);
    $.get("/oneeditci/" + strdec,
      function (city, textStatus, jqXHR) {
        $.get("/list",
          function (deps, textStatus, jqXHR) {
            $("#_id_edit").val(city._id);
            $("#name_ci_edit").val(city.name_ci);
            if (deps.length >= 2) {
              $(selectCi).html("");
              $.each(deps, function (i, dep) {
                if (dep._id == city._idDep) {
                  $(childEdit1).val(dep._id).text(dep.name_dep);
                } else {
                  $(childEdit2).val(dep._id).text(dep.name_dep);
                  const clone = $(childEdit2).clone(true);
                  $(selectCi).append(childEdit1).append(clone);
                }
              });
            } else {
              $.each(deps, function (i, dep) {
                if (dep._id == city._idDep) {
                  $(childEdit1).val(dep._id).text(dep.name_dep);
                } else {
                  $(childEdit2).val(dep._id).text(dep.name_dep);
                  const clone = $(childEdit2).clone(true);
                  $(selectCi).append(childEdit1).append(clone);
                }
              });
            }
          }
        );
      }
    );
  } 
}
function searchCi() {
  $(searchCId).on("input", function (e) {
    $(tbodyCi).html("");
    let val = $(e.target).val();
    if (val.length > 0) {
      const arr = val.split(" ");
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }
      const str2 = arr.join(" ");
      let scity;
      $.get("/searchci", {data: str2},
        function (cities, textStatus, jqXHR) {
          $.get("/list",
            function (deps, textStatus, jqXHR) {
              $.each(cities, function (ici, ci) {
                $.each(deps, function (idep, dep) { 
                  if (dep._id == ci._idDep) {
                    scity = {_id: ci._id, name_ci: ci.name_ci, name_dep: dep.name_dep}
                  }
                }); 
                $(trCi).find("th").text((ici + 1));
                $(trCi).find("td:eq(0)").text(scity.name_ci);
                $(trCi).find("td:eq(1)").text(scity.name_dep);
                $(trCi).find(".btn-info").data("id", scity._id);
                $(trCi).find(".btn-danger").data("id", scity._id);
                const clone = $(trCi).clone(true);
                $(tbodyCi).append(clone);
              });
            }
          );
        }
      );
    } else {
      ajaxDataCi();
    }
  });
}
function searchCiOuters() {
  $(searchCId).on("input", function (e) {
    let val = $(e.target).val();
    if (val.length > 0) {
      const arr = val.split(" ");
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }
      const str2 = arr.join(" ");
      let fdeps;
      $.get("/searchdep", {data: str2},
        function (deps, textStatus, jqXHR) {
          let {_id} = deps[0];
          $.get("/searchci", {data: _id},
            function (cities, textStatus, jqXHR) {
              $.each(cities, function (icit, cit) {
                $.each(deps, function (idepa, depa) {
                  if (depa._id == cit._idDep) {
                    fdeps = {_id: cit._id, name_ci: cit.name_ci, name_dep: depa.name_dep}
                  }
                });
                $(trCi).find("th").text((icit + 1));
                $(trCi).find("td:eq(0)").text(fdeps.name_ci);
                $(trCi).find("td:eq(1)").text(fdeps.name_dep);
                $(trCi).find(".btn-info").data("id", fdeps._id);
                $(trCi).find(".btn-danger").data("id", fdeps._id);
                const clone = $(trCi).clone(true);
                $(tbodyCi).append(clone);
              });
            }
          );
        }
      );
    } else {
    ajaxDataCi();
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