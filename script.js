import { transform } from "./transform.js";

function output(value){
    let outputEl = document.getElementById("output");
    outputEl.textContent = value;
}

/** @type {HTMLFormElement} */
let formEl = document.getElementById("form");

formEl.onsubmit = function(ev){
    ev.preventDefault();
    /** @type {HTMLTextAreaElement} */
    let textArea = formEl["data"];
    let yapiSchema = textArea.value;
    output(transform(JSON.parse(yapiSchema)));
};