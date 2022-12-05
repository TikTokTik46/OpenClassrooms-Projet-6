let p1 = 0;
let p2 = 0;
let p3 = 0;
let p4 = 0;

document.body.onload = bestmovie()
document.body.onload = CreateCarrousel("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score","container1","g1","d1",p1)
document.body.onload = CreateCarrousel("http://localhost:8000/api/v1/titles/?genre=Sci-fi&sort_by=-imdb_score","container2","g2","d2",p2)
document.body.onload = CreateCarrousel("http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score","container3","g3","d3",p3)
document.body.onload = CreateCarrousel("http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score","container4","g4","d4",p4)

function bestmovie(){
    fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score")
    .then(response => response.json())
    .then(data => {
        title=document.getElementById("best_movie_title");
        title.innerHTML=data.results[0].title;
        image=document.getElementById("best_movie_image");
        button=document.getElementById("button-play-best-movie");
        image.src=data.results[0].image_url
        image.addEventListener("click",function(){activeFilmModal("film0-container1")});
        button.addEventListener("click",function(){activeFilmModal("film0-container1")});
        fetch(data.results[0].url)
        .then(response => response.json())
        .then(data => {
        summary=document.getElementById("best_movie_summary");
        summary.innerHTML=data.description;
        })
    })      
}

function JacketCarrousel(id_image_debut,id_image_fin,API_response,containername){
    for(i=id_image_debut;i<id_image_fin;i++){
            //Création des jackets du carrousel
            let container=document.getElementById(containername);
            let jacket = document.createElement("a");
            jacket.className="JacketCarrousel carrousel-modal-trigger";
            jacket.id="film"+i+"-"+containername;
            jacket.style.cursor = "pointer";
            jacket.style.opacity = "0.8";
            jacket.style.transition="opacity 0.5s ease";
            jacket.addEventListener("click",function(){activeFilmModal(jacket.id)});
            jacket.addEventListener("mouseover",function(){mouseOverJacket(jacket)});
            jacket.addEventListener("mouseout",function(){mouseOutJacket(jacket)});
            jacket.style.backgroundImage="url("+API_response.results[i-id_image_debut].image_url+")";
            container.appendChild(jacket);
            modalCreation(i,id_image_debut,containername,API_response); // Vers la fonction pour la création des fenêtres modale
    }
}

function CreateCarrousel(APIrequest,containername, g, d, p){
    //Envoi de la requete à l'API pour les 5 premiers films
    let container=document.getElementById(containername);
    container.style.width=(310*7)+"px";
    fetch(APIrequest)
    .then(response => response.json())
    .then(API_response => {
        JacketCarrousel(0,5,API_response,containername)
    //Envoi de la requete à l'API pour les 2 derniers films
        fetch("http://localhost:8000/api/v1/titles/?page=2&" + APIrequest.substring(37))
        .then(response => response.json())
        .then(API_response_page_2 => {
            JacketCarrousel(5,7,API_response_page_2,containername)
                })
            })  
                document.getElementById(g).onclick=function(){
                    nombreImagesVisible = Math.ceil(document.getElementsByClassName("carrousel")[1].offsetWidth/310)
                    if (p>-((7-nombreImagesVisible)/2)){
                        p--;
                        document.getElementById(containername).style.transform="translate("+p*310+"px)";
                        document.getElementById(containername).style.transition="all 0.5s ease";
                    }
                }
                document.getElementById(d).onclick=function(){
                    nombreImagesVisible = Math.ceil(document.getElementsByClassName("carrousel")[1].offsetWidth/310)
                    if (p<(7-nombreImagesVisible)/2){
                        p++;
                        document.getElementById(containername).style.transform="translate("+p*310+"px)";
                        document.getElementById(containername).style.transition="all 0.5s ease";
                    }
                }   
    }

    function modalCreation(i,i_min,containername,data){
        //Création de la fenêtre modale
        fetch(data.results[i-i_min].url)
        .then(response => response.json())
        .then(movie_data => {
        modal_container=document.createElement("div");
        modal_container.className="modal-container modal-film"+i+"-"+containername;
        modal_container.classList.toggle("desactive")
        overlay=document.createElement("div");
        overlay.className="overlay modal-trigger";
        overlay.addEventListener("click",function(){activeFilmModal("film"+i+"-"+containername)})
        modal=document.createElement("div");
        modal.className="modal";
        close_button=document.createElement("button");
        close_button.className="close-modal modal-trigger";
        close_button.innerHTML="x";
        close_button.addEventListener("click",function(){activeFilmModal("film"+i+"-"+containername)})
        movie_title=document.createElement("h3");
        movie_title.innerHTML=movie_data.title;
        movie_jacket=document.createElement("img");
        movie_jacket.src=movie_data.image_url;
        movie_jacket.style.width="400px";
        //Le genre complet du film
        movie_genre=document.createElement("p");
        movie_genre.innerHTML="Genre : " + movie_data.genres;
        //Sa date de sortie
        movie_release_date=document.createElement("p");
        movie_release_date.innerHTML="Date de sortie : " + movie_data.year;
        //Son Rated
        movie_rate=document.createElement("p");
        movie_rate.innerHTML="Rate : " + movie_data.rated;
        //Son score Imdb
        movie_imdb=document.createElement("p");
        movie_imdb.innerHTML="Imdb : " + movie_data.imdb_score;
        //Son réalisateur
        movie_director=document.createElement("p");
        movie_director.innerHTML="Réalisateur(s) : " + movie_data.directors;
        //La liste des acteurs
        movie_actor=document.createElement("p");
        movie_actor.innerHTML="Acteur(s) : " + movie_data.actors;
        //Sa durée
        movie_duration=document.createElement("p");
        movie_duration.innerHTML="Durée : " + movie_data.duration + " min";        
        //Le pays d’origine
        movie_country=document.createElement("p");
        movie_country.innerHTML="Pays d'origine : " + movie_data.countries;     
        //Le résultat au Box Office
        movie_box_office=document.createElement("p");
        if (movie_data.worldwide_gross_income = "null"){
            movie_box_office.innerHTML="Résultat au Box Office : Pas d'informations" ;  
        } else {
            movie_box_office.innerHTML="Résultat au Box Office : " + movie_data.worldwide_gross_income + movie_data.budget_currency ; 
        }
        //Le résumé du film
        movie_summary=document.createElement("p");
        movie_summary.innerHTML= movie_data.long_description;     
        document.body.appendChild(modal_container);
        modal_container.appendChild(overlay);
        modal_container.appendChild(modal);
        let appendToModal = [close_button,movie_title,movie_jacket,
            movie_genre,movie_duration, movie_release_date,movie_rate,movie_imdb,
            movie_box_office,movie_director,movie_actor,movie_country,movie_summary];
        for (let element of appendToModal) {
            modal.appendChild(element);
          }    
        })
    }

function activeFilmModal(jacketId){
    let filmModalContainer = document.querySelector(".modal-"+(jacketId));
    filmModalContainer.classList.toggle("active");
    modal = filmModalContainer.getElementsByClassName("modal")
}

function mouseOverJacket(jacket){
    jacket.style.opacity = "1";
}

function mouseOutJacket(jacket){
    jacket.style.opacity = "0.8";
}
