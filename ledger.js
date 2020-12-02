var Ledger = function (ledgerStore) {
    this.entries = ledgerStore ? ledgerStore : []
    this.addEntry = addEntry
}

function addEntry (to, from, amount, when, provider) {
    this.entries.push({
        to: to,
        from: from,
        amount: amount,
        when: when,
        provider: provider,
        receiptNumber: when.getTime()
    })
}

exports.Ledger = Ledger
exports.addEntry = addEntry