const removeBtn = document.querySelectorAll('.cartRemoveBtn');

const deleteHandler = async (event) => {
    event.preventDefault();

    const id = event.currentTarget.dataset.id;
    console.log(id);

    const response = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {

        document.location.reload();
    } else {
        alert(response.statusText);
    }
};

removeBtn.forEach((btn) => {
    btn.addEventListener('click', deleteHandler);
});