import wrapButtons from "../view/header/buttons";

export default function appendHeader(auth = false) {
    const headerContainer = document.getElementById('header-app');

    if (auth && headerContainer.contains(wrapButtons)) {
        wrapButtons.remove();
        return
    }

    if (!headerContainer.contains(wrapButtons) && auth === false) {
        headerContainer.append(wrapButtons);
    }

}