const form = document.querySelector('form');
const urlElement = document.querySelector('#generatedUrl');
const errorElement = document.querySelector('#error');
const listElement = document.querySelector('.list-group');

const handleGet = async () => {
  return await fetch('/api/url')
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
      getAndPlaceList();
    }
  });
});

const createUrlItem = (urlObject) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item');

  const a = document.createElement('a');
  const url = window.location.href + urlObject.short;
  a.href = url;
  a.textContent = url;

  li.appendChild(a);

  return li;
};

const getAndPlaceList = () => {
  handleGet().then((data) => {
    listElement.innerHTML = '';
    data.forEach((element) => {
      const li = createUrlItem(element);
      listElement.appendChild(li);
    });
  });
};

getAndPlaceList();
