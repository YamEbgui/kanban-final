# Cyber4s 3rd Pre-Course Final Project

## What I Done In This Project 

Welcome to my pre-course final project. In this project, I built a webpage for task manager. 
To make this webpage I used Javascript, CSS, and HTML languages. 
- [ ] URL of the page : https://yamebgui.github.io/kanban-final/solution/

![Page Interface](./screenshot.png)

### Page Structure

There are 3 sections of tasks on my page: tasks to do, tasks in progress, and done tasks. 
In each tasks section, there is a button and text area to insert new tasks. 
Also, there is a text area above the sections of the tasks that is used to search combinations of chars in the tasks.
In addition, I add two buttons to the upper section of the page that can load and save tasks from the API 

[I will detail later how things happen on the page]

### Add Task 
- [ ] This is how a tasks section looks like when it is empty
![example1](./example1.png)
- [ ] To add a task, the user needs to click on the text area and type a task
![example2](./example2.png)
- [ ] When the user clicks on the Add button the page add the task to the tasks section
![example3](./example3.png)

### Move Task Between Sections 
- [ ] If the user wants to move a task from section to other section he can do it by hover on a task and click two buttons: alt + number that represents the section the user wants the task move to. 
 ![example4](./example4.png)
 ![example5](./example5.png)
 
### Search Combination On The Tasks
- [ ] If the user wants to search for a combination in the tasks he can type on the search text area what he wants to search. here is an example: 
 ![example6](./example6.png)
 ![example7](./example7.png)

### Double Click On A Task To Change It
- [ ] The user also can change the task if he wants. 
- [ ] To do this he needs to double click on the task and change it and when he is done click on the page but not on the same task.
 ![example8](./example8.png)
 ![example9](./example9.png)
 ![example10](./example10.png)

 
### API 
- [ ] The user can save the tasks he inserts on the API and also load what is stored on the API with the save and load buttons
- [ ] The save button send a  PUT request to the API that change the API data. 
- [ ] The load button send a GET request to the API asks for the API data and change the local storage to be the same as this data

### Storage

- [ ] The data of all the tasks  saved to `localStorage` following any changes made to the data. The data  saved under a storage key named `tasks`. It saved in the following format :

```json
{
  "todo": [],
  "in-progress": [],
  "done": []
}
```

- [ ] Even if there are no tasks, there still a `tasks` key in the `localStorage`, in the above format (the arrays will just be empty).








