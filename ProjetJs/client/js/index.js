$(document).ready(function() {

    // Check if user is connected
    if (!localStorage.getItem('token')) {
        window.location.href = "connexion.html";
        return;
    }

    // Initialize functions to load data
    fetchAccounts();
    fetchTransactions();
    updateTotalBalance();

    // Event listener for download transaction history
    $('#download-history').click(function() {
        downloadTransactionHistory();
    });

    // Function to get and update the total balance
    function updateTotalBalance() {
        $.ajax({
            url: "http://localhost:3000/api/user/total-balance",
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            success: function(response) {
                $('#totalBalance').text(response.totalBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }));
            },
            error: function(error) {
                console.error("Erreur lors de la récupération du solde total :", error);
                $('#profileMessage').text("Erreur lors du chargement du solde total.").addClass("text-danger");
            }
        });
    }
    
    // Event listener for deleting an account
    $(document).on('click', '.delete-account', function() {
        const accountId = $(this).data('account-id'); 
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
            return;
        }

        // AJAX DELETE request to delete the account
        $.ajax({
            url: `http://localhost:3000/api/accounts/${accountId}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            success: function() {
                alert("Compte supprimé avec succès.");
                $(`[data-account-id="${accountId}"]`).closest('.card').remove();
                fetchTransactions(); // Refresh transactions
                updateTotalBalance(); // Update total balance
            },
            error: function(error) {
                console.error("Erreur lors de la suppression du compte :", error);
                alert("Erreur lors de la suppression du compte. Veuillez réessayer.");
            }
        });
    });

    // Function to fetch recent transactions
    function fetchTransactions() {
        $.ajax({
            url: 'http://localhost:3000/api/transactions/filter?number=1000&type=annees',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                    transactionTableBody.append('<tr><td colspan="4" class="text-center">Aucune transaction récente trouvée.</td></tr>');
                }
            },
            error: function(error) {
                console.error('Erreur lors de la récupération des transactions :', error);
            }
        });
    }

    // Function to fetch accounts and display them
    function fetchAccounts() {
        $.ajax({
            url: 'http://localhost:3000/api/accounts/list',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            success: function(data) {
                const accountSection = $('.accounts-cards');
                accountSection.empty();

                if (data.accounts && data.accounts.length > 0) {
                    data.accounts.forEach(account => {
                        accountSection.append(`
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h5 class="card-title">${account.name}</h5>
                                    <p class="card-text">${account.type}</p>
                                    <p class="card-text">${account.balance} €</p>
                                    <a href="transactions.html?type=account&accountId=${account.id}" class="btn btn-dark view-account-transactions">Voir les transactions</a>
                                    <button class="btn btn-danger delete-account" data-account-id="${account.id}">Supprimer</button>
                                </div>
                            </div>
                        `);
                    });
                } else {
                    accountSection.append('<div class="text-center">Vous n\'avez aucun compte.</div>');
                }
            },
            error: function(error) {
                console.error('Erreur lors de la récupération des comptes :', error);
            }
        });
    }

    // Redirect to add account page
    $('#add-account').click(function() {
        window.location.href = "addAccount.html";
    });

    // Logout button
    $('#logout').click(function() {
        localStorage.removeItem('token'); // Remove token
        window.location.href = 'connexion.html'; // Redirect to login
    });

    // Function to download transaction history
    function downloadTransactionHistory() {
        $.ajax({
            url: 'http://localhost:3000/api/transactions/download-history',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: function(data) {
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
                console.error('Erreur lors du téléchargement de l\'historique des transactions :', error);
            }
        });
    }
});
