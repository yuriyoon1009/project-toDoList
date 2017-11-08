/* eslint-disable */
(function (ax) {
  
  var $x = ax.create({
    baseURL: 'https://todolist-yuriyoon1009.firebaseio.com/todos'
  });

  let todos;
  let status = 'all';
  const inputTodo = document.getElementById('input-todo');
  const todoList = document.getElementById('todo-list');
  
  const completedTodos = document.getElementById('completedTodos');
  const leftTodos = document.getElementById('leftTodos');

  const filterByStatus = function () {
    return todos.filter(({completed}) => {
      switch(status){
        case 'active': return !completed;
        case 'completed' : return completed;
        default: return true;
      }
    })
  };

  /*
  REST - 네트워크 상에서 클라이언트와 서버 사이의 통신 방식이다.
    POST UPDATE 
    GET READ
    PUT CREATE
    DELETE DELETE
  */

  const toggleTodoComplete = function (checked) {
    // Arrow function은 익명 함수로 사용 가능 
    // todos = todos.map(({id, content}) => {return ({id, content, completed:checked}) });
    todos = todos.map(({id, content}) => ({id, content, completed:checked}) );
    render();
    console.log('[ALL-COMPLETED]\n', todos);
  }

  const removeCompletedTodos = function () {
    todos = todos.filter(({completed}) => {
      return !completed;
    });
    render();
    console.log('[REMOVE CM-TODOS]\n', todos);
  }

  const countCompletedTodos = function () {
    return (todos.filter(({completed})=> completed)).length;
  }

  // console.log(countCompletedTodos())

  const countLeftTodos = function () {
    return (todos.filter(({completed})=> !completed)).length;
  }
  
  const render = function () {
    let html = '';

    const _todos = filterByStatus();

    _todos.forEach(({ id, content, completed }) => {
      const checked = completed ? ' checked' : '';

      html += `<li class="list-group-item"> 
        <div class="hover-anchor">
          <a class="hover-action text-muted">
            <span class="glyphicon glyphicon-remove-circle pull-right" data-id="${id}"></span>
          </a>
          <label class="i-checks" for="${id}">
            <input type="checkbox" id="${id}"${checked}><i></i>
            <span>${content}</span>
          </label>
        </div>
      </li >`;
    });

    todoList.innerHTML = html;
    
    // length
    completedTodos.innerHTML = countCompletedTodos();
    leftTodos.innerHTML = countLeftTodos();
  };

  const getTodos = function () {
    /*todos = [
      { id: 3, content: 'HTML', completed: false },
      { id: 2, content: 'CSS', completed: true },
      { id: 1, content: 'JavaScript', completed: false }
    ];*/

    render();
    console.log('[GET]\n', todos);
  };

  const lastTodoId = function () {
    // let MaxNum = Math.max.apply(null, todos.map(todo => todo.id)) + 1;
    return todos ? Math.max(...todos.map(({ id }) => id)) + 1 : 1;
  };

  const addTodo = function () {
    const content = inputTodo.value;
    inputTodo.value = '';
    const temp = {id:lastTodoId(), content, completed: false}
    $x.put(`/${todos.length}.json`, temp)
    .then(res=>{
      todos.push(temp);
      render();
      console.log(res);
    })
    .catch(err=>console.log(err));

    render();
    console.log('[ADD]\n', todos);
  };

  /*const toggleTodoComplete = function (id) {
    todos = todos.map(todo => (
      todo.id === (+id) ? Object.assign({}, todo, { completed: !todo.completed }) : todo
    ));
    render();
    console.log('[TOGGLE-COMP]\n', todos);
  };*/

  const removeTodo = function (id) {
    todos = todos.filter(todo => todo.id !== (+id));
    render();
    console.log('[REMOVE]\n', todos);
  };

  inputTodo.addEventListener('keyup', (e) => {
    if (e.keyCode !== 13 || inputTodo.value.trim() === '') {
      return;
    }
    addTodo();
  });

  window.addEventListener('load', () => {
    $x.get('.json')
    .then((res)=>{
      console.log(res);
      todos = res.data;
      render();
    })
    .catch((err)=>{
      console.log(err);
    });

    //getTodos();
  });

  todoList.addEventListener('change', (e) => {
    toggleTodoComplete(e.target.id);
  });

  todoList.addEventListener('click', ({ target }) => {
    if (!target || target.nodeName !== 'SPAN' || target.parentNode.nodeName === 'LABEL') {
      return;
    }
    removeTodo(target.dataset.id);
  });

  document.querySelector('.nav').addEventListener('click', (e) => { 
      if(!e.target || e.target.nodeName !== 'A') return;
      // 1.
      // const ul_nave = e.currentTarget
      // 개행 문자가 들어감 ul_nav.childrenNodes
      // ul_nav.children은 유사배열객체이다.
      // forEach를 쓸 수 없음. apply 를 쓸 수 잇음.
      const lis = e.currentTarget.children;
      //[li,li,li]
      //disturcting
      [...lis].forEach((el)=>{
        el.classList.remove('active');
      });

      const targetLi = e.target.parentNode;
      targetLi.classList.add('active');
      // 2.
      //getAttribute('id') 쓸 필요 없음.
      status = targetLi.id;
      render();
  });

  //All-check
  document.getElementById('chk-allComplete').addEventListener('change',(e)=>{
    toggleTodoComplete(e.target.checked); //true
  })

  //RM completed
  document.getElementById('btn-removeCompletedTodos').addEventListener('click',(e)=>{
    removeCompletedTodos();
  });

}(axios));
