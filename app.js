const select = document.getElementById("selectModel");
const modelEntity = document.getElementById("model");

select.addEventListener("change", (e) => {
  const glb = e.target.value;
  console.log("Cambiando modelo a:", glb);
  modelEntity.setAttribute("gltf-model", glb);
});
