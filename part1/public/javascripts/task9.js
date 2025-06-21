const { createApp } = Vue;

createApp({
    data() {
        return {
            imgUrl: '',
            showDog: false,
            dogName: 'Unbelievable Doggo'
        };
    },

    async mounted() {
      try {
        // Fetch a random dog image from dog.ceo API
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        // Parse the JSON response
        const data = await response.json();
        // Assign the image URL to the message received
        this.imgUrl = data.message;
      } catch (err) {
      console.error('Could not load dog image:', err);
      }
    }
}).mount('#app');