$(document).ready(createTaskList());

// Auto focus on input of add task modal //
$("#add-task-container").on("shown.bs.modal", function () {
	$("#new-task").trigger("focus");
});

async function createTaskList() {
	// Get account from the Ganache EVM //
	try {
		await getAccount();
		// Set contract and set gas //
		contract = new web3.eth.Contract(contractABI, contractAddress);
		try {
			numberOfTask = await contract.methods.getTaskCount().call({ from: web3.eth.defaultAccount });
			
			console.log("Number of Tasks are " + numberOfTask);
			
			if (numberOfTask != 0) {
				
				console.log("Start fetching task ...");
				let taskIterator = 0;
				while (taskIterator < numberOfTask) {
					try {
						let task = await contract.methods.getTask(taskIterator).call({ from: web3.eth.defaultAccount });
						if (task[0] != "") {
							// addTaskToList add this task as children to the ul tag //
							addTaskToList(taskIterator, task[0], task[1], task[2], task[3]);
							
						} else {
							console.log("The index " + taskIterator + " is empty");
						}
					} catch {
						console.log("Failed to get Task " + taskIterator);
					}
					taskIterator++;
				}
				// Update the task count in HTML //
			
				updateTasksStatusCount();
			}
		} catch {
			console.log("Failed to get task count from blockchain");
		}
	} catch {
		console.log("Failed to get the account");
	}
}

async function removeTask(taskIndex) {
	console.log("removeTask(): Remove Task " + taskIndex);
	// Create the selector for the Task //
	let taskSelector = "#" + taskIndex;
	// Make taskIndex to have only task index number
	taskIndex = taskIndex.replace("item-", "");
	try {
		await contract.methods.deleteTask(taskIndex).send({ from: web3.eth.defaultAccount });
		console.log("Remove Task " + taskIndex + " from the blockchain");
		// Remove the task from the HTML //
		$(taskSelector).remove();
		// Update the task count in HTML//
	
		updateTasksStatusCount();
	} catch {
		console.log("Issue occured while removing task item-" + taskIndex);
	}
}

async function changeTaskStatus(id, taskIndex) {
	// Get checkbox element //
	let checkbox = document.getElementById(id);
	console.log("id:" + id);
	// Get the id of the li element //
	let textId = id.replace("-checkbox", "");
	console.log(textId)
	// Get the li element //
	let text = document.getElementById(textId);
	try {
		await contract.methods.updateTaskStatus(taskIndex, checkbox.checked).send({ from: web3.eth.defaultAccount });
		console.log("changeTaskStatus(): Change status of task " + textId + " to " + checkbox.checked);
		if (checkbox.checked) {
			text.classList.add("task-done");
			updateTasksStatusCount();
		} else {
			text.classList.remove("task-done");
			updateTasksStatusCount();
		}
	} catch (error) {
		console.log("Failed to change Status of task " + textId + " in blockchain");
		console.log(error);
	}
}

async function changeTaskHightlighted(id, taskIndex) {
	// Get checkbox element //
	let highlight_checkbox = document.getElementById(id);
	console.log("id:" + id);
	// Get the id of the li element //
	let textId = id.replace("-checkbox-highlight", "");
	console.log(textId)
	// Get the li element //
	let text = document.getElementById(textId);
	try {
		await contract.methods.updateTaskHightlight(taskIndex, highlight_checkbox.checked).send({ from: web3.eth.defaultAccount });
		console.log("changeTaskStatus(): Change status of task " + textId + " to " + highlight_checkbox.checked);
		if (highlight_checkbox.checked) {
			console.log("yes");
			text.classList.add("text-primary");
			//updateTasksStatusCount();
		} else {
			console.log("no")
			text.classList.remove("text-primary");
			//updateTasksStatusCount();
		}
	} catch (error) {
		console.log("Failed to change Highlighted of task " + textId + " in blockchain");
		console.log(error);
	}
}


// Add Task to the chain
async function addTask(name) {
	console.log("Get the number of task from blockchain");
	// Set blank value for text in the addtask modal //
	document.getElementById("new-task").value = "";
	
	contract.methods
		.getTaskCount()
		.call({ from: web3.eth.defaultAccount })
		.then(
			(numberOfTask) => {
				// Add the task to the HTML and update the task count
				
				addTaskToList(numberOfTask, name, false, false, 0);
				updateTasksStatusCount();
			},
			(err) => {
				console.log("Failed to get the number of task in blockchain " + err);
			}
		);
	try {
		
		//await contract.methods.updateTaskStatus(taskIndex, checkbox.checked).send({ from: web3.eth.defaultAccount });
		
		await contract.methods.addTask(name).send({ from: web3.eth.defaultAccount });
		
		console.log("Add task " + name + " to blockchain");
	} catch(err) {
		console.log(err);
		console.log("Failed to add task to EVM");
	}
}


