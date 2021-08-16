//TOTALMONTHLYPAYMENT DOES NOT WORK AND IS COMING NBACK AS UNDEFINED

const dollarFormat = Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})

//Controller function
function controller(){
    let homePrice = parseInt(document.getElementById('homePriceInput').value)
    let homeDownPayment = parseInt(document.getElementById('homeDownPaymentInput').value)
    let loanType = parseInt(document.getElementById('loanTypeInput').value)
    let interestRate = parseFloat(document.getElementById('interestRateInput').value)
    let homeOwnersInsurance = parseInt(document.getElementById("homeownerInsurance").value);
    let propertyTax = parseInt(document.getElementById("propertyTax").value);
    let hoaFees = parseInt(document.getElementById("hoaFees").value);
 
    let info = monthlyPayment(homePrice, homeDownPayment, loanType, interestRate, homeOwnersInsurance, propertyTax, hoaFees)
    displayDonutChart(info, homeOwnersInsurance, propertyTax, hoaFees)

    addToLS(info, homePrice, homeDownPayment, loanType, interestRate, homeOwnersInsurance, propertyTax, hoaFees)
}

//Calc function
function homePriceValue(){
    let homePriceLabel = document.getElementById('homePriceLabel');
    let homePrice = parseInt(document.getElementById('homePriceInput').value)
    homePriceLabel.innerHTML = ` Home Price ${dollarFormat.format(homePrice)}`
}

//Calc function
function monthlyPayment(homePrice, homeDownPayment, loanType, interestRate, homeOwnersInsurance, propertyTax, hoaFees){
    let info = [];

    if(homeDownPayment == undefined || homeDownPayment == NaN){
        homeDownPayment = 0
    }

    let loanAmount = homePrice - homeDownPayment; //loan amount the user needs, the different between the cost of home and their downpayment on home
    let fixedInterestRate  = interestRate / 1200 //Gets interest rate which is found by dividing the whole number by 100 and then again by 12 which is why I just divide by 1200
    let monthsOnLoan = loanType * 12; //n represents Number of months on loan 

    let monthlyMortgagePayment = loanAmount * ((fixedInterestRate * Math.pow((1 + fixedInterestRate), monthsOnLoan)) / (Math.pow((1 + fixedInterestRate), monthsOnLoan) - 1)); //This number only accounts for principal and interest on payment
    let totalMonthlyPayment = monthlyMortgagePayment + homeOwnersInsurance + propertyTax + hoaFees //This number takes into account the standard monthly mortgagePayment as well as home owners insurance, property tax, and home owner assocation fees.
    info.push(monthlyMortgagePayment, totalMonthlyPayment)
     return info
}

//view function
function displayDonutChart(info, homeOwnersInsurance, propertyTax, hoaFees){
    let chartHolder = document.getElementById('chartHolder'); //Lines 47-48 are used to reset the chart, as we can only have 1 chart at a time on a canvas the canvas needs to be reset and the best way to go about that is to change the innerHTML of the div that holds the canvas itself/
    chartHolder.innerHTML = "<canvas id='myChart'></canvas>"
    let myChart1 = document.querySelector('#myChart').getContext('2d') //we get the chart canvas that we created in html and we use 'getContext because we are creating 2 dimensional charts, nothing 3D. 

    let labels1 = ['Principal & Interest', "Homeowner's Insurance", "Property Tax", "HOA fees"];
    let colors1 = ['rgb(126,228,126)', 'red', 'blue', 'yellow'];
    let data1 = [info[0], homeOwnersInsurance, propertyTax, hoaFees];

 
 

     chart1 = new Chart(myChart1, { //we are creating a new chart which is a doughnut chart
        type: 'doughnut', 
        data: {
            labels: labels1, //labels is the labels1 array
            datasets: [{
                data: data1, //data is the data1 array
                backgroundColor: colors1,
                borderColor: 'white'
            }]
        },
        options: {
            layout:{
                padding:{
                    right: 0, left: 0, bottom: 0, top: 0,
                }
            },
            responsive: true, //responsive graph
            plugins:{
                legend:{
                    font:{
                        size: 15 //make font of legend smaller
                    },
                    labels:{ 
                        font:{
                            size: 15 //make font of labels smaller
                        }
                    }
                },
                title:{
                    text: `Total Monthly Payment ${dollarFormat.format(info[1])}`, //Display tthe title
                    display: true,
                    font:{
                        size:30
                    }
                },
            }
        }
    })
}

