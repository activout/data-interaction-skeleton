// Please don't use JQuery for DOM manipulation and form submission IRL. Please use React/Vue/Angular instead!

$(function () {

    let apiRoot = '/api/counters';

    function getCounterRowHtml(counter) {
        return `<div class="row" data-counter-id="${counter.id}">
         <div class="col-sm">
            ${counter.id}
        </div>
        <div class="col-sm">
            ${counter.name}
        </div>
        <div class="col-sm">
            <button class="btn btn-sm btn-primary increaseCounter" data-counter-id="${counter.id}" type="button">${counter.value}</button>
        </div>
    </div>`;
    }

    function installCounterClickHandler() {
        $(".increaseCounter").off('click').click(counterClickHandler);

        function counterClickHandler(event) {
            event.target.setAttribute('disabled̈́', 'disabled')
            let counterId = event.target.getAttribute('data-counter-id');
            $.post(apiRoot + "/" + counterId,
                {},
                function (counter, status) {
                    $(".row[data-counter-id=" + counterId + "]").replaceWith(getCounterRowHtml(counter));
                    installCounterClickHandler();
                });
        }
    }

    function installFormSubmitHandler() {
        $("#addCounterForm").submit(function (event) {
            event.target.setAttribute('disabled̈́', 'disabled');
            let $counterName = $('#counterName', event.target);
            let name = $counterName.val();

            $.ajax({
                type: 'POST',
                url: apiRoot,
                data: JSON.stringify({'name': name}),
                success: function (counter, status) {
                    $("#addCounterRow").before(getCounterRowHtml(counter));
                    installCounterClickHandler();
                    $counterName.val('');
                    event.target.removeAttribute('disabled̈́');
                },
                contentType: "application/json",
                dataType: 'json'
            });

            event.preventDefault();
        });
    }

    function loadCounters() {
        $.getJSON(apiRoot, function (result) {
            $.each(result, function (i, counter) {
                $("#addCounterRow").before(getCounterRowHtml(counter));
            });
            installCounterClickHandler();
        });
    }

    installFormSubmitHandler();
    loadCounters();
});
