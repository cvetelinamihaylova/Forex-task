window.addEventListener('load', async () => {

    const data = await (await fetch('./currencies.json')).json();
    const { base } = data;
    const { rates } = data;
    const fragment = document.getElementById('rates-template');

    function render() {
        Object.keys(rates).forEach((key, index) => {

            const element = document.querySelector(`#\\3${index}`);
            if (element !== null) {
                const currentRate = Number(element.innerText);
                if (currentRate > Number(rates[key])) {
                    toggleClasses(element, true);
                } else {
                    toggleClasses(element, false);
                }
                element.innerHTML = Number(rates[key]).toFixed(4);
            } else {
                const instance = document.importNode(fragment.content, true);

                instance.querySelector('.currency').innerHTML = `${base}/${key}`;

                instance.querySelector('.rate').id = index;
                instance.querySelector('.rate').innerHTML = Number(rates[key]).toFixed(4);
                document.getElementById('rates').appendChild(instance);
            }
        });
    }

    render();


    function increasingRatesHandler() {
        Object.keys(rates).forEach(key => {
            const value = Number(rates[key]) + 0.0001
            rates[key] = value.toFixed(4);
        })
    }
    function decreasingRatesHandler() {
        Object.keys(rates).forEach(key => {
            const value = Number(rates[key]) - 0.0001;
            if (value >= 1.0001) {
                rates[key] = value.toFixed(4);
            }
        })
    }

    let minutes = 0;

    const idInterval = setInterval(() => {

        if (minutes % 2 == 0) {
            increasingRatesHandler();
            render();
        } else {
            decreasingRatesHandler();
            render();
        }
    }, 5000)

    const idIntervalMinutes = setInterval(() => {
        minutes++
    }, 60000);

    setTimeout(() => {
        clearInterval(idInterval);
        clearInterval(idIntervalMinutes)
    }, 300000);


    function toggleClasses(element, isSmallerRate) {

        if (isSmallerRate === true) {
            element.classList.remove("badge", "badge-success");
            element.classList.add("badge", "badge-danger");
        } else {
            element.classList.remove("badge", "badge-danger");
            element.classList.add("badge", "badge-success");
        }

    }

});
