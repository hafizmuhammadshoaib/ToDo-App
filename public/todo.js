//referencing to firebase
var userId = localStorage.getItem("userId");
var ref = firebase.database().ref().child(`Tasks/user/${userId}`);
window.onload = function () {
  initApp();
}
function initApp() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("in user");
      // userId = user.uid;

      document.getElementById("user").innerHTML = `<a>${user.email}</a>`;


      document.getElementById("signOut").innerHTML = `<a id="signOutBtn" class="active " onclick="onSignOut()">Logout</a>`;
    }
    else {
      window.location.replace("./index.html");
    }
  });
}


function onSignOut() {
  firebase.auth().signOut();
  localStorage.removeItem("userId");
}
//call when app is reloaded or loaded firstime
ref.on("value", function (snapshot) {
  console.log("in value");
  var taskArray = snapshot.val();
  try {
    for (let i = 0; i < taskArray.length; i++) {
      console.log("in loop");
      render(taskArray[i]);
    }
  }
  catch (err) {

  }
});



//getting object of add button  
var addButton = document.getElementById("addButton");

//listener of add button
addButton.addEventListener("click", function () {
  var inputText = document.getElementById("taskInput");
  var obj = {
    task: inputText.value
  };
  inputText.value = "";
  ref.push(obj);

});
//onTaskAdded
ref.on("child_added", function (snapshot) {
  render(snapshot);
});





//to display task on screen
function render(data) {
  var obj = {
    taskData: data.val().task,
    taskId: data.key
  }
  var newLiElement = document.createElement("li");
  var spanElement = document.createElement("span");
  var ulElement = document.getElementById("list");

  /*  */
  spanElement.innerHTML = obj.taskData;
  spanElement.setAttribute("class", "spanEle");
  console.log(obj.taskId);
  newLiElement.setAttribute("id", obj.taskId);
  newLiElement.setAttribute("class", "taskInsert");
  let delBtn = document.createElement("input");
  let updateBtn = document.createElement("input");
  updateBtn.setAttribute("type", "submit");
  updateBtn.setAttribute("value", "update");
  updateBtn.setAttribute("class", "update btn btn-default");
  updateBtn.setAttribute("onclick", "updateTask(this)");
  delBtn.setAttribute("type", "submit");
  delBtn.setAttribute("value", "delete");
  delBtn.setAttribute("class", "delete btn btn-danger");
  delBtn.setAttribute("onclick", "deleteTask(this)");
  newLiElement.appendChild(updateBtn);
  newLiElement.appendChild(delBtn);
  newLiElement.appendChild(spanElement);

  ulElement.appendChild(newLiElement);
}


//shows the pormpt and update the data
function updateTask(element) {
  var text = prompt(
    "update task",
    element.parentElement.children.item(2).innerHTML
  );
  var obj = {
    task: text
  }
  console.log(element.parentElement.id);
  ref.child(element.parentElement.id).update(obj);



}
// get updated data from firebase
ref.on("child_changed", function (snapshot) {
  var ele = document.getElementById(snapshot.key);
  ele.children.item(2).innerHTML = snapshot.val().task;
});
//function to delete task
function deleteTask(element) {
  ref.child(element.parentElement.id).remove();

}
// get deleted child id from firebase
ref.on("child_removed", function (snapshot) {
  var ele = document.getElementById(snapshot.key);
  ele.remove();
});
