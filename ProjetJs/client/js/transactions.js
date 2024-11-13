$(document).ready(function() {

    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const accountId = urlParams.get('accountId');

    let endpoint = 'http://localhost:3000/api/transactions';

    loadTransactions(endpoint, accountId);

    $('#apply-filter').click(function() {
        const number = $('#filter-number').val();
        const filterType = $('#filter-type').val();

        if (number && filterType) {
            loadTransactions(endpoint, accountId, number, filterType);
        } else {
            alert('Veuillez entrer un nombre et sélectionner un type.');
        }
    });
});

function loadTransactions(endpoint, accountId = null, number = null, type = null) {
    let url = endpoint;
    const params = new URLSearchParams();

    if (accountId) {
        params.append('accountId', accountId);
    }
    
    if (number && type) {
        params.append('number', number);
        params.append('type', type);
    }

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            $('#transaction-table-body').empty();

            if (data.transactions && data.transactions.length > 0) {
                data.transactions.forEach(transaction => {
                    $('#transaction-table-body').append(`
                        <tr>
                            <td>${transaction.date}</td>
                            <td>${transaction.description}</td>
                            <td>${transaction.amount} €</td>
                            <td>${transaction.account_name || ''}</td>
                        </tr>
                    `);
                });
            } else {
                $('#transaction-table-body').append(`
                    <tr>
                        <td colspan="4" class="text-center">Aucune transaction trouvée pour cette période.</td>
                    </tr>
                `);
            }
        },
        error: function() {
            alert('Erreur lors du chargement des transactions.');
        }
    });
}
