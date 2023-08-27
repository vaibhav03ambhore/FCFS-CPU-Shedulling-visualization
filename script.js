const inputTable = document.getElementById('input-table');
const addRowButton = document.getElementById('add-row');
const generateAnswerButton = document.getElementById('generate-answer');
const answerTableContainer = document.getElementById('answer-table');
const container=document.getElementById('container');


addRowButton.addEventListener('click', () => {
  const newRow = createRow();
  inputTable.appendChild(newRow);
});

inputTable.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-row')) {
    event.target.closest('tr').remove();
  }
});


let paragraphDisplayed = false;
generateAnswerButton.addEventListener('click', () => {
  
  if(!paragraphDisplayed){
    displayPara();
    paragraphDisplayed=true;
  }
  


  const answerData = generateAnswerData();
  const sortedAnswerData = answerData.map((data, index) => ({ ...data, processId: index + 1 }))
                                      .slice().sort((a, b) => a.arrivalTime - b.arrivalTime);
  const answerTable = createAnswerTable(sortedAnswerData);
  displayAnswerTable(answerTable);
});

function displayPara(){
  const para=document.createElement('div');
    para.className="para";
    para.innerHTML=`
      <p><strong>AT</strong> = Arival Time</p>
      <p><strong>BT</strong> = Burst Time</p>
      <p><strong>ST</strong> = Start Time</p>
      <p><strong>ET</strong> = End Time</p>
      <p><strong>WT</strong> = Waiting Time</p>
      <p><strong>TAT</strong> = Turn Around Time</p>
      <p><strong>AWT</strong> = Average Waiting Time</p>
      <p><strong>ATAT</strong> = Average Turn Around Time</p>
    `
    container.appendChild(para);
}
function createRow() {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>P${inputTable.children.length + 1}</td>
    <td><input type="number" class="arrival-time"></td>
    <td><input type="number" class="burst-time"></td>
    <td><button type="button" class="delete-row">Delete</button></td>
  `;
  return newRow;
}

function generateAnswerData() {
  const answerData = [];
  const rows = inputTable.querySelectorAll('tr');
  
  rows.forEach((row) => {
    const arrivalTime = parseInt(row.querySelector('.arrival-time').value);
    const burstTime = parseInt(row.querySelector('.burst-time').value);
    answerData.push({
      arrivalTime,
      burstTime,
    });
  });
  
  return answerData;
}

function calculateAnswerData(answerData) {
  let currentTime = 0;
  const calculatedData = [];
  
  answerData.forEach((data) => {
    const startTime = Math.max(currentTime, data.arrivalTime);
    const endTime = startTime + data.burstTime;
    const waitingTime = startTime - data.arrivalTime;
    const turnaroundTime = endTime - data.arrivalTime;
    currentTime = endTime;
    
    calculatedData.push({
      processId: data.processId,
      startTime,
      endTime,
      waitingTime,
      turnaroundTime,
    });
  });
  
  return calculatedData;
}

function createAnswerTable(answerData) {
  const calculatedData = calculateAnswerData(answerData);
  const sortedAnswerData = answerData.slice().sort((a, b) => a.arrivalTime - b.arrivalTime);

  const table = document.createElement('table');

  const headerRow = document.createElement('tr');
  headerRow.className="bg-aqua";
  headerRow.innerHTML = `
    
    <th>P</th>
    <th>AT</th>
    <th>BT</th>
    <th>ST</th>
    <th>ET</th>
    <th>WT</th>
    <th>TAT</th>
  `;
  table.appendChild(headerRow);

  sortedAnswerData.forEach((data) => {
    const correspondingCalculatedData = calculatedData.find(calcData => calcData.processId === data.processId);
    const tableBody = document.createElement('tbody');
    tableBody.className="bg-bisque";
    table.appendChild(tableBody);
    const row=document.createElement('tr');
    row.innerHTML = `
      <td class="ans-p">P${data.processId}</td>
      <td class="ans-at">${data.arrivalTime}</td>
      <td class="ans-bt">${data.burstTime}</td>
      <td class="ans-st">${correspondingCalculatedData.startTime}</td>
      <td class="ans-et">${correspondingCalculatedData.endTime}</td>
      <td class="ans-wt">${correspondingCalculatedData.waitingTime}</td>
      <td class="ans-tat">${correspondingCalculatedData.turnaroundTime}</td>
    `;
    tableBody.appendChild(row);
  });

  //average WT AND TAT
  const averageWT=calculatedData.reduce((acc,curr)=>acc+curr.waitingTime,0)/calculatedData.length;
  const averageTAT=calculatedData.reduce((acc,curr)=>acc+curr.turnaroundTime,0)/calculatedData.length;

  const lastRow=document.createElement('tr');
  lastRow.className="ans-last-row";
  lastRow.innerHTML=`
  <th></th>
  <th></th>
  <th></th>
  <th></th>
  <th></th>
  <th>AWT =${averageWT}</th>
  <th>ATAT =${averageTAT}</th>
  `
  table.appendChild(lastRow);
  return table;
}

function displayAnswerTable(answerTable) {
  answerTableContainer.innerHTML = ''; 
  answerTableContainer.appendChild(answerTable);
}


