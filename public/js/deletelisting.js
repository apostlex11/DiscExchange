const deleteListingBtn = document.querySelectorAll('.listingDeleteBtn');

const deleteListingHandler = async (event) => {
    event.preventDefault();

    const id = event.target.dataset.id;
    console.log("id to be deleted", id);

    const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log('RESULT', result);
};

deleteListingBtn.forEach((btn) => {
    btn.addEventListener('click', deleteListingHandler);
});