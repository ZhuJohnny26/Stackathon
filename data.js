const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '82ad3d4ca6da445d89db902db17311ca',
});
app.models
  .predict(
    'eeed0b6733a644cea07cf4c60f87ebb7',
    'https://samples.clarifai.com/metro-north.jpg'
  )
  .then(
    function (response) {
      // do something with response
      // return response;
      let color = response.outputs[0].data.colors[1].w3s.hex;
      // color1 = response.outputs[0].data.colors[1].w3s.name;
    },
    function (err) {
      // there was an error
    }
  );
