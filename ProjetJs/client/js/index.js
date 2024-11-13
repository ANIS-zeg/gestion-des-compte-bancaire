$(document).ready(function() {

    // check if user is connected
    if (!localStorage.getItem('token')) {
        window.location.href = "connexion.html"
    }

    // get accounts
    fetchAccounts();

    // get transactions
    fetchTransactions();

    $('#download-history').click(function() {
        downloadTransactionHistory();
    });
});

function fetchAccounts() {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    $.ajax({
        url: 'http://localhost:3000/api/accounts/list',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Set the Authorization header
        },
        success: function(data) {
            const accountSection = $('.accounts-cards');
            accountSection.empty();

            if (data.accounts && data.accounts.length > 0) {
                // create the divs of transactions
                data.accounts.forEach(account => {
                    console.log(account)
                    accountSection.append(`
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">${account.name}</h5>
                                <p class="card-text">${account.type}</p>
                                <p class="card-text">${account.balance} €</p>
                                <a href="transactions.html?type=account&accountId=${account.id}" class="btn btn-dark view-account-transactions">Voir les transactions</a>
                            </div>
                        </div>
                    `);
                });
            } else {
                transactionTableBody.append('<tr><td colspan="3" class="text-center">Vous n"avez aucun compte.</td></tr>');
            }

        },
        error: function(error) {
            console.error('Error fetching accounts:', error);
        }
    });
}

document.getElementById("add-account").addEventListener("click", function () {
    window.location.href = "addAccount.html";
  });

  $(document).ready(function() {
    $('#logout').click(function() {
        // Remove the token from localStorage
        localStorage.removeItem('token');

        // Redirect to the login page
        window.location.href = 'connexion.html';
    });
});


function fetchTransactions() {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    $.ajax({
        url: 'http://localhost:3000/api/transactions/filter?number=1000&type=annees',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(data) {
            const transactionTableBody = $('.table.table-striped tbody');
            transactionTableBody.empty();

            if (data.transactions && data.transactions.length > 0) {
                data.transactions.slice(0, 4).forEach(transaction => {
                    const [date, time] = transaction.date.split('T');
                    const formattedTime = time.split('.')[0];
                    transactionTableBody.append(`
                        <tr>
                            <td>${date}</td>
                            <td>${formattedTime}</td>
                            <td>${transaction.type}</td>
                            <td>${transaction.amount} €</td>
                        </tr>
                    `);
                });
            } else {
                transactionTableBody.append('<tr><td colspan="3" class="text-center">Aucune transaction récente trouvée.</td></tr>');
            }
        },
        error: function(error) {
            console.error('Error fetching transactions:', error);
        }
    });
}

function downloadTransactionHistory() {
    const token = localStorage.getItem('token'); 
    $.ajax({
        url: 'http://localhost:3000/api/transactions/download-history',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` 
        },
        xhrFields: {
            responseType: 'blob'
        },
        success: function(data, status, xhr) {

            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transaction_history.csv';
            document.body.append(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        error: function(error) {
            console.error('Error downloading transaction history:', error);
        }
    });
}
