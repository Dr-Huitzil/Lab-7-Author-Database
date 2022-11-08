let AutLink = document.querySelectorAll(".author");

for (let i = 0; i < AutLink.length; i++)
{
  AutLink[i].addEventListener("click", displayAuthorInfo);
}

async function displayAuthorInfo()
{
  var modal = new bootstrap.Modal(document.getElementById('authorModal'));
 modal.show();

  let authorId = this.getAttribute("id");
  let url = `/api/author/${authorId}`;
  let response = await fetch (url);
  let data = await response.json();
  // console.log(data);
  document.querySelector("#authorInfo").innerHTML = "<h5>" + data[0].firstName + " " + data[0].lastName + "<br></h5>";
  document.querySelector("#authorInfo").innerHTML += 
    `<div id="info">
      <img src="${data[0].portrait}" width="200">
      <div id="specifics"> 
        <p><b>Sex:</b> ${data[0].sex}</p>
        <p><b>Date of Birth:</b> ${data[0].dob.substring(0,10)}</p>
        <p><b>Date of Death:</b> ${data[0].dod.substring(0,10)}</p>
        <p><b>Country:</b> ${data[0].country}</p>
        <p><b>Profession:</b> ${data[0].profession}</p>
      </div>
  </div>
  <p id="bio"><b>Biography:</b> ${data[0].biography}</p>`;
}