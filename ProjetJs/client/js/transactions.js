$(document).ready(function() {

    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    let endpoint = 'http://localhost:3000/api/transactions/filter';
    let accountId = null

    if (type === "account") {
        accountId = urlParams.get('accountId');
        loadTransactions(endpoint, accountId);
    } else {
        loadTransactions(endpoint, null);
    }




    $('#apply-filter').click(function() {
        const number = $('#filter-number').val();
        const filterType = $('#filter-type').val();
        console.log(number, filterType)

        if (number && filterType) {
            if (type === "account") {
                const accountId = urlParams.get('accountId');
                loadTransactions(endpoint, accountId, number, filterType);
            } else {
                loadTransactions(endpoint, null, number, filterType);
            }
        } else {
            alert('Veuillez entrer un nombre et sélectionner un type.');
        }
    });
});

$(document).ready(function() {
    $('#logout').click(function() {
        // Remove the token from localStorage
        localStorage.removeItem('token');

        window.location.href = 'connexion.html';
    });
});


function loadTransactions(endpoint, accountId = null, number = null, type = null) {

    const token = localStorage.getItem('token');

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
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(data) {
            $('#transaction-table-body').empty();

            if (data.transactions && data.transactions.length > 0) {
                data.transactions.forEach(transaction => {
                    const [date, time] = transaction.date.split('T');
                    const formattedTime = time.split('.')[0];
                    $('#transaction-table-body').append(`
                        <tr>
                            <td>${date}</td>
                            <td>${formattedTime}</td>
                            <td>${transaction.type}</td>
                            <td>${transaction.amount} €</td>
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
