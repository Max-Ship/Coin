export async function banks(res) {
    let myMap;
    ymaps.ready(() => {
        if (!myMap) {
            myMap = new ymaps.Map("map", {
                center: [55.751574, 37.573856],
                zoom: 9,
            });
        }

        for (let bank of res) {
            const placemark = new ymaps.Placemark([bank["lat"], bank["lon"]], {
                balloonContent: 'Coin - курсовая работа'
            });

            myMap.geoObjects.add(placemark);
        }
    });
}
