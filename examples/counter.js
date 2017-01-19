/**
 * Created by thram on 19/01/17.
 */
var $clickArea   = document.getElementById('click-area'),
    $decrease    = document.getElementById('decrease'),
    $reset       = document.getElementById('reset'),
    $clickResult = document.getElementById('click-result');

function increase(payload, state) {
  return (state || 0) + 1;
}
function decrease(payload, state) {
  return (state > 0) ? state - 1 : 0;
}
function reset(payload, state) {
  return 0;
}

thrux.register({
  counter: {
    INCREASE: thrux.createDict(increase),
    DECREASE: thrux.createDict(decrease),
    RESET   : thrux.createDict(reset)
  }
});

thrux.observe('counter', function (state) {
  $clickResult.innerText = state;
});

$clickArea.addEventListener('click', function () {
  thrux.dispatch('counter:INCREASE');
});

$decrease.addEventListener('click', function () {
  thrux.dispatch('counter:DECREASE');
});

$reset.addEventListener('click', function () {
  thrux.dispatch('counter:RESET');
});