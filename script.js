let book_json;
let book_data;

// Load 이벤트
document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("json/book_info.json");
    book_json = await response.json();

    book_data = book_json["book_data"];

    
})