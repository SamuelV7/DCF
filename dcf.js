const CC = require('currency-converter-lt')

function dcf(cashflow, discount, growthRate, growthPeriod) {
    let cashFlowWithGrowth = cashflow
    let gRate = 1+(growthRate / 100)
    let discountRate = 1+(discount/100)
    let dcf = []
    for (let i = 1; i <= growthPeriod; i++) {
        cashFlowWithGrowth = cashFlowWithGrowth * gRate
        dcf.push(cashFlowWithGrowth/Math.pow(discountRate, i))
        // console.log("Year "+ i)
        // console.log("Cashflow: " + cashFlowWithGrowth)
        // console.log("DCF: "+ dcf)
    }
    //console.log(dcf)
    const add = (a,b)=> a+b
    let finalDcf = dcf.reduce(add)
    console.log("Fair Value: "+finalDcf)
    return finalDcf
}

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


inrToGbp(100000).then(x =>{
    console.log(x)
})
// dcf(69.503, 8, 7, 10)
