$(document).ready(function () {

    // Check if user is connected
    if (!localStorage.getItem('token')) {
        window.location.href = "connexion.html";
        return;
    }

    // Initialize functions to load data
    fetchAccounts();
    fetchTransactions();
    updateTotalBalance();
    fetchNotifications();

    // Event listener for download transaction history
    $('#download-history').click(function () {
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
            success: function (response) {
                $('#totalBalance').text(response.totalBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }));
            },
            error: function (error) {
                console.error("Erreur lors de la récupération du solde total :", error);
                $('#profileMessage').text("Erreur lors du chargement du solde total.").addClass("text-danger");
            }
        });
    }

    // Event listener for deleting an account
    $(document).on('click', '.delete-account', function () {
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
            success: function () {
                alert("Compte supprimé avec succès.");
                $(`[data-account-id="${accountId}"]`).closest('.card').remove();
                fetchTransactions(); // Refresh transactions
                updateTotalBalance(); // Update total balance
                console.log("Account successfully deleted:", accountId); // Debugging
            },
            error: function (error) {
                console.error("Erreur lors de la suppression du compte :", error);
                alert("Erreur lors de la suppression du compte. Veuillez réessayer.");
            }
        });
    });

    // Event listener for deleting a notification
    $(document).on('click', '.delete-notification', function () {
        const notificationId = $(this).closest('.alert').data('notification-id');
        console.log("Delete button clicked for notification ID:", notificationId); // Debugging

        $.ajax({
            url: `http://localhost:3000/api/notifications/${notificationId}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            success: function () {
                console.log("Notification deleted successfully:", notificationId); // Debugging
                $(`[data-notification-id="${notificationId}"]`).remove(); // Remove notification from DOM

                // Show placeholder if no notifications remain
                if ($('#notifications .alert').length === 0) {
                    $('#notifications').append('<p class="text-center">Aucune notification.</p>');
                }
            },
            error: function (error) {
                console.error('Erreur lors de la suppression de la notification :', error);
                alert("Erreur lors de la suppression de la notification. Veuillez réessayer.");
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
            success: function (data) {
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
            error: function (error) {
                console.error('Erreur lors de la récupération des transactions :', error);
            }
        });
    }

    // Redirect to add account page
    $('#add-account').click(function () {
        window.location.href = "addAccount.html";
    });

    // Logout button
    $('#logout').click(function () {
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
            success: function (data) {
                const url = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'transaction_history.csv';
                document.body.append(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            },
            error: function (error) {
                console.error('Erreur lors du téléchargement de l\'historique des transactions :', error);
            }
        });
    }

    // Function to fetch notifications
    function fetchNotifications() {
        $.ajax({
            url: 'http://localhost:3000/api/notifications',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            success: function (response) {
                const notificationsContainer = $('#notifications');
                notificationsContainer.empty();

                if (response.notifications && response.notifications.length > 0) {
                    response.notifications.forEach(notification => {
                        // Format the date for display
                        const notificationDate = new Date(notification.createdAt);
                        const formattedDate = notificationDate.toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        const formattedTime = notificationDate.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        let notificationMessage = '';
                        let notificationTitle = '';
                        let alertClass = 'alert-warning';

                        if (notification.type === 'threshold') {
                            notificationMessage = `Attention : ${notification.message}`;
                            notificationTitle = 'Solde bas';
                        } else if (notification.type === 'suspicious_login') {
                            notificationMessage = `Sécurité : ${notification.message}`;
                            notificationTitle = 'Alerte connexion';
                            alertClass = 'alert-primary';
                        } else {
                            notificationMessage = notification.message;
                        }

                        notificationsContainer.append(`
                            <div class="alert ${alertClass} d-flex justify-content-between align-items-start position-relative" data-notification-id="${notification.id}">
                                <div>
                                    <h6>${notificationTitle}</h6>
                                    <p>${notificationMessage}</p>
                                    <small class="text-muted">Reçue le ${formattedDate} à ${formattedTime}</small>
                                </div>
                                <button class="btn-close delete-notification position-absolute top-0 end-0 m-2" aria-label="Close"></button>
                            </div>
                        `);
                    });
                } else {
                    notificationsContainer.append('<p class="text-center">Aucune notification.</p>');
                }
            },
            error: function (error) {
                console.error('Erreur lors de la récupération des notifications :', error);
                $('#notifications').html('<p class="text-danger">Erreur lors du chargement des notifications.</p>');
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
            success: function (data) {
                const accountSection = $('.accounts-cards');
                accountSection.empty();

                if (data.accounts && data.accounts.length > 0) {
                    data.accounts.forEach(account => {
                        accountSection.append(`
                            <div class="card mb-3 p-3" data-account-id="${account.id}">
                                <div class="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 class="card-title">${account.name}</h5>
                                        <p class="card-text">${account.type}</p>
                                        <p class="card-text">${account.balance} €</p>
                                        <a href="transactions.html?type=account&accountId=${account.id}" class="btn btn-dark view-account-transactions">Voir les transactions</a>
                                        <button class="btn btn-danger delete-account mt-2" data-account-id="${account.id}">Supprimer</button>
                                    </div>
                                    <div class="chart-container">
                                        <canvas id="chart-${account.id}"></canvas>
                                        <style> .chart-container {
                                                    width: 100%;          /* Full width by default */
                                                    max-width: 280px;     /* Set a max width for larger screens */
                                                    height: 200px;        /* Default height */

                                                    /* For medium screens (tablets, small laptops) */
                                                    @media (max-width: 1024px) {
                                                        max-width: 250px;
                                                        height: 180px;
                                                    }

                                                    /* For smaller screens (large phones, smaller tablets) */
                                                    @media (max-width: 768px) {
                                                        max-width: 220px;
                                                        height: 160px;
                                                    }

                                                    /* For very small screens (standard smartphones) */
                                                    @media (max-width: 576px) {
                                                        max-width: 180px;
                                                        height: 140px;
                                                    }

                                                    /* For ultra-small screens (like iPhone 14 Pro Max and similar) */
                                                    @media (max-width: 430px) {
                                                        max-width: 160px;
                                                        height: 120px;
                                                    }

                                                    /* For extra-narrow screens (older or mini smartphones) */
                                                    @media (max-width: 360px) {
                                                        max-width: 140px;
                                                        height: 100px;
                                                    }
                                                }
                                        </style>
                                    </div>
                                </div>
                            </div>
                        `);


                        // Call the new function to render the balance evolution chart for each account
                        fetchAndRenderBalanceChart(account.id);
                    });
                } else {
                    accountSection.append('<div class="text-center">Vous n\'avez aucun compte.</div>');
                }
            },
            error: function (error) {
                console.error('Erreur lors de la récupération des comptes :', error);
            }
        });
    }


    function fetchAndRenderBalanceChart(accountId) {
        $.ajax({
            url: `http://localhost:3000/api/transactions/history/${accountId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            success: function (data) {
                const dates = [];
                const balances = [];

                if (data.transactions && data.transactions.length > 0) {
                    data.transactions.forEach(transaction => {
                        const date = transaction.date.split('T')[0]; // Only the date portion
                        dates.push(date);
                        balances.push(parseFloat(transaction.balance_after_transaction));
                    });

                    renderBalanceChart(dates, balances, accountId);
                } else {
                    console.log("No transactions found for account:", accountId);
                }
            },
            error: function (error) {
                console.error('Erreur lors de la récupération des transactions :', error);
            }
        });
    }

    function renderBalanceChart(dates, balances, accountId) {
        const canvas = document.getElementById(`chart-${accountId}`);

        if (canvas) {
            const ctx = canvas.getContext('2d');

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates.reverse(),
                    datasets: [{
                        label: 'Solde (€)',
                        data: balances.reverse(),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Allow chart to adjust size based on container
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            },
                            grid: {
                                display: true,
                                color: 'rgba(200, 200, 200, 0.3)'
                            },
                            ticks: {
                                autoSkip: true,
                                maxRotation: 0,
                                minRotation: 0
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Solde (€)'
                            },
                            grid: {
                                display: true,
                                color: 'rgba(200, 200, 200, 0.3)'
                            },
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        } else {
            console.error(`Canvas element for chart-${accountId} not found.`);
        }
    }


});
