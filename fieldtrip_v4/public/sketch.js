let words = [];
let buffers = [];
let currentBufferIndex = 0;
let spacing = 15;
let maxWordCount = 30;
let selectMenu; 
 let basket;
let basketWords = [];
let map = {};  
let currentCoord = { x: 0, y: 0 };  

let infoButton;
let showInfoPanel = false;
let infoPanel;

  let somethingChanged = true; 
let infoPanelChanged = true; 


const decoCharOptions = ["*", ".", "·", ":",  "。", "†", "◌", "◊", " ", "  ",'⁺','¸','՞','❀',' ',' '];
//"☆",


const commonWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'];

let commonWordIndex = 0;



//fonts
function preload() {
  bold = loadFont('SpaceMono-Bold.ttf');
  regular = loadFont('SpaceMono-Regular.ttf');

}


function setup() {
// frameRate(1);
  background(255);
  textFont("monospace"); 
  
  let canvas = createCanvas(600, 600);
  
  canvas.parent("canvas-holder");
      infoPanel = createGraphics(400, 300);

  basket = document.getElementById("basket");
 let magic = document.getElementById("magic");


 let saveButton = document.getElementById('saveBasketButton');
  saveButton.addEventListener('click', saveBasket);

  loadBufferAtCoord(currentCoord.x, currentCoord.y);  
  let infoButton = document.getElementById("infoButton");
    infoButton.addEventListener('click', toggleInfoPanel);

  somethingChanged = true; 
  
}

function draw() {
  
// clear();
//  background(255);
// let bufferKey = `${currentCoord.x},${currentCoord.y}`;
//   let buffer = map[bufferKey];
//   if (buffer) {
//     buffer.clear();
//     drawWords(buffer);
//     drawDecoChars(buffer);
//      drawCoordinates(buffer, currentCoord);

    //image(buffer, 0, 0);
  //    if (showinfoPanel) {
  //   image(infoPanel, (width - 400) / 2, (height - 300) / 2); 
  // }
  
  // }

 // drawInfo();
  if (showInfoPanel) {
        image(infoPanel, (width - 400) / 2, (height - 300) / 2);
    } else if (infoPanelChanged) {
        drawInfo(); 
        infoPanelChanged = false;
    }
  
  
  
}


function addNewBuffer() {
  let newBuffer = createGraphics(600, 600);
  newBuffer.textSize(12);
  newBuffer.textFont("monospace"); 
  newBuffer.wordObjects = [];
  newBuffer.decoChars = [];
  buffers.push(newBuffer);
  let bufferIndex = buffers.length;
  loadWords(newBuffer, bufferIndex);
  initializeDecoChars(newBuffer);

  if (bufferIndex > 1) {
    selectMenu.option('Buffer ' + bufferIndex);
  }
}




function loadWords(buffer, bufferIndex) {
  
 

  fetch("https://random-word-api.herokuapp.com/word?number=" + maxWordCount)
    .then(response => response.json())
    .then(fetchedWords => {
     for (let i = 0; i < 5; i++) {
        fetchedWords.push(commonWords[commonWordIndex]);
        commonWordIndex = (commonWordIndex + 1) % commonWords.length; // Cycle through common words
      }
      fetchedWords.forEach(word => {
        let foundSpot = false;
        let attempts = 0;
        let currentX, currentY;
        while (!foundSpot && attempts < 100) {
          currentX = random(buffer.width - 50);
          currentY = random(buffer.height - 10);
          foundSpot = true;
          let wordWidth = buffer.textWidth(word);
          let wordHeight = buffer.textSize();
          for (let obj of buffer.wordObjects) {
            let objWordWidth = buffer.textWidth(obj.word);
            let horizontalSpacing = (wordWidth + objWordWidth) / 2;
            let verticalSpacing = wordHeight;
            if (abs(currentX - obj.x) < horizontalSpacing && abs(currentY - obj.y) < verticalSpacing) {
              foundSpot = false;
              break;
            }
          }
          attempts++;
        }
        if (foundSpot) {
          buffer.wordObjects.push({word: word, x: currentX, y: currentY});
        }
      });
    })
    .catch(error => console.error("Error:", error));
}

function initializeDecoChars(buffer) {
  for (let x = 0; x < buffer.width+10; x += spacing) {
    for (let y = 0; y < buffer.height; y += spacing) {
      buffer.decoChars.push({
        char: random(decoCharOptions),
        x: x,
        y: y,
        visible: true,
      });
    }
  }
}



function drawWords(buffer) {
  buffer.fill(0);
  buffer.wordObjects.forEach(obj => {
    let wordWidth = buffer.textWidth(obj.word);
    let wordHeight = buffer.textSize();

    if (mouseX > obj.x && mouseX < obj.x + wordWidth &&
        mouseY > obj.y - wordHeight && mouseY < obj.y) {
      // buffer.textFont(bold); 
    } else {
      buffer.textFont(regular);
    }
    
    buffer.text(obj.word, obj.x, obj.y);
  });
}

