export function getButton(button1, button2, button3) {
    document.getElementById(button1[0]).disabled = button1[1];
    document.getElementById(button2[0]).disabled = button2[1];
    document.getElementById(button3[0]).disabled = button3[1];
}


