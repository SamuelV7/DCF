const CC = require('currency-converter-lt')

function dcf(cashflow, discount, growthRate, growthPeriod) {
    let cashFlowWithGrowth = cashflow
    let gRate = 1+(growthRate / 100)
    let discountRate = 1+(discount/100)
    let dcf = []
    for (let i = 1; i <= growthPeriod; i++) {
        cashFlowWithGrowth = cashFlowWithGrowth * gRate
        dcf.push(cashFlowWithGrowth/Math.pow(discountRate, i))
        // console.log("Year "+ i) // console.log("Cashflow: " + cashFlowWithGrowth) // console.log("DCF: "+ dcf)
    }
    //console.log(dcf)
    const add = (a,b)=> a+b
    let finalDcf = dcf.reduce(add)
    console.log("Fair Value: "+finalDcf)
    return finalDcf
}

function currencify(amount, currencyCode, format){
    let currency = new Intl.NumberFormat(format, {style: 'currency', currency:currencyCode}).format(amount)
    return currency
}

function getMultiplier(interest){
    return 1 + (interest/100)
}
function compound(interestRate, amount, years){
    let compoundedList = []
    let interestMultiplier = getMultiplier(interestRate)
    let compoundingValue = amount
    for (let i = 0; i < years; i++) {
        //console.log("Interest mult : "+interestMultiplier)
        let yearlyDetails = {year: i+1, compoundedValue: compoundingValue * interestMultiplier}
        compoundingValue = compoundingValue * interestMultiplier
        compoundedList.push(yearlyDetails)
    }
    return compoundedList
}

function discounting(discountRate, cashListObject){
    let discountMuliplier = getMultiplier(discountRate)
    let dcfObject = []
    for (let i = 0; i < cashListObject.length; i++) {
        let year = i+1
        let dcf = cashListObject[i].compoundedValue/(Math.pow(discountMuliplier, year))
        let yearlyDcfDetails = {year: year, cashflow: cashListObject[i].compoundedValue, dcf:dcf}
        dcfObject.push(yearlyDcfDetails)
    }
    return dcfObject
}

// function theDCFOld(discountRate, fcf, gRate, gYears, tRate, tPeriod, currentValue){
//     //get growth Compounded List
//     let growthlist = compound(gRate, fcf, gYears)
//     let tList = compound(tRate, growthlist[growthlist.length -1].compoundedValue, tPeriod)

//     let joinedList = growthlist.concat(tList)
//     let discountedArray = discounting(discountRate, joinedList)
//     const add = (a,b)=> a.dcf+b.dcf
//     let dcf = 0
//     for (let i = 0; i < discountedArray.length; i++) {
//         dcf += discountedArray[i].dcf
//     }
//     console.log("Fair Value:    " + currencify(dcf, 'USD', 'en-US'))
//     console.log("Current Value: " + currencify(currentValue, 'USD', 'en-US'))
//     return dcf
// }
function theDCF(dcfDetails){
    //get growth Compounded List
    let growthlist = compound(dcfDetails.growthRate, dcfDetails.fcf, dcfDetails.growthYears)
    let tList = compound(dcfDetails.tGrowthRate, growthlist[growthlist.length -1].compoundedValue, dcfDetails.tStageYears)

    let joinedList = growthlist.concat(tList)
    let discountedArray = discounting(dcfDetails.discountRate, joinedList)
    let dcf = 0
    for (let i = 0; i < discountedArray.length; i++) {
        dcf += discountedArray[i].dcf
    }
    console.log("Fair Value:    " + currencify(dcf, 'USD', 'en-US'))
    console.log("Current Value: " + currencify(dcfDetails.currValue, 'USD', 'en-US'))
    return dcf
}
let valueCheck = {
    currValue: 250,
    fcf: 170000*12, //fcf per share
    discountRate: 7,
    growthYears: 10,
    growthRate: 5,
    tStageYears: 10,
    tGrowthRate: 3,
}
dcfValue = theDCF(valueCheck)

// compTest = compound(7.229, 69.503, 10)
// console.log(compTest)

async function inrToGbp(amount){
    let currencyConvertor = new CC({from: "INR", to:"GBP"})
    let result = await currencyConvertor.convert(amount)
    return result
}
async function gbpToInr(amount){
    let currencyConvertor = new CC({from: "GBP", to:"INR"})
    let result = await currencyConvertor.convert(amount)
    return result
}
//MAKE SURE IT WORKS WITH OWNERS EARNINGS AND FREE CASH FLOw
//ALSO MUST BE ABLE TO CALCULATE FCF AND OWNERS EARNING FROM TICKER SYMBOL
//also do reverse dcf