function drawDecoChars(buffer) {
  buffer.noStroke();
  buffer.decoChars.forEach(deco => {
    if (deco.visible) {
      buffer.fill(255);
      let rectX = deco.x - spacing / 2;
      let rectY = deco.y - spacing / 2;
      buffer.rect(rectX, rectY, spacing, spacing);
      buffer.fill("green");
      let charWidth = buffer.textWidth(deco.char);
      let charX = deco.x - charWidth / 2;
      let charY = deco.y + buffer.textSize() / 4;
      buffer.text(deco.char, charX, charY);
    }
  });
}
function mouseMoved() {
     if (showInfoPanel) {
        // If the info panel is showing, do not change anything.
        return;
    }
  let bufferKey = `${currentCoord.x},${currentCoord.y}`;
  let buffer = map[bufferKey];
  if (!buffer) return;

  const erasureSize = 30;
  let changed = false;
  buffer.decoChars.forEach(deco => {
    if (mouseX > deco.x - erasureSize / 2 && mouseX < deco.x + erasureSize / 2 &&
        mouseY > deco.y - erasureSize / 2 && mouseY < deco.y + erasureSize / 2) {
      if (deco.visible) {
        deco.visible = false;
        changed = true;
      }
    }
  });

  if (changed) {
    drawBuffer(buffer);
  }
}



function addWordToBasket(word) {
 let wordDiv = document.createElement("div");
  wordDiv.classList.add("draggable");
  wordDiv.innerText = word;
  wordDiv.style.position = "absolute";
  wordDiv.style.cursor = "move";
  basket.appendChild(wordDiv);
  makeElementDraggable(wordDiv);
  
  
}


function mouseClicked() {
  let bufferKey = `${currentCoord.x},${currentCoord.y}`;
  let buffer = map[bufferKey];
  if (!buffer) return; 
  buffer.wordObjects.forEach(obj => {
    let wordWidth = buffer.textWidth(obj.word);
    let wordHeight = buffer.textSize();
    if (mouseX > obj.x && mouseX < obj.x + wordWidth && mouseY > obj.y - wordHeight && mouseY < obj.y) {
      addWordToBasket(obj.word);
    }
  });
}



function mousePressed() {
  if (mouseY > 600 && mouseY < 800) {
    basketWords.forEach(wordObj => {
      if (mouseX > wordObj.x && mouseX < wordObj.x + textWidth(wordObj.word) &&
          mouseY - 600 > wordObj.y && mouseY - 600 < wordObj.y + textSize()) {
        wordObj.dragging = true;
      }
    });
  }
   if (showInfoPanel) {
    let panelX = (width - 400) / 2;
    let panelY = (height - 300) / 2;
    // Check if mouse click is within 'X' area
    if (mouseX > panelX + 10 && mouseX < panelX + 30 && mouseY > panelY + 10 && mouseY < panelY + 30) {
      toggleInfoPanel();
    }
  }
}

function mouseReleased() {
  basketWords.forEach(wordObj => {
    wordObj.dragging = false;
  });
}

function mouseDragged() {
 
  if (mouseY > 600 && mouseY < 800) {
    basketWords.forEach(wordObj => {
      if (wordObj.dragging) {
        wordObj.x = mouseX;
        wordObj.y = mouseY - 600; 
        updateBasket();
      }
    });
  }
}




function makeElementDraggable(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"; 
    elmnt.style.zIndex = 1000; 

  }

let verbTenses = [
  { tense: RiTa.PRESENT,
  number: RiTa.SINGULAR,
   person: RiTa.FIRST
  },
 { tense: RiTa.PRESENT,
  number: RiTa.SINGULAR,
   person: RiTa.THIRD
  },
    { tense: RiTa.PRESENT,
  number: RiTa.SINGULAR,
  form:RiTa.GERUND
  },
  { tense: RiTa.PAST,
  number: RiTa.SINGULAR,
   person: RiTa.THIRD
  },
];
let verbTensesIndex = 0;

