var Account = function (id, creditLines, creditLineIds, extraCredit) {
    this.id = id
    this.creditLines = creditLines ? creditLines : []
    this.addCreditLine = addCreditLine
    this.creditLineIds = creditLineIds ? creditLineIds : {}
    this.getBalance = getBalance
    this.getLimit = getLimit
    this.chargeBalance = chargeBalance
    this.payBalance = payBalance
    this.extraCredit = extraCredit ? extraCredit : 0
    this.getProviders = getProviders
}

function getProviders () {
    return {creditLines: this.creditLines,creditLineIds: this.creditLineIds}
}

function payBalance(provider, paymentAmount) {
    var creditLineId = this.creditLineIds[provider]
    var lineBalance = this.creditLines[creditLineId].balance

    this.creditLines[creditLineId].balance = lineBalance - paymentAmount

    if (this.creditLines[creditLineId].balance < 0) {
        var amountToExtraCredit = Math.abs(this.creditLines[creditLineId].balance)
        this.creditLines[creditLineId].balance = 0
        this.extraCredit = this.extraCredit + amountToExtraCredit

        console.log('Extra Credit for ' + this.id + ': ' + this.extraCredit)
    }

    console.log('New Balance for ' + provider + ': ' + this.creditLines[creditLineId].balance)
}

function chargeBalance(provider, amount) {
    var chargeAmount = parseInt(amount)

    if ((this.creditLines[this.creditLineIds[provider]].balance + chargeAmount) > this.creditLines[this.creditLineIds[provider]].limit) {
        console.log("Unable to charge " + chargeAmount + " to " + provider + 
        ". Account limit of " + this.creditLines[this.creditLineIds[provider]].limit + ".")
        return
    }

    console.log('Amount to charge: ' + chargeAmount)

    this.creditLines[this.creditLineIds[provider]].balance = 
    this.creditLines[this.creditLineIds[provider]].balance + chargeAmount

    console.log(`New Balance for ${provider}: ${this.creditLines[this.creditLineIds[provider]].balance}`)
}

function getBalance(provider) {
    return this.creditLines[this.creditLineIds[provider]].balance
}

function getLimit(provider) {
    return this.creditLines[this.creditLineIds[provider]].limit
}

function addCreditLine(provider, limit) {
    var creditLineId = this.creditLines.push({
        provider: provider,
        balance: 0,
        limit: limit
    })

    this.creditLineIds[provider] = creditLineId - 1
}

exports.Account = Account

