const inputTodo = document.querySelector(".input")
const createTodoBtn = document.querySelector('.createBtn')

const activeRadio = document.querySelector('.activeRadio')
const finishedRadio = document.querySelector(".finishedRadio")
const onHoldRadio = document.querySelector(".onHoldRadio")
const canceledRadio = document.querySelector(".canceledRadio")

const activeDiv = document.querySelector('.active')
const finishedDiv = document.querySelector('.finished')
const onHoldDiv = document.querySelector('.onHold')
const canceledDiv = document.querySelector('.canceled')

let inputEdit = document.createElement('input')
const loader = document.querySelector(".loaderBg")

let todoArray = []

const URL = "https://youthful-juicy-hope.glitch.me/todos"

async function get_Todos() {
    try {
        const resp = await fetch(URL)
        const data = await resp.json()
        return data
    } catch (err) {
        return err;
    }
}

let selectedRadio = () => {
    let selected = document.querySelector("input[name = 'status']:checked").value

    return selected
}

async function loaderF() {
    loader.classList.remove('loader-hidden')
    location.reload()
    loader.classList.add('loader-hidden')
}

function display_Todos(todoArr) {

    for (let i = 0; i < todoArray.length; i++) {
        if (todoArr[i].status == 'active') {
            let createDelBtn = document.createElement('button')
            createDelBtn.classList.add('closeTodoBtn')
            createDelBtn.textContent = 'x'

            let createTodo = document.createElement('div')
            createTodo.classList.add('todo')
            createTodo.innerText += todoArr[i].name
            createTodo.setAttribute("data-todoId", todoArr[i].id)
            createTodo.append(createDelBtn)
            activeDiv.append(createTodo)

            createDelBtn.addEventListener("click", (e) => {
                e.stopPropagation()
                loaderF()
                del_Todo(todoArr[i])
            })
            createTodo.addEventListener("dblclick", () => {

                createTodo.append(inputEdit)
                inputEdit.style.display = "block"
                inputEdit.classList.add("editInput")

                inputEdit.addEventListener("keydown", (e) => {
                    if (e.keyCode == '13') {
                        edit_Todo(todoArr[i])
                        createTodo.innerHTML = inputEdit.value
                        createTodo.append(createDelBtn)
                        inputEdit.style.display = "none"
                        loaderF()
                    }
                })

            })


        }
        else if (todoArr[i].status == 'finished') {
            let createTodo = document.createElement('div')
            createTodo.setAttribute("data-todoId", todoArr[i].id)
            createTodo.classList.add('todo')
            createTodo.innerText += todoArr[i].name

            let createDelBtn = document.createElement('button')
            createDelBtn.classList.add('closeTodoBtn')
            createDelBtn.textContent = 'x'
            createTodo.append(createDelBtn)
            finishedDiv.append(createTodo)
            createDelBtn.addEventListener("click", (e) => {
                e.stopPropagation()
                loaderF()
                del_Todo(todoArr[i])
            })

            createTodo.addEventListener("dblclick", () => {

                createTodo.append(inputEdit)
                inputEdit.style.display = "block"
                inputEdit.classList.add("editInput")

                inputEdit.addEventListener("keydown", (e) => {
                    if (e.keyCode == '13') {
                        edit_Todo(todoArr[i])
                        createTodo.innerHTML = inputEdit.value
                        createTodo.append(createDelBtn)
                        inputEdit.style.display = "none"
                        loaderF()
                    }
                })

            })


        }
        else if (todoArr[i].status == 'onHold') {
            let createTodo = document.createElement('div')

            createTodo.classList.add('todo')
            createTodo.innerText += todoArr[i].name
            createTodo.setAttribute("data-todoId", todoArr[i].id)
            let createDelBtn = document.createElement('button')
            createDelBtn.classList.add('closeTodoBtn')
            createDelBtn.textContent = 'x'
            createTodo.append(createDelBtn)
            onHoldDiv.append(createTodo)

            createDelBtn.addEventListener("click", (e) => {
                e.stopPropagation()
                loaderF()
                del_Todo(todoArr[i])
            })

            createTodo.addEventListener("dblclick", () => {

                createTodo.append(inputEdit)
                inputEdit.style.display = "block"
                inputEdit.classList.add("editInput")

                inputEdit.addEventListener("keydown", (e) => {
                    if (e.keyCode == '13') {
                        edit_Todo(todoArr[i])
                        createTodo.innerHTML = inputEdit.value
                        createTodo.append(createDelBtn)
                        inputEdit.style.display = "none"
                        loaderF()
                    }
                })

            })

        }
        else if (todoArr[i].status == 'canceled') {
            let createTodo = document.createElement('div')
            createTodo.setAttribute("data-todoId", todoArr[i].id)
            createTodo.classList.add('todo')
            createTodo.innerText += todoArr[i].name

            let createDelBtn = document.createElement('button')
            createDelBtn.classList.add('closeTodoBtn')
            createDelBtn.textContent = 'x'
            createTodo.append(createDelBtn)
            canceledDiv.append(createTodo)

            createDelBtn.addEventListener("click", (e) => {
                e.stopPropagation()
                del_Todo(todoArr[i])
                loaderF()
            })

            createTodo.addEventListener("dblclick", () => {

                createTodo.append(inputEdit)
                inputEdit.style.display = "block"
                inputEdit.classList.add("editInput")

                inputEdit.addEventListener("keydown", (e) => {
                    if (e.keyCode == '13') {
                        edit_Todo(todoArr[i])
                        createTodo.innerHTML = inputEdit.value
                        createTodo.append(createDelBtn)
                        inputEdit.style.display = "none"
                        loaderF()
                    }
                })

            })


        }
        $(function () {
            $(".todos").sortable({
                connectWith: ".todos",
                items: ".todo",
                stop: async function (container, data) {
                    const todoId = data.item[0].dataset.todoid
                    console.log(todoId)
                    const status = container.toElement.parentNode.dataset.status
                    console.log(status)
                    if (todoArr.some(todo => todo.id === todoId && todo.status === status)) {
                        return
                    }
                    // loaderF()
                    todoArr.find(todo => todo.id === todoId).status = status
                    await axios.put(`http://localhost:3000/todos/${todoId}`, {
                        status: status,
                        name: data.item[0].innerText.slice(0, - 2)
                    })
                    // loaderF()
                    // 
                },
            }).disableSelection();
        });

    }


}



async function del_Todo(todoElem) {
    try {
        const del_url = URL + "/" + todoElem.id
        console.log(todoElem.id)
        let options = {
            method: "DELETE",
        }
        const resp = await fetch(del_url, options)
        const data = await resp.json()
        console.log(data)
    } catch (err) {
        return err
    }
}

async function edit_Todo(todoElem) {
    try {
        let edit_url = URL + "/" + todoElem.id
        let options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: todoElem.id,
                name: inputEdit.value,
                status: todoElem.status
            }),
        };
        const resp = await fetch(edit_url, options)
        const data = await resp.json()
        return data
    } catch (err) {
        return err
    }
}



async function post_todos() {
    try {
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: inputTodo.value,
                status: selectedRadio()
            }),
        }
        const resp = await fetch(URL, options)
        const data = await resp.json()
        return data
    } catch (err) {
        return err
    }
}


get_Todos()
    .then((todoArr) => {
        todoArray = todoArr
        console.log(todoArr)
        display_Todos(todoArr)
        loaderF()
    })
    .catch((err) => console.log(err))

createTodoBtn.addEventListener("click", (event) => {
    event.preventDefault()
    loaderF()
    if (inputTodo.value != '') {
        post_todos()
    }
})