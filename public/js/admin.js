const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf= btn.parentNode.querySelector('[name=_csrf]').value;

    //finds closest ancestor with this classification
    const productElement = btn.closest('article');

    // fetch can be used to recieve or send data
    fetch('/admin/product/'+prodId, {
        method: 'DELETE',
        headers: {
        'x-csrf-token': csrf
        }
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
        console.log(err);
    });
}