//VARIABLE SECTION//

const sectionToDo = document.getElementById("section-to-do")
const sectionInProgress = document.getElementById("section-in-progress")
const sectionDone = document.getElementById("section-done")
const apiURL="https://json-bins.herokuapp.com/bin/614b2d8a4021ac0e6c080cfc"


//ADD TASKS SECTION//

//This function create new element 
//The element built with children,classes and atrributes that the function get as arguments
function createElement(tagName, children = [], classes = [], attributes = {}) {
    let newElement = document.createElement(tagName);
    newElement.append(...children);
    newElement.classList.add(...classes);
    for ( let key in attributes){
        newElement.setAttribute(key , attributes[key] );
    }
    return newElement;
}
//this function gets section id and type of element and return the first element from this type that exist in the section
function getElementOfSection(type, sectionId){
    const sectionElement = document.getElementById(sectionId)
    for (let i = 0 ; i < sectionElement.children.length ; i++){
        if(sectionElement.children[i].tagName.toLowerCase() === type){
            return sectionElement.children[i];
        }
    }
}
//this function gets string of task and id of section add li element with the task string to the start of the ul element of the section
function addTaskToDOM(stringOfTask , sectionId){
    const ulElementOfSection = getElementOfSection("ul", sectionId)
    const newTaskElement = createElement("li",stringOfTask, ["task"])
    newTaskElement.addEventListener('dblclick' , changeTaskHandler)
    if (ulElementOfSection.children.length === 0){
        ulElementOfSection.append(newTaskElement)
    }else{
        ulElementOfSection.insertBefore(newTaskElement , ulElementOfSection.childNodes[0])
    }
}
//get number and return section id 1-todo 2-inprogress 3-done
function sectionIdFromNumber(num){
    switch(num){
        case 1:
            return "section-to-do"
        case 2: 
            return "section-in-progress"
        case 3: 
            return "section-done"     
    }

}
//get section id and return string of task type
function sectionIdToString(sectionId){
    if(sectionId === sectionToDo.id){
        return "todo" 
    } else if (sectionId === sectionInProgress.id){
        return "in-progress"
    } else{
        return "done"
    }
}   
//this function gets string of task and id of section and make the changes on the DOM and LocalStorage
function addTask(stringOfTask , sectionId){
    if(stringOfTask){
        addTaskToDOM(stringOfTask , sectionId)
        addTaskToLocalStorage(sectionIdToString(sectionId) , stringOfTask)
    }
}
//this function is handler for click on one of the add task buttons
function sectionAddButtonHandler(event){
    const sectionId = event.target.parentElement.id
    const inputNewTask = getElementOfSection("input", sectionId)
    if (inputNewTask.value === ""){
        alert("You are trying to add empty task!")    
    }else{
        addTask(inputNewTask.value , sectionId)
        inputNewTask.value=""
    }
    searchHandler(event)
}
//this function add event listeners to the add buttons that add tasks to the sections
function makeAddButtonsListeners(){
    const buttonTodo=document.getElementById("submit-add-to-do")
    const buttonInprogress=document.getElementById("submit-add-in-progress")
    const buttonDone=document.getElementById("submit-add-done")
    buttonTodo.addEventListener("click", sectionAddButtonHandler)
    buttonInprogress.addEventListener("click", sectionAddButtonHandler)
    buttonDone.addEventListener("click", sectionAddButtonHandler)
}

//LOCAL STORAGE SECTION//

//this function add task to the task storage on the local storage
function addTaskToLocalStorage(taskType , stringOfTask){

    const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"))
    let tasksOnlyOnOneType = tasksFromLocalStorage[taskType]
    tasksOnlyOnOneType.unshift(stringOfTask)
    tasksFromLocalStorage[taskType] = tasksOnlyOnOneType
    localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage))
}
//this function create a tasks storage in the local storage, only if there was no tasks storage in the local storage before
function buildLocalStorageStructure(){
    if(localStorage.tasks === undefined){
        const tasks = {
            "todo": [],
            "in-progress": [],
            "done": []
        }
        localStorage.setItem("tasks" , JSON.stringify(tasks))
    }
}
//this function gets type of task and string of task and remove item from the local storage
function removeTaskFromLocalStorage(taskType , stringOfTask){
    let tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"))
    let tasksOnlyOnOneType = tasksFromLocalStorage[taskType]
    tasksOnlyOnOneType = removeFromList(stringOfTask , tasksOnlyOnOneType)
    tasksFromLocalStorage[taskType] = tasksOnlyOnOneType
    localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage))
}
// this function delete all tasks from the local storage
function deleteAllLocalStorage(){
    const tasks = {
        "todo": [],
        "in-progress": [],
        "done": []
    }
    localStorage.setItem("tasks" , JSON.stringify(tasks))
}

