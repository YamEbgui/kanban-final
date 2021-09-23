//variables section 

const sectionToDo = document.getElementById("section-to-do")
const sectionInProgress = document.getElementById("section-in-progress")
const sectionDone = document.getElementById("section-done")


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
    console.log(sectionElement)
    console.log(sectionElement.children)
    for (let i = 0 ; i < sectionElement.children.length ; i++){
        if(sectionElement.children[i].tagName.toLowerCase() === type){
            return sectionElement.children[i];
        }
    }
}
//this function gets string of task and id of section add li element with the task string to the start of the ul element of the section
function addTaskToHTML(stringOfTask , sectionId){
    const ulElementOfSection = getElementOfSection("ul", sectionId)
    const newTaskElement = createElement("li",stringOfTask, ["task"])
    if (ulElementOfSection.children.length === 0){
        ulElementOfSection.append(newTaskElement)
    }else{
        ulElementOfSection.insertBefore(newTaskElement , ulElementOfSection.childNodes[0])
    }
}
//this function add task to the task storage on the local storage
function addTaskToLocalStorage(taskType , stringOfTask){
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"))
    const tasksOnlyOnOneType = tasksFromLocalStorage[taskType]
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
//this function gets string of task and id of section and make the changes on the DOM and LocalStorage
function addTask(stringOfTask , sectionId){
    if(sectionId === sectionToDo.id){
        addTaskToHTML(stringOfTask , sectionId)
        addTaskToLocalStorage("todo" , stringOfTask)
    } else if (sectionId === sectionInProgress.id){
        addTaskToHTML(stringOfTask , sectionId)
        addTaskToLocalStorage("in-progress" , stringOfTask)
    } else{
        addTaskToHTML(stringOfTask , sectionId)
        addTaskToLocalStorage("done" , stringOfTask)
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
}
//this functions get Array of string(tasks) and create them on the DOM
function addTasksListToTheDOM(ulElement , list){
    console.log(list)
    if (list.length > 0){
        ulElement.append(createElement("li", list[0], ["task"]))
        addTasksListToTheDOM(ulElement , list.slice(1))
    }
    
}
//this function gets tasks object and create the tasks on the DOM
function addTasksFromLocalStorageToDOM (tasks){
    addTasksListToTheDOM(getElementOfSection("ul", "section-to-do") , tasks["todo"])
    addTasksListToTheDOM(getElementOfSection("ul", "section-in-progress") , tasks["in-progress"])
    addTasksListToTheDOM(getElementOfSection("ul", "section-done") , tasks["done"])
}



//running the paqe for programing

buildLocalStorageStructure()
addTasksFromLocalStorageToDOM (JSON.parse(localStorage.tasks))
buttonT=document.getElementById("submit-add-to-do")
buttonI=document.getElementById("submit-add-in-progress")
buttonD=document.getElementById("submit-add-done")
buttonT.addEventListener("click", sectionAddButtonHandler)
buttonI.addEventListener("click", sectionAddButtonHandler)
buttonD.addEventListener("click", sectionAddButtonHandler)