// Add Task in the HTML (no web3 functions)
function addTaskToList(id, name, status, highlighted, created_time) {
	//console.log("addTaskToList(): Add Task " + id + " " + [name, status]);
	/* Get the id of ul element so to be able to
		add children to it
	*/
	let list = document.getElementById("list");
	/* Create a li element and add the class
		required to make look good and
		set the id of it
	*/
	let item = document.createElement("li");
	if(!highlighted){
		item.classList.add("list-group-item", "border-0", "d-flex", "justify-content-between", "align-items-center", "p-3");
	} else {
		item.classList.add("list-group-item", "border-0", "d-flex", "justify-content-between", "align-items-center", "text-primary");
	}
	item.id = "item-" + id;
	// Create a text to add it to the li element//
	let task = document.createTextNode(name);
	/* Create a checkbox and set its id and checked
		value to add it to the li element
	*/
	// Create a text to add time element

	var created_time_local = Date(created_time);
	//console.log(s);
	created_time_local = (created_time_local+ "📃");
	let task_time = document.createTextNode(created_time_local);
	
	var checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("id", "item-" + id + "-checkbox");
	checkbox.checked = status;

	var highlight_checkbox = document.createElement("INPUT");
	highlight_checkbox.setAttribute("type", "checkbox");
	highlight_checkbox.setAttribute("id", "item-" + id + "-checkbox-highlight");
	highlight_checkbox.checked = highlighted;
	/* if status is true then add task-done class to li
		element so that the text gets a linethrough
	*/
	if (status) {
		item.classList.add("task-done");
	}
	// Add the li element to ul element //
	list.appendChild(item);
	/* Set a ondblclick event to able to remove the
	item when double clicked on it */
	item.ondblclick = function () {
		removeTask(item.id);
	};
	// Append the text of task //
	item.appendChild(task_time);

	item.appendChild(task);
	
	// Append the checkbox for task //
	item.appendChild(checkbox);
	item.appendChild(highlight_checkbox);


	// Add onclick to the checkbox //
	checkbox.onclick = function () {
		changeTaskStatus(checkbox.id, id);
	};
	highlight_checkbox.onclick = function () {
		changeTaskHightlighted(highlight_checkbox.id, id);
	};
}

// Update task status doone count in the HTML ( web3 functions)
function updateTasksStatusCount() {
	let list = document.getElementById("list");
	let taskCount = list.childElementCount;

	let taskdonelist = document.getElementsByClassName("task-done");
	let taskdoneCount = taskdonelist.length;

	console.log("updateTasksStatusCount(): The number of task are " + taskCount);
	
	let count = document.getElementById("taskdoneCount");
	count.innerText = "Finished: " + taskdoneCount + "/" + taskCount + " Task😎";
}

async function changeallTaskStatus() {
	try {

		var elms = document.querySelectorAll('input[id^=item-][id$=checkbox]');
		for(let i=0; i<elms.length; i++)
		{	
			let textId = elms[i].id;
			console.log("textid:" + textId);
			let checkbox = document.getElementById(textId);
			checkbox.checked = true;

			textId = textId.replace("-checkbox", "");
			let text = document.getElementById(textId);
			text.classList.add("task-done");
		}
		await contract.methods.updateallTaskStatus(true).send({ from: web3.eth.defaultAccount, 
			gas: '200000',
			
		 // set gas 
		 });
		console.log("changeallTaskStatus()): Change status of all task to done");

		updateTasksStatusCount();
	} catch (error) {
		console.log("Failed to change all Status of task in blockchain");
		console.log(error);
	}
}

async function deleteallTask() {
	try {
		await contract.methods.deleteallTask().send({ from: web3.eth.defaultAccount , gas: '200000'});
		console.log("deleteallTask(): Deleted all task");
		let list = document.getElementById("list");
		console.log(list)
		while (list.hasChildNodes()) {
			list.removeChild(list.firstChild);
		}
		
		updateTasksStatusCount();
	} catch (error) {
		console.log("Failed to delete all task in blockchain");
		console.log(error);
	}
}