function closeDragElement() {
    const margin = 0;

let elmntRect = elmnt.getBoundingClientRect();
  let magicRect = magic.getBoundingClientRect();
    let containerRect = document.getElementById('container').getBoundingClientRect();


  if (elmntRect.left >= magicRect.left &&
      elmntRect.right <= magicRect.right &&
      elmntRect.top >= magicRect.top &&
      elmntRect.bottom <= magicRect.bottom) {
    
    console.log("word inside magic");

    let currentText = elmnt.innerText;

//     if (RiTa.isNoun(currentText)) {
//       let articlizedText = RiTa.articlize(currentText);
//       elmnt.innerText = articlizedText;
//     } 
     if (RiTa.isVerb(currentText)) {
      let conjugate = RiTa.conjugate(currentText, verbTenses[verbTensesIndex]);
      elmnt.innerText = conjugate;

  verbTensesIndex = (verbTensesIndex + 1) % verbTenses.length;
    }
       }
    if (elmntRect.right < containerRect.left - margin ||
      elmntRect.left > containerRect.right + margin ||
      elmntRect.bottom < containerRect.top - margin ||
      elmntRect.top > containerRect.bottom + margin) {
    // console.log('outside');
    elmnt.remove();
    // console.log("Element deleted");
 
    
  }
  

  document.onmouseup = null;
  document.onmousemove = null;
}

}


function loadBufferAtCoord(x, y) {
  let coordKey = `${x},${y}`;
  if (!map[coordKey]) {
    // Create the buffer only if it doesn't exist
    let newBuffer = createGraphics(600, 600);
    newBuffer.textSize(12);
    newBuffer.textFont("monospace");
    newBuffer.wordObjects = [];
    newBuffer.decoChars = [];
    loadWords(newBuffer);
    initializeDecoChars(newBuffer);
    map[coordKey] = newBuffer;
  }
  // Update current buffer index
  currentBufferIndex = Object.keys(map).indexOf(coordKey);
}


function keyPressed() {
        somethingChanged = true;

  if (keyCode === LEFT_ARROW) {
    currentCoord.y -= 1;
  } else if (keyCode === RIGHT_ARROW) {
    currentCoord.y += 1;
  } else if (keyCode === UP_ARROW) {
    currentCoord.x -= 1;
  } else if (keyCode === DOWN_ARROW) {
    currentCoord.x += 1;
  }
  loadBufferAtCoord(currentCoord.x, currentCoord.y);
  console.log();
}

function drawCoordinates(buffer, coord) {
  buffer.fill(0); 
  buffer.noStroke();
  //buffer.textSize(16); 
  buffer.textFont("monospace"); 
  let coordText = ` (${coord.x}, ${coord.y})`;
  buffer.text(coordText, 10, 20); 
}

function addWordToBuffer(buffer, word, x, y) {
    let wordWidth = buffer.textWidth(word);
  let wordHeight = buffer.textSize();
  buffer.wordObjects.push({word: word, x: x, y: y});
}


function drawInfo() {
  
    infoPanel.clear();
    infoPanel.textFont(regular); 
    infoPanel.fill(255);
    infoPanel.rect(0, 0, 400, 300);
    infoPanel.fill(0);
    infoPanel.textSize(14);
    infoPanel.text("\n Welcome to the forest. Hover with your cursor to remove the foliage. \n Navigate the map using ←↑→↓ keys.\n Click the words to add to basket. \n Drag verbs into 'magic' to change tense.\n Drag words out of the basket to remove. \n Rearrange the words to make a poem.", 20, 50, 360, 250);
    infoPanel.textSize(20);
    infoPanel.textFont("monospace"); 
     infoPanel.text("✕", 10, 30);

    // if (showInfoPanel) {
    //     image(infoPanel, (width - 400) / 2, (height - 300) / 2); 
    // }
}


function toggleInfoPanel() {
    showInfoPanel = !showInfoPanel;
    infoPanelChanged = true;
}


//
// function saveBasket() {
//   let basketDivs = document.querySelectorAll('#basket .draggable');
//   let capturedStateDiv = document.getElementById('capturedState');
//   let basketDiv = document.getElementById('basket');

//   // Clear previous state
//   capturedStateDiv.innerHTML = '';

 
//   capturedStateDiv.style.width = basketDiv.offsetWidth + 'px';
//   capturedStateDiv.style.height = basketDiv.offsetHeight + 'px';

//   basketDivs.forEach(div => {
 
//     let clonedDiv = div.cloneNode(true);
//     clonedDiv.style.position = 'relative';
    
//     // clonedDiv.style.top = 'initial'; 
//     // clonedDiv.style.left = 'initial'; 

    
//     capturedStateDiv.appendChild(clonedDiv);
   
//     // capturedStateDiv.appendChild(document.createElement('br'));
//   });
// }


function saveBasket() {
  let basketItems = {
    words: []
  };
  const basketDivs = document.querySelectorAll('#basket .draggable');

  basketDivs.forEach(div => {
    basketItems.words.push({
      word: div.innerText,
      position: {
        top: div.style.top,
        left: div.style.left
      }
    });
  });

  fetch('/saveBasket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(basketItems),
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}



function drawBuffer(buffer) {
    clear();

  buffer.clear();
  drawWords(buffer);
  drawDecoChars(buffer);
  drawCoordinates(buffer, currentCoord);
  image(buffer, 0, 0);
}