//TASKS MOVEMENT SECTION//

//this functions get Array of string(tasks) and create them on the DOM
function addTasksListToTheDOM(ulElement , list){
    if (list.length > 0){
        let liElement = createElement("li", list[0], ["task"])
        liElement.addEventListener('dblclick' , changeTaskHandler)
        ulElement.append(liElement)
        addTasksListToTheDOM(ulElement , list.slice(1))
    }
    
}
//this function gets tasks object and create the tasks on the DOM
function addTasksFromLocalStorageToDOM (tasks){
    addTasksListToTheDOM(getElementOfSection("ul", "section-to-do") , tasks["todo"])
    addTasksListToTheDOM(getElementOfSection("ul", "section-in-progress") , tasks["in-progress"])
    addTasksListToTheDOM(getElementOfSection("ul", "section-done") , tasks["done"])
}
// this function gets item and list and delete this item from the list(delete only the first apperance of this item)
function removeFromList(item , list){
    if(list.length === 0){
        return []
    }else if(item === list[0]){
        return list.slice(1)
    } else{
        return [list[0]].concat(removeFromList(item , list.slice(1)))
    }

}
//this function gets ul element and string of task and remove li element in the ul that have this content inside
function removeTaskFromDOM(ulElement , stringOfTask){
    for (let i = 0 ; i < ulElement.children.length ; i++){
        const liElement = ulElement.children[i];
        if (liElement.textContent === stringOfTask){
            ulElement.removeChild(liElement)
        }
    }
}
//this function get string of task and  id of section and remove it from the section DOM and local storage
function removeTask(stringOfTask , sectionId){
    removeTaskFromLocalStorage(sectionIdToString(sectionId) , stringOfTask)
    removeTaskFromDOM(getElementOfSection("ul", sectionId), stringOfTask)
}
//this function move task to a new section and remove it from the past section DOM and local storage 
function changeSectionForTask(stringOfTask , pastSectionId , newSectionId ){
    if(pastSectionId !== newSectionId){
        addTask(stringOfTask , newSectionId)
        removeTask(stringOfTask , pastSectionId)
    }
    
}
//this function is the handler function keydown. 
function moveSectionHandler(event){
    if (document.querySelector('li:hover')) {
        if (event.altKey && event.keyCode > 48 && event.keyCode < 52) {
            const stringLi= document.querySelector('li:hover').textContent
            let key = event.keyCode-48
            let sectionId = document.querySelector('li:hover').parentElement.parentElement.id
            if (sectionIdFromNumber(key) !== sectionId){
                changeSectionForTask(stringLi , sectionId , sectionIdFromNumber(key))
          }
        }
    }   
}

//CHANGE TASK SECTION//

//this function gets list of tasks, string of old task, and string of new task and switch in the list the old task by the new task
function changeLocalStorageTask(listOfTasks , oldTask , newTask){
    if(listOfTasks.length === 0){
        return []
    }
    if(listOfTasks[0] === oldTask){
        if(newTask==="" || newTask=== null ){
            return listOfTasks.slice(1)
        }else{
            return [newTask].concat(listOfTasks.slice(1))
        }
    }else {
        return [listOfTasks[0]].concat(changeLocalStorageTask(listOfTasks.slice(1), oldTask ,newTask))
    }

}
//this function is the handler for changing the tasks. 
//this function called when the user click twice on a task.
function changeTaskHandler(event){
    const liElement=event.target
    const oldTask=liElement.textContent
    const taskType = sectionIdToString(liElement.parentElement.parentElement.id)
    liElement.contentEditable="true"
    liElement.addEventListener("blur", function () {
        liElement.contentEditable="false"
        const newTask=liElement.textContent
        if(newTask !== oldTask){
            let tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"))
            let tasksOnlyOnOneType = tasksFromLocalStorage[taskType]
            tasksOnlyOnOneType = changeLocalStorageTask( tasksOnlyOnOneType  , oldTask , newTask)
            tasksFromLocalStorage[taskType] = tasksOnlyOnOneType
            localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage))
            if(newTask === ""){
                liElement.remove()
            }
        }
    })
}

