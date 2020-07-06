const form = document.querySelector('form');
const urlElement = document.querySelector('#generatedUrl');
const errorElement = document.querySelector('#error');

const handlePost = async (body) => {
  return await fetch('/api/url', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      return json;
    })
    .catch((err) => {
      return err.text().then((error) => {
        return { error: JSON.parse(error) };
      });
    });
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  errorElement.style.display = 'none';
  urlElement.style.display = 'none';

  const formData = new FormData(form);
  const url = formData.get('url');
  const short = formData.get('short');
  const body = { url: url, short: short };

  handlePost(body).then((data) => {
    if (data.error) {
      errorElement.textContent = data.error.message;
      errorElement.style.display = 'initial';
    } else {
      const generatedURL = window.location.href + data.short;

      urlElement.textContent = generatedURL;
      urlElement.href = generatedURL;
      urlElement.style.display = 'initial';
      form.reset();
    }
  });
});
