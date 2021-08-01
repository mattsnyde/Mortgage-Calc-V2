//TOTALMONTHLYPAYMENT DOES NOT WORK AND IS COMING NBACK AS UNDEFINED

const dollarFormat = Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})

//Controller function
function controller(){
    let homePrice = parseInt(document.getElementById('homePriceInput').value)
    let homeDownPayment = parseInt(document.getElementById('homeDownPaymentInput').value)
    let loanType = parseInt(document.getElementById('loanTypeInput').value)
    let interestRate = parseFloat(document.getElementById('interestRateInput').value)
    let homeOwnersInsurance = document.getElementById("homeownerInsurance").value;
    let propertyTax = document.getElementById("propertyTax").value;
    let hoaFees = document.getElementById("hoaFees").value;
 
    let info = monthlyPayment(homePrice, homeDownPayment, loanType, interestRate, homeOwnersInsurance, propertyTax, hoaFees)
    displayDonutChart(info, homeOwnersInsurance, propertyTax, hoaFees)

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
    // let interestOnMonthlyMortgagePayment = (fixedInterestRate / monthsOnLoan) * loanAmount;
    // let principalOnMortgagePayment = monthlyMortgagePayment - interestOnMonthlyMortgagePayment;
    // console.log(monthlyMortgagePayment, interestOnMonthlyMortgagePayment, principalOnMortgagePayment)
    let monthlyMortgagePaymentDisplay = document.getElementById('principalAndInterest')
    monthlyMortgagePaymentDisplay.innerHTML = dollarFormat.format(monthlyMortgagePayment);
    let totalMonthlyPayment = monthlyMortgagePayment + homeOwnersInsurance + propertyTax + hoaFees //This number takes into account the standard monthly mortgagePayment as well as home owners insurance, property tax, and home owner assocation fees.
    console.log(homeOwnersInsurance, propertyTax, hoaFees. totalMonthlyPayment)
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
                        size: 20 //make font of legend smaller
                    },
                    labels:{ 
                        font:{
                            size: 20 //make font of labels smaller
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