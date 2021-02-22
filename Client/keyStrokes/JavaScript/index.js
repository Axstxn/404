var displays = [];
var keyholder = document.getElementById('keyHolder');

class cpsCounter {
  constructor (x, y) {
    
  }
}

class Display {
  constructor (obj) {
    this.key = obj.key.toLowerCase();
    this.elem = document.createElement('div');
    this.elem.classList.add('key-display');
    this.elem.classList.add(obj.key.toLowerCase());
    
    this.elem.insertAdjacentHTML('beforeend', `<h2>${obj.display ? obj.display.toUpperCase() : obj.key.toUpperCase()}</h2>`)
    
    this.elem.style.left = obj.x;
    this.elem.style.top = obj.y;
    
    this.elem.style.width = obj.width;
    this.elem.style.height = obj.height;
    
    keyholder.appendChild(this.elem);
  }
  down () {
    this.elem.classList.add('active')
  }
  up () {
    this.elem.classList.remove('active')
  }
}

function addKey (key, x, y, disp) {
  var display = new Display(key, x, y, disp);
  displays.push(display);
}

document.addEventListener('keydown', e => {
  for (let i in displays) {
    let display = displays[i];
     if (display.key == e.key) display.down();
   }
})

document.addEventListener('keyup', e => {
  for (let i in displays) {
    let display = displays[i];
     if (display.key == e.key) display.up();
   }
})

document.addEventListener('mousedown', e => {
  switch (e.which) {
    case 1:
      for (let i in displays) {
        let display = displays[i];
        if (display.key == 'left') display.down();
      }
      break;
    case 3:
      for (let i in displays) {
        let display = displays[i];
        if (display.key == 'right') display.down()
      }
      break;
  }
})

document.addEventListener('mouseup', e => {
  switch (e.which) {
    case 1:
      for (let i in displays) {
        let display = displays[i];
        if (display.key == 'left') display.up();
      }
      break;
    case 3:
      for (let i in displays) {
        let display = displays[i];
        if (display.key == 'right') display.up()
      }
      break;
  }
})

addKey({ key: 'w', x: 120, y :35 });
addKey({ key: 'a', x: 30, y: 115 });
addKey({ key: 's', x: 120, y: 115});
addKey({ key: 'd', x: 210, y: 115});
addKey({ key: 'left', display: 'l', x: 30, y: 195, width: 100});
addKey({ key: 'right', display: 'r', x: 165, y: 195, width: 100});
