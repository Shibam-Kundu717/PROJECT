def task():
  tasks = [] #empty list
  print("---WELCOME TO THE TASK MANAGEMENT APP---")

  total_task = int(input("ENter the number of the task you want:"))
  for i in range(1,total_task+1) :
    task_name = input(f"ENter task {i} = ")
    tasks.append(task_name)

  print(f"Today's tasks are\n {tasks}")  

  while True:
    operation = int(input("1-Add\n2-update\n3-delete\n4-view\n5-exit/stop"))
    if operation == 1:
      add = input("Enter task you want to add = ")
      tasks.append(add)
      print(f"Tasks {add} successfully added to your list")

    elif operation ==2 :
        updateed_val = input("Enter the task name you want to update:")
        if updateed_val in tasks :
          up = input("ENter new task = ")
          ind = tasks.index(updateed_val)
          tasks[ind] = up
          print(f"updated Task {up}")


    elif operation == 3:  
          del_val = input("Which task you want to delete:")

task()