//SEARCH INPUT SECTION//

// this function gets list of strings and return list of all the items that has the combination inside 
function searchForCombination(list , combination){
    if (list.length === 0){
        return []
    }else if(list[0].toLowerCase().indexOf(combination.toLowerCase()) !== -1){
        return [list[0]].concat(searchForCombination(list.slice(1) , combination))
    }else{
        return searchForCombination(list.slice(1) , combination)
    }
}
//this function delete any li element from the DOM 
function deleteAnyliElement(){
    while(document.querySelector("li")){
        let liElement=document.querySelector("li")
        liElement.remove()
    }   
}
//this function is handler for search
//this function runs when the user insert write something in the serch input area
function searchHandler(event){
    const inputForSerch = getElementOfSection("input", "section-search")
    const tasks = {
        "todo": [],
        "in-progress": [],
        "done": []
    }
    deleteAnyliElement()
    tasks["done"] =  searchForCombination(JSON.parse(localStorage.tasks)["done"] , inputForSerch.value)
    tasks["in-progress"] =  searchForCombination(JSON.parse(localStorage.tasks)["in-progress"] , inputForSerch.value)
    tasks["todo"] =  searchForCombination(JSON.parse(localStorage.tasks)["todo"] , inputForSerch.value)
    addTasksFromLocalStorageToDOM (tasks)
}
//this function add event listeners to the search input that the user can search for specific tasks
function makeSearchInputListeners(){
    const searchInput=getElementOfSection("input", "section-search")
    searchInput.addEventListener("click",searchHandler)
    searchInput.addEventListener("keyup",searchHandler)
}
//API SECTION//

//this function is handler for clicking on load button on the page
//the function will ask for a tasks from the API and after that it will change the DOM and the localstorage to the tasks object that exist on the API
async function getTasksFromApi(event){
    const loadingElement = createElement("h3", "LOADING", ["loader"])
    const loadingDiv = createElement("div",[loadingElement] , ["loading-div"])
    document.body.append(loadingDiv)
    let response =await fetch (apiURL,{
        method : "get",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        } })
    loadingElement.remove()
    let resultOfGet= await response.json(); 
    if (response.status < 400 || response.status === 418){
        localStorage.setItem("tasks" , JSON.stringify(resultOfGet.tasks))
        deleteAnyliElement()
        addTasksFromLocalStorageToDOM (JSON.parse(localStorage.tasks))
    }else{
        alert("The Request For Tasks From The API WAS FAILED! \n Try Again")
    }
}
// this function is header for clicking the save button
//the function will send a tasks object from the local storage to the API
async function updateTasksOnApi(event){
    let response = await fetch (apiURL,{
        method : "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }, body: JSON.stringify({tasks : JSON.parse(localStorage.tasks)})})
        console.log(await response.json())
    if (response.status > 400 && response.status !== 418){
        alert ("Saving The Data Failed! \n Try Again")
    }   
}
//this function add event listener to the load and save buttons
function addAPIListeners(){
    const buttonLoad=document.getElementById("load-btn")
    buttonLoad.addEventListener("click",getTasksFromApi)
    const buttonSave=document.getElementById("save-btn")
    buttonSave.addEventListener("click",updateTasksOnApi)
}

//MAIN FUNCTION//

//this is the main function that runs every event listener that the page need
function mainFunction(){
    //this section of the function create the local storge tasks object if it doesnt exist and if it exist the function add any exist tasks to the DOM
    buildLocalStorageStructure()
    addTasksFromLocalStorageToDOM (JSON.parse(localStorage.tasks))
    //this section create listeners to the load and save buttons
    addAPIListeners()
    //this section of the function make the serch input work
    makeSearchInputListeners()
    //this section of the function make the add buttons of the tasks sections work 
    makeAddButtonsListeners()
    //this section make the ability to move tasks with clicking on alt + number(1-3) work
    window.addEventListener('keydown', moveSectionHandler)  
}
mainFunction()

