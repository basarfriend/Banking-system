let editBtn= document.querySelector(".btn-edit")
let productPage=document.querySelector(".product-page")
let productEditCard=document.querySelector(".product-edit-card")
editBtn.addEventListener("click",()=>{
    productPage.classList.add("hidden")
    productEditCard.classList.remove("hidden")
})