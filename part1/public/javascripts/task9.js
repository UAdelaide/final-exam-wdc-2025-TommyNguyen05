const { createApp } = Vue;

createApp({
    data() {
        return {
            imgUrl: '',
            showDog: false,
            dogName: 'Unbelievable Doggo'
        };
    },

    mounted() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://dog.ceo/api/breeds/image/random', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    this.imgUrl = data.message;
                } else {
          console.error('AJAX error:', xhr.status);
        }
      }
    };

    xhr.send();
  }
}).mount('#app');