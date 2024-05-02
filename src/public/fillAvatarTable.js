addEventListener("DOMContentLoaded", async ()=>{

    console.log('works')
    const response =await fetch('/api/avatars');
    const avatars =await response.text();
    const avatarsArray = JSON.parse(avatars);
    const table = document.getElementById('avatars-table');
    for (const avatarElement of avatarsArray){
        const tr = document.createElement('tr');
        const tdName = document.createElement('tr');
        const tdage = document.createElement('tr');
        const tdCreatedAt = document.createElement('tr');
        tdName.innerText=avatarElement.avatarName;
        tdage.innerText=avatarElement.childAge;
        tdCreatedAt.innerText=avatarElement.createdAt;

        tr.appendChild(tdName);
        tr.appendChild(tdage);
        tr.appendChild(tdCreatedAt);

        table.appendChild(tr)



    }
    }
)