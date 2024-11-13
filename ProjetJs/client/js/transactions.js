$(document).ready(function() {
    // Charger toutes les transactions au chargement de la page
    loadTransactions();

    // Appliquer le filtre lorsque le bouton est cliqué
    $('#apply-filter').click(function() {
        const number = $('#filter-number').val();
        const type = $('#filter-type').val();

        if (number && type) {
            loadTransactions(number, type);
        } else {
            alert('Veuillez entrer un nombre et sélectionner un type.');
        }
    });
});

function loadTransactions(number = null, type = null) {
    let url = '/api/transactions';
    
    // Ajouter les paramètres de filtrage à l'URL si fournis
    if (number && type) {
        url += `?number=${number}&type=${type}`;
    }

    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            // Effacer les lignes précédentes
            $('#transaction-table-body').empty();

            // Ajouter chaque transaction au tableau
            data.transactions.forEach(transaction => {
                $('#transaction-table-body').append(`
                    <tr>
                        <td>${transaction.date}</td>
                        <td>${transaction.description}</td>
                        <td>${transaction.amount} €</td>
                        <td>${transaction.balance_after_transaction} €</td>
                    </tr>
                `);
            });
        },
        error: function() {
            alert('Erreur lors du chargement des transactions.');
        }
    });
}
