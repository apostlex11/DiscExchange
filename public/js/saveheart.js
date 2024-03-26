const favoriteBtn = document.querySelectorAll('.addFavoriteBtn');

const favoriteFormHandler = async (event) => {
  event.preventDefault();

  const id = event.target.dataset.id;
  console.log(id);

  if (id) {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log(result);
  }
};

favoriteBtn.forEach((btn) => {
  btn.addEventListener('click', favoriteFormHandler);
});


const deleteBtn = document.querySelectorAll('.favRemoveBtn');

const deleteHandler = async (event) => {
  event.preventDefault();

  const id = event.target.dataset.id;
  console.log(id);

  const response = await fetch(`/api/favorites/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
    headers: { 'Content-Type': 'application/json' },
  });


  if (response.ok) {
    document.location.reload();
  } else {
    alert(response.statusText)
  }

};

deleteBtn.forEach((btn) => {
  btn.addEventListener('click', deleteHandler);
});