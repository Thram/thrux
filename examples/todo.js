/**
 * Created by thram on 19/01/17.
 */
/**
 * Created by thram on 19/01/17.
 */
var $input   = document.getElementById('new-todo'),
    $clear   = document.getElementById('clear'),
    $doneAll = document.getElementById('done-all'),
    $list    = document.getElementById('todos');

function appendTaskItem(todo) {
  var $li       = document.createElement('li');
  $li.innerHTML = '<span class="task ' + (todo.done ? 'done' : '') + '">' + todo.task + '</span><span class="remove">X</span>';
  var $task     = $li.querySelector('.task'),
      $remove   = $li.querySelector('.remove');

  $task.addEventListener('click', function () {
    thrux.dispatch('todos:DONE', todo.task)
  });

  $remove.addEventListener('click', function () {
    thrux.dispatch('todos:REMOVE', todo.task)
  });
  $list.appendChild($li);
}

function getIndex(state, task) {
  return state.map(function (todo) {
    return todo.task;
  }).indexOf(task);
}

function add(task, state) {
  return [].concat(state || [], [{task, done: false}]);
}
function remove(task, state) {
  if (state && state.length > 0) {
    console.log(task, state)
    var pos = getIndex(state, task);
    state.splice(pos, 1);
    return state;
  }
}

function done(task, state) {
  if (state && state.length > 0) {
    var pos         = getIndex(state, task);
    state[pos].done = !state[pos].done;
    return state;
  }
}

function doneAll(task, state) {
  if (state && state.length > 0) {
    state.forEach(function (todo) {
      todo.done = true;
    });
    return state;
  }
}
function clear() {
  return [];
}

thrux.register({
  todos: {
    ADD     : thrux.createDict(add),
    REMOVE  : thrux.createDict(remove),
    DONE    : thrux.createDict(done),
    DONE_ALL: thrux.createDict(doneAll),
    CLEAR   : thrux.createDict(clear)
  }
});


thrux.observe('todos', function (state) {
  console.log(state);
  $list.innerHTML = '';
  state.forEach(appendTaskItem);
});

$input.addEventListener('keyup', function (ev) {
  var keycode = (ev.keyCode ? ev.keyCode : ev.which);
  if (keycode == 13) {
    this.value && thrux.dispatch('todos:ADD', this.value);
    this.value = '';
  }
});

$clear.addEventListener('click', function () {
  thrux.dispatch('todos:CLEAR');
});

$doneAll.addEventListener('click', function () {
  thrux.dispatch('todos:DONE_ALL');
});