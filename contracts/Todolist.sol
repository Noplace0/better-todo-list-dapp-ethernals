// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Todolist{

    //own data type
    struct Task{
        string task_name;
        bool is_done;
        bool highlighted;
        uint created_time;
    }
    
    mapping (address =>Task[]) private Users;
    function addTask (string calldata _task) external{
        Users[msg.sender].push(Task({
            task_name: _task,
            is_done: false,
            highlighted: false,
            created_time: block.timestamp
        }));
    }


    function getTask (uint _taskIndex) external view returns (Task memory){
        //particular task index
        Task memory task = Users[msg.sender][_taskIndex];
        return task;
    }

    function updateTaskStatus (uint _taskIndex, bool _status) external {
        Users[msg.sender][_taskIndex].is_done = _status;
    }

    function updateTaskHightlight (uint _taskIndex, bool _hightlight) external {
        Users[msg.sender][_taskIndex].highlighted = _hightlight;
    }

    function updateallTaskStatus (bool _status) external {
        uint totaltask = Users[msg.sender].length;
        for(uint i = 0; i < totaltask; i++){
            Users[msg.sender][i].is_done = _status;
        }
    }

    function deleteTask (uint _taskIndex) external {
        delete Users[msg.sender][_taskIndex];
    }

    function deleteallTask () external {
        delete Users[msg.sender];
    }


    function getTaskCount() external view returns (uint){
        return Users[msg.sender].length;
    }

    //returns task name
    function getTaskname(uint _taskIndex) external view returns (string memory){
        Task memory task = Users[msg.sender][_taskIndex];
        return task.task_name;
    }
}