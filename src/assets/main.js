/***********AXIOS */

const apiAxios = axios.create({
    baseURL: 'https://api.thecatapi.com/v1/'
  });
  apiAxios.defaults.headers.common['X-API-KEY'] = MY_API_KEY;

/**************** */
const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVOURITES_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=${MY_API_KEY}`;

const spanError = document.getElementById('textoError');

async function loadRandomMichi(){
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();//convierte a json el data
    console.log('Rndom');    
    console.log(data);

    if(res.status !== 200){
        spanError.innerHTML="Hubo un error"+ res.status;
    }else{
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        
        img1.src = data[0].url;
        img2.src = data[1].url;

        btn1.onclick = () => saveFavouritesMichis(data[0].id);
        btn2.onclick = () => saveFavouritesMichis(data[1].id);
    }
    
}

async function loadFavoritesMichi(){
    const res = await fetch(API_URL_FAVOURITES, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': MY_API_KEY
        }
    });
       
    const data = await res.json();
    console.log('Favourites');    
    console.log(data);    
    
    if(res.status !== 200){  
        spanError.innerHTML="Hubo un error"+ res.status + data.message;
    }
    else{
        const gridFavMichis = document.getElementById('grid-favourites');
        gridFavMichis.innerHTML="";

        const h2 = document.createElement('h2');
        // const h2Text = document.createTextNode('Michis Favoritos');
        // h2.appendChild(h2Text);
        // gridFavMichis.appendChild(h2);

        data.forEach(michi => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Sacar al gato de favoritos');

            img.src = michi.image.url;
            // img.width = 150;
            btn.appendChild(btnText);
            btn.onclick = () => deleteFavouritesMichis(michi.id);
            article.appendChild(img);
            article.appendChild(btn);
            gridFavMichis.appendChild(article); 
        })
    }
}

async function saveFavouritesMichis(id){
    const { data, status } = await apiAxios.post('/favourites',{
        image_id: id,
    });


    // const res = await fetch(API_URL_FAVOURITES, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-API-KEY': MY_API_KEY
    //     },
    //     body: JSON.stringify({
    //         image_id: id
    //     })
    // });

    // data = await res.json();

    // console.log('Save');
    // console.log(res);

    if(status !== 200){
        spanError.innerHTML="Hubo un error"+ status + data.message;
    }else{
        console.log('Gato guardado en favoritos');
        loadFavoritesMichi();
        
    }
    
}

async function deleteFavouritesMichis(id){
    const res = await fetch(API_URL_FAVOURITES_DELETE(id), {
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': MY_API_KEY
        },
    });
    const data = await res.json();

    if(res.status !== 200){
        spanError.innerHTML="Hubo un error"+ res.status + data.message;
    }else{
        console.log('Gato eliminado de favoritos');
        loadFavoritesMichi();
        
    }
}

async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    console.log(formData.get('file'));
    const res = await fetch(API_URL_FAVOURITES_UPLOAD, {
        method: 'POST',
        headers:{
            // 'Content-Type':'multipart/form-data',
            'X-API-KEY': MY_API_KEY
        },
        body: formData,
    });

    const data = await res.json();
    
    if(res.status !== 200){
        spanError.innerHTML="Hubo un error"+ res.status + data.message;
    }else{
        console.log('foto Gato subida');        
        console.log({data});
        console.log(data.url);
        saveFavouritesMichis();   
    }
    
}

loadRandomMichi();
loadFavoritesMichi();