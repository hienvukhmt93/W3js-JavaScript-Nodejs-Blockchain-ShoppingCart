const fs = require('fs');
const dir = '/home/hienvu/Desktop/Data-IMG';

fs.readdir(dir, (err, files) => {
  console.log(files[0]);
});