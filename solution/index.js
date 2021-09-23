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
    for (let i = 0 ; i < sectionElement.children.length ; i++){
        if(sectionElement.children[i].tagName.toLowerCase() === type){
            return sectionElement.children[i];
        }
    }
}
//this function gets string of task and id of section add li element with the task string to the start of the ul element of the section
function addTaskToDOM(stringOfTask , sectionId){
    console.log(stringOfTask)
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
        addTaskToDOM(stringOfTask , sectionId)
        addTaskToLocalStorage(sectionIdToString(sectionId) , stringOfTask)
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
    if (list.length > 0){
        let liElement = createElement("li", list[0], ["task"])
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
//this function gets type of task and string of task and remove item from the local storage
function removeTaskFromLocalStorage(taskType , stringOfTask){
    let tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"))
    let tasksOnlyOnOneType = tasksFromLocalStorage[taskType]
    tasksOnlyOnOneType = removeFromList(stringOfTask , tasksOnlyOnOneType)
    tasksFromLocalStorage[taskType] = tasksOnlyOnOneType
    localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage))
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




//running the paqe for programing

buildLocalStorageStructure()
addTasksFromLocalStorageToDOM (JSON.parse(localStorage.tasks))
buttonT=document.getElementById("submit-add-to-do")
buttonI=document.getElementById("submit-add-in-progress")
buttonD=document.getElementById("submit-add-done")
buttonT.addEventListener("click", sectionAddButtonHandler)
buttonI.addEventListener("click", sectionAddButtonHandler)
buttonD.addEventListener("click", sectionAddButtonHandler)
window.addEventListener('keydown', moveSectionHandler) 


