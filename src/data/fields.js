export var myJson = {};
fetch("./tradesys.fields.json")
  .then((response) => response.json())
  .then((json) => {
    console.log(json);
    myJson = json;
  });
