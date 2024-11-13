$(document).ready(function() {
    // Fetch accounts and calculate total balance
    fetchAccounts();

    // Fetch the last three transactions
    fetchTransactions();

    // Fetch the last two notifications
    fetchNotifications();
});

// Function to fetch accounts and calculate total balance
function fetchAccounts() {
    $.ajax({
        url: 'http://localhost:3000/api/accounts/list',
        method: 'GET',
        success: function(data) {
            let totalBalance = 0;
            const accountSection = $('.col-md-8.mb-4:first'); // Target first account section
            accountSection.empty();

            data.accounts.forEach(account => {
                // Display each account with its balance
                accountSection.append(`
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${account.name}</h5>
                            <p class="card-text">**** ${account.id}</p>
                            <p class="card-text">${account.balance.toFixed(2)} €</p>
                            <a href="transaction.html?type=account&accountId=${account.id}" class="btn btn-dark view-account-transactions">Voir les transactions</a>
                        </div>
                    </div>
                `);
                totalBalance += parseFloat(account.balance);
            });

            // Display total balance
            $('.display-4').text(`${totalBalance.toFixed(2)} €`);
        },
        error: function(error) {
            console.error('Error fetching accounts:', error);
        }
    });
}

// Function to fetch the last three transactions
function fetchTransactions() {
    $.ajax({
        url: 'http://localhost:3000/api/transactions/filter?number=3&type=jours',
        method: 'GET',
        success: function(data) {
            const transactionTableBody = $('.table.table-striped tbody');
            transactionTableBody.empty();

            if (data.transactions && data.transactions.length > 0) {
                data.transactions.forEach(transaction => {
                    transactionTableBody.append(`
                        <tr>
                            <td>${transaction.date}</td>
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

// Function to fetch the last two notifications
function fetchNotifications() {
    $.ajax({
        url: 'http://localhost:3000/api/notifications?limit=2',
        method: 'GET',
        success: function(data) {
            const notificationSection = $('.col-md-4.mb-4:last'); // Target the notifications section
            notificationSection.empty();

            if (data.notifications && data.notifications.length > 0) {
                data.notifications.forEach(notification => {
                    notificationSection.append(`
                        <div class="alert alert-${notification.type === 'low_balance' ? 'warning' : 'info'}">
                            <h6>${notification.type === 'low_balance' ? 'Solde bas' : 'Nouvelle connexion'}</h6>
                            <p>${notification.message}</p>
                        </div>
                    `);
                });
            } else {
                notificationSection.append('<p>Aucune notification récente.</p>');
            }
        },
        error: function(error) {
            console.error('Error fetching notifications:', error);
        }
    });
}
