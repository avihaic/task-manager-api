const calculateTip = (total, tippercent = .25) => total + (total * tippercent)

const fahreneittocelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiustofahreneit = (temp) => {
    return (temp * 1.8) + 32
}


module.exports = {
    calculateTip,
    fahreneittocelsius,
    celsiustofahreneit
}