function addToLS(info, homePrice, homeDownPayment, loanType, interestRate, homeownersInsurance, propertyTax, hoaFees){ //The addToLS function takes in the totalMonthlyPayment as well as all of the information provided by the user
    info.shift();
    info.push(homePrice);
    info.push(homeDownPayment);
    info.push(loanType);
    info.push(interestRate);
    info.push(homeownersInsurance);
    info.push(propertyTax);
    info.push(hoaFees);
    let new_data = info;
 
    if(localStorage.getItem('estimateHistory') == null){ //Easy way to create an empty array inside of localStorage
        localStorage.setItem('estimateHistory', '[]');
    }

    //Lines 115-117 Get the previous data from inside LS then combined it with new data and then push back the combined data set
    let old_data = JSON.parse(localStorage.getItem('estimateHistory')) 
    old_data.push(new_data);
    localStorage.setItem('estimateHistory', JSON.stringify(old_data))

    let displayData = JSON.parse(localStorage.getItem('estimateHistory')) //A nested array of estimates generated by the user stored inside of localStorage
    let tableBody = document.getElementById('results')
    let templateRow = document.getElementById('fbTemplate')
    let tableRow = document.importNode(templateRow.content, true) //Make it so we have access to the fbTemplate and can edit the information inside
    let rowCols = tableRow.querySelectorAll('td') //Access all of the td elements inside of the fbTemplate
    populateTable(displayData, tableBody, templateRow, tableRow, rowCols)
  }

function populateTable(displayData, tblBody, tempRow, tblRow, rowCols){ //I made a seperate function called populateTable because I use the same code multiple times. 
    //Lines 129-134 are just accessing the nested infromation inside of displayData which is a nested array with estimate history generated by the user. This seperates the data into 1 array called seperatedData
    let seperatedData = [];
    for(let i = 0; i < displayData.length; i++){
        for(let j = 0; j < displayData[i].length; j++){
            seperatedData.push(displayData[i][j])
        }
    }
    
    tblBody = document.getElementById('results') //Gets the table body
    tempRow = document.getElementById('fbTemplate') //gets the template defined outside of the body
    tblBody.innerHTML='';
    for(let i = 0; i < seperatedData.length; i+=8){ //Using this for loop I am able to assign the data to its cells, using +=8 I am able to populate an entire row and then go right to the next row.
         tblRow = document.importNode(tempRow.content, true) //Import contents of fbTemplate as document fragment. Template never changes it just makes a copy of itself and allows me to insert data into said copy.
         rowCols = tblRow.querySelectorAll('td') //Can place all of the td's from fbTemplate in arrat to determine how many columns bneed to be in the table

        // // dollarFormat
        rowCols[0].textContent = dollarFormat.format(seperatedData[i]) //Assigns totalMonthlyPayment to first cell
        rowCols[1].textContent = dollarFormat.format(seperatedData[i + 1]) //Assign home price to second cell
        rowCols[2].textContent = dollarFormat.format(seperatedData[i + 2]) //Assign downpayment to third cell
        rowCols[3].textContent = seperatedData[i + 3] //Assign loan term to fourth cell
        rowCols[4].textContent = seperatedData[i + 4] //Assign loan term to firth cell
        rowCols[5].textContent = dollarFormat.format(seperatedData[i + 5]) //Assign homeowner insurance to sixth cell 
        rowCols[6].textContent = dollarFormat.format(seperatedData[i + 6]) //Assign property tax to seventh cell
        rowCols[7].textContent = dollarFormat.format(seperatedData[i + 7]) //Assign hoa fee to eigth cell

        tblBody.appendChild(tblRow) //Attach table rows to the body of the table
    }
}

function showHistory(){ //This function is tied to a button. The purpose of the function is for the user to be able to see their past estimates without having to generate a new estimate. This also keeps the screen very clean
    let displayData = JSON.parse(localStorage.getItem('estimateHistory'))
    let tableBody = document.getElementById('results')
    let templateRow = document.getElementById('fbTemplate')
    let tableRow = document.importNode(templateRow.content, true)
    let rowCols = tableRow.querySelectorAll('td')
    populateTable(displayData, tableBody, templateRow, tableRow, rowCols)
}

function clearLocalStorage(){ //This function will remove all estimates from suer history when clicked. 
    localStorage.